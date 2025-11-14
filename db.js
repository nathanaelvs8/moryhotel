const mysql = require('mysql2');

// Konfigurasi database - bisa pake environment variable atau hardcode
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'db_hotel_mory',
    port: process.env.DB_PORT || 3306
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