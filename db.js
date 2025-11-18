const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLDATABASE || 'railway',
    port: process.env.MYSQLPORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test koneksi
pool.getConnection((err, connection) => {
    if (err) {
        console.error('❌ Database connection failed:', err.message);
        console.error('Error details:', err);
        return;
    }
    console.log('✅ Connected to MySQL database');
    console.log('📊 Database:', process.env.MYSQLDATABASE || 'railway');
    connection.release();
});

module.exports = pool; // TANPA .promise()