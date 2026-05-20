const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 
<<<<<<< HEAD
const cors = require('cors'); 
require('dotenv').config();

const app = express();
app.use(cors());       
app.use(express.json());

// ==========================================
// 1. DATABASE CONNECTION
=======
const cors = require('cors'); // 1. Import CORS up here
require('dotenv').config();

const app = express(); // 2. App is created HERE

app.use(cors());       // 3. NOW we can use CORS!
app.use(express.json());

// ==========================================
// 1. CONNECT TO XAMPP
>>>>>>> b0756472ff90890ff7b4f34424f36c57d296f149
// ==========================================
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'supershop_db' // Hardcoded fallback just in case!
});

db.connect((err) => {
    if (err) {
        console.error('🔴 Database Connection Failed:', err.message);
        return;
    }
    console.log('🟢 Connected to LIVE MySQL Database (supershop_db)!');
});

// ==========================================
<<<<<<< HEAD
// 2. AUTHENTICATION ROUTES
=======
// 2. REGISTER A USER (Add to VIP List)
>>>>>>> b0756472ff90890ff7b4f34424f36c57d296f149
// ==========================================
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

<<<<<<< HEAD
=======
// ==========================================
// 3. LOGIN A USER (Give the Wristband)
// ==========================================
>>>>>>> b0756472ff90890ff7b4f34424f36c57d296f149
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
    if (!authHeader) return res.status(401).json({ error: "Access Denied!" });
    try {
        const token = authHeader.split(" ")[1]; 
        req.user = jwt.verify(token, "my_secret_key");
        next(); 
    } catch (error) {
        res.status(400).json({ error: "Invalid token!" });
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

<<<<<<< HEAD
=======
// ==========================================
// 4. THE BOUNCER (JWT Middleware)
// ==========================================
const verifyToken = (req, res, next) => {
    // Check if they brought a wristband in the request header
    const authHeader = req.header("Authorization");
    
    if (!authHeader) {
        return res.status(401).json({ error: "Access Denied! No token provided." });
    }

    try {
        // The token usually comes in as "Bearer <long_token_string>"
        // We split it to just get the token part
        const token = authHeader.split(" ")[1]; 

        // Verify it using the EXACT SAME secret key from your login route
        const verified = jwt.verify(token, "my_secret_key");
        
        // Attach the user's decoded ID to the request so we know who they are
        req.user = verified; 
        
        // Let them through the door!
        next(); 
    } catch (error) {
        res.status(400).json({ error: "Invalid or expired token!" });
    }
};

// ==========================================
// 5. A PROTECTED VIP ROOM (Test Route)
// ==========================================
// Notice how we put 'verifyToken' in the middle. The bouncer checks them first!
app.get('/seller-dashboard', verifyToken, (req, res) => {
    res.status(200).json({
        message: "Welcome to the protected Seller Dashboard!",
        your_user_details: req.user 
    });
});

// ==========================================
// START SERVER
// ==========================================
>>>>>>> b0756472ff90890ff7b4f34424f36c57d296f149
app.listen(process.env.PORT || 5000, () => {
    console.log(`🚀 Backend Server running on port 5000`);
});