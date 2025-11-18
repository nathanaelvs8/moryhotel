const mysql = require('mysql2');

// Konfigurasi database - bisa pake environment variable atau hardcode
const db = mysql.createConnection({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLNAME || 'db_hotel_mory',
    port: process.env.MYSQLPORT || 3306
});

// Coba koneksi
db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        return;
    }
    console.log('✅ Connected to MySQL database');
});

module.exports = db;