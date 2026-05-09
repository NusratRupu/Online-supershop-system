const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt'); // The security package you just installed
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

// Create the Database Connection
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
    console.log('Successfully connected to the XAMPP MySQL database!');
});

// ==========================================
// USER REGISTRATION ROUTE
// ==========================================
app.post('/register', async (req, res) => {
    try {
        // Grab the data sent by the user
        const { name, email, password, role } = req.body;

        // 1. Encrypt the password (hashing)
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // 2. Save the user to the XAMPP database
        // We use ? to prevent SQL injection attacks
        const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        
        // If they don't specify a role, default to 'buyer'
        const userRole = role || 'buyer'; 
        const values = [name, email, hashedPassword, userRole];

        db.query(sql, values, (err, result) => {
            if (err) {
                console.error("Database error:", err);
                return res.status(500).json({ error: "Email might already exist or database error." });
            }
            res.status(201).json({ message: "User registered successfully!" });
        });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// ==========================================

// Basic Test Route
app.get('/', (req, res) => {
    res.send('Supershop Backend is alive and connected to the database!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});