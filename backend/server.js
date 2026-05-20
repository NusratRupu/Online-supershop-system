const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
const cors = require('cors'); 
require('dotenv').config();

const app = express();
app.use(cors());       
app.use(express.json());

// ==========================================
// 1. CONNECT TO DATABASE
// ==========================================
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'supershop_db' // Hardcoded fallback just in case!
});

db.connect((err) => {
    if (err) {
        console.error('🔴 Database Connection Failed:', err);
        return;
    }
    console.log('🟢 Connected to LIVE MySQL Database (supershop_db)!');
});

// ==========================================
// 2. AUTHENTICATION ROUTES
// ==========================================

// REGISTER A USER
app.post('/register', async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        
        db.query(sql, [name, email, hashedPassword, role || 'buyer'], (err, result) => {
            if (err) {
                console.log("🔴 Registration Error:", err.sqlMessage);
                return res.status(500).json({ error: "Email already exists!" });
            }
            res.status(201).json({ message: "User registered successfully!" });
        });
    } catch (error) {
        res.status(500).json({ error: "Server error during registration." });
    }
});

// LOGIN A USER
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ?", [email], async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error." });
        if (results.length === 0) return res.status(401).json({ error: "Wrong email!" });
        
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ error: "Wrong password!" });
        
        const token = jwt.sign({ id: user.id, role: user.role }, "my_secret_key", { expiresIn: "2h" });
        res.status(200).json({ message: "Login successful!", token: token, user: { name: user.name, role: user.role } });
    });
});

// ==========================================
// 3. MIDDLEWARE (The Bouncers)
// ==========================================
const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    
    if (!authHeader) {
        return res.status(401).json({ error: "Access Denied! No token provided." });
    }

    try {
        const token = authHeader.split(" ")[1]; 
        req.user = jwt.verify(token, "my_secret_key");
        next(); 
    } catch (error) {
        res.status(400).json({ error: "Invalid or expired token!" });
    }
};

const verifySeller = (req, res, next) => {
    if (req.user.role !== 'seller' && req.user.role !== 'admin') {
        return res.status(403).json({ error: "Access Denied! Sellers only." });
    }
    next();
};

// ==========================================
// 4. PRODUCT ROUTES
// ==========================================
app.post('/products', verifyToken, verifySeller, (req, res) => {
    const { name, description, price, category, stock_quantity } = req.body;
    const sql = "INSERT INTO products (seller_id, name, description, price, category, stock_quantity) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(sql, [req.user.id, name, description, price, category, stock_quantity], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error." });
        res.status(201).json({ message: "Product added!" });
    });
});

app.get('/products', (req, res) => {
    db.query("SELECT * FROM products", (err, results) => {
        if (err) return res.status(500).json({ error: "Database error." });
        res.status(200).json(results);
         });
});
        // FETCH PRODUCTS FOR A SPECIFIC SELLER
app.get('/seller-products', verifyToken, verifySeller, (req, res) => {
    // req.user.id comes from the verified JWT token!
    const sql = "SELECT * FROM products WHERE seller_id = ?";
    db.query(sql, [req.user.id], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error." });
        res.status(200).json(results);
    });
});
    

// ==========================================
// 5. A PROTECTED VIP ROOM (Test Route)
// ==========================================
app.get('/seller-dashboard', verifyToken, (req, res) => {
    res.status(200).json({
        message: "Welcome to the protected Seller Dashboard!",
        your_user_details: req.user 
    });
});

// ==========================================
// 6. START SERVER
// ==========================================
app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Backend Server running on port 5000`);
});