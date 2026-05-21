# 🗄️ Database Setup Guide - Online Supershop System

## Permanent Solution - Auto-Initialization

The backend server now **automatically creates and initializes the database** when it starts. You don't need to manually run schema.sql anymore!

### How It Works
1. **Connects to MySQL** with root credentials from `.env`
2. **Creates the database** `supershop_db` if it doesn't exist
3. **Creates all tables** (users, products) if they don't exist
4. **Auto-reconnects** if the connection drops
5. **Retries every 5 seconds** on connection failures

### ✅ Prerequisites

Make sure you have:
1. **MySQL Server running** on your machine
   - Windows: Start MySQL via Services or MySQL Workbench
   - Mac: `brew services start mysql`
   - Linux: `sudo service mysql start`

2. **Root user access** (default MySQL setup)

3. `.env` file configured in `/backend` folder:
```
PORT=5000
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=
DB_NAME=supershop_db
```

### 🚀 To Start the Server

```bash
cd backend
npm install  # First time only
node server.js
```

### ✅ Verify It's Working

You should see in the console:
```
✅ Database created or already exists
✅ All tables initialized successfully
🟢 Connected to MySQL Database: supershop_db
🚀 Backend Server running on port 5000
```

### 🆘 If You Still Get Database Errors

#### Error: "ER_ACCESS_DENIED_FOR_USER"
- **Cause**: Wrong MySQL credentials
- **Fix**: Update `.env` with correct DB_USER and DB_PASSWORD
```
DB_USER=root
DB_PASSWORD=your_mysql_password
```

#### Error: "ECONNREFUSED"
- **Cause**: MySQL server is not running
- **Fix**: Start MySQL:
  - Windows: Start `MySQL80` service in Services
  - Mac: `brew services start mysql`
  - Linux: `sudo service mysql start`

#### Error: "ER_NO_DB_ERROR"
- **Cause**: Database doesn't exist and can't be created
- **Fix**: Make sure your MySQL root user has CREATE privilege:
```bash
mysql -u root -p
mysql> GRANT ALL PRIVILEGES ON *.* TO 'root'@'localhost';
mysql> FLUSH PRIVILEGES;
```

### 📊 Check Your Database Manually

```bash
mysql -u root
mysql> USE supershop_db;
mysql> SHOW TABLES;
mysql> SELECT * FROM users;
```

### 🔄 Reset Database (If Needed)

To completely reset and reinitialize:
```bash
mysql -u root
mysql> DROP DATABASE supershop_db;
mysql> exit
```

Then restart the server - it will automatically recreate everything!

---

**✨ Bottom Line**: Just start the server and let it handle the database setup automatically!
