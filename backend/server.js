const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // Added for Login tokens
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// ==========================================
// 1. LIVE DATABASE CONNECTION
// ==========================================
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err.message);
        return;
    }
    console.log('Successfully connected to the LIVE XAMPP MySQL database!');
});

// ==========================================
// 2. USER REGISTRATION ROUTE
// ==========================================
app.post('/register', async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        // Encrypt the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Save to real database
        const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        const userRole = role || 'buyer'; 
        
        db.query(sql, [name, email, hashedPassword, userRole], (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Email might already exist or database error." });
            }
            res.status(201).json({ message: "User registered successfully in the live database!" });
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ==========================================
// 3. USER LOGIN ROUTE (NEW)
// ==========================================
app.post('/login', (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user in the database by email
        const sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, [email], async (err, results) => {
            if (err) {
                return res.status(500).json({ error: "Database error" });
            }
            
            // If the array is empty, the email doesn't exist
            if (results.length === 0) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            const user = results[0]; // Grab the specific user row

            // 2. Compare the typed password with the encrypted password in the DB
            const isMatch = await bcrypt.compare(password, user.password);
            
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            // 3. Generate the JWT "VIP Pass" Token
            // Using a fallback secret string if one isn't in your .env file yet
            const jwtSecret = process.env.JWT_SECRET || "supershop_super_secret_key_123";
            const token = jwt.sign(
                { id: user.id, role: user.role }, 
                jwtSecret, 
                { expiresIn: "2h" } // Token expires in 2 hours for security
            );

            res.status(200).json({ 
                message: "Login successful!",
                token: token,
                user: { id: user.id, name: user.name, role: user.role }
            });
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

// ==========================================
// Start Server
// ==========================================
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});