const express = require('express');
const mysql = require('mysql2'); // Importing the database driver
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware to parse JSON
app.use(express.json());

// 1. Create the Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// 2. Test the Connection
db.connect((err) => {
    if (err) {
        console.error('Database connection failed: ', err.message);
        return;
    }
    console.log('Successfully connected to the XAMPP MySQL database!');
});

// Basic Test Route
app.get('/', (req, res) => {
    res.send('Supershop Backend is alive and connected to the database!');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});