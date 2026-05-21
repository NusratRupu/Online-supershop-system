#!/usr/bin/env node

/**
 * Manual Database Initialization Script
 * Run this if you need to manually set up the database
 * Usage: node init-db.js
 */

const mysql = require('mysql2');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST || '127.0.0.1',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
};

const DB_NAME = process.env.DB_NAME || 'supershop_db';

console.log('🔧 Starting Database Initialization...');
console.log('📊 Database Config:', { host: dbConfig.host, user: dbConfig.user, database: DB_NAME });

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
    if (err) {
        console.error('❌ Connection Failed:', err.message);
        console.error('\n💡 Troubleshooting Tips:');
        console.error('   1. Is MySQL running? (Windows: Services > MySQL; Mac: brew services start mysql)');
        console.error('   2. Is the password correct in .env file?');
        console.error('   3. Try: mysql -u root -p (to test manually)');
        process.exit(1);
    }
    console.log('✅ Connected to MySQL Server');
    
    // Step 1: Create Database
    connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME}`, (err) => {
        if (err) {
            console.error('❌ Failed to create database:', err.message);
            connection.end();
            process.exit(1);
        }
        console.log(`✅ Database '${DB_NAME}' created or already exists`);
        
        // Step 2: Use Database
        connection.query(`USE ${DB_NAME}`, (err) => {
            if (err) {
                console.error('❌ Failed to select database:', err.message);
                connection.end();
                process.exit(1);
            }
            console.log(`✅ Selected database '${DB_NAME}'`);
            
            // Step 3: Create Tables
            const createUsersTable = `
                CREATE TABLE IF NOT EXISTS users (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    role VARCHAR(50) NOT NULL DEFAULT 'buyer',
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (id)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `;
            
            const createProductsTable = `
                CREATE TABLE IF NOT EXISTS products (
                    id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                    seller_id INT UNSIGNED NOT NULL,
                    name VARCHAR(255) NOT NULL,
                    description TEXT,
                    price DECIMAL(10, 2) NOT NULL,
                    category VARCHAR(100),
                    stock_quantity INT DEFAULT 0,
                    image VARCHAR(255),
                    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                    PRIMARY KEY (id),
                    FOREIGN KEY (seller_id) REFERENCES users(id) ON DELETE CASCADE
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
            `;
            
            connection.query(createUsersTable, (err) => {
                if (err) {
                    console.error('❌ Failed to create users table:', err.message);
                    connection.end();
                    process.exit(1);
                }
                console.log('✅ Users table created or already exists');
                
                connection.query(createProductsTable, (err) => {
                    if (err) {
                        console.error('❌ Failed to create products table:', err.message);
                        connection.end();
                        process.exit(1);
                    }
                    console.log('✅ Products table created or already exists');
                    
                    // Step 4: Verify tables
                    connection.query('SHOW TABLES', (err, results) => {
                        if (err) {
                            console.error('❌ Failed to verify tables:', err.message);
                            connection.end();
                            process.exit(1);
                        }
                        console.log('\n📋 Tables in database:');
                        results.forEach(row => {
                            console.log('   -', Object.values(row)[0]);
                        });
                        
                        console.log('\n✨ Database initialization complete!');
                        console.log('🚀 You can now start the server with: node server.js\n');
                        
                        connection.end();
                        process.exit(0);
                    });
                });
            });
        });
    });
});

connection.on('error', (err) => {
    console.error('🔴 Connection Error:', err.message);
    process.exit(1);
});
