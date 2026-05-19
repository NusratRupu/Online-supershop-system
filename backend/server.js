const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
require('dotenv').config();

const app = express();
app.use(express.json());

// 1. CONNECT TO XAMPP
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to LIVE Database!');
});

// 2. REGISTER A USER (Add to VIP List)
app.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    
    // Scramble the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Save to database
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, hashedPassword, role || 'buyer'], (err, result) => {
        if (err) return res.status(500).json({ error: "Email already exists!" });
        res.status(201).json({ message: "User registered successfully!" });
    });
});

// 3. LOGIN A USER (Give the Wristband)
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    // Look up the email
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (results.length === 0) return res.status(401).json({ error: "Wrong email!" });

        const user = results[0];

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Wrong password!" });

        // Generate the JWT Wristband
        const token = jwt.sign({ id: user.id }, "my_secret_key", { expiresIn: "2h" });

        res.status(200).json({ message: "Login successful!", token: token });
    });
});

// START SERVER
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port 5000`);
});