const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// ===== ROUTE TESTING =====

// Route utama
app.get('/', (req, res) => {
    res.json({ 
        message: '🏨 Hotel Booking System API',
        status: 'running',
        endpoints: {
            test: '/test-db',
            tipeKamar: '/api/tipe-kamar',
            kamar: '/api/kamar',
            tamu: '/api/tamu',
            reservasi: '/api/reservasi'
        }
    });
});

// Test koneksi database
app.get('/test-db', (req, res) => {
    db.query('SELECT 1 + 1 AS result', (err, results) => {
        if (err) {
            return res.status(500).json({ 
                error: 'Database error', 
                details: err.message 
            });
        }
        res.json({ 
            message: '✅ Database connected!', 
            result: results[0].result 
        });
    });
});

// ===== TIPE KAMAR API =====

// GET semua tipe kamar
app.get('/api/tipe-kamar', (req, res) => {
    db.query('SELECT * FROM tipe_kamar', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET tipe kamar by ID
app.get('/api/tipe-kamar/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM tipe_kamar WHERE id_tipe_kamar = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Tipe kamar tidak ditemukan' });
        res.json(results[0]);
    });
});

// POST tambah tipe kamar
app.post('/api/tipe-kamar', (req, res) => {
    const { nama_tipe, harga_per_malam, deskripsi, fasilitas } = req.body;
    const sql = 'INSERT INTO tipe_kamar (nama_tipe, harga_per_malam, deskripsi, fasilitas) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [nama_tipe, harga_per_malam, deskripsi, fasilitas], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            message: 'Tipe kamar berhasil ditambahkan',
            id: result.insertId 
        });
    });
});

// ===== KAMAR API =====

// GET semua kamar dengan info tipe
app.get('/api/kamar', (req, res) => {
    const sql = `
        SELECT k.*, t.nama_tipe, t.harga_per_malam 
        FROM kamar k 
        JOIN tipe_kamar t ON k.id_tipe_kamar = t.id_tipe_kamar
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET kamar tersedia
app.get('/api/kamar/tersedia', (req, res) => {
    const sql = `
        SELECT k.*, t.nama_tipe, t.harga_per_malam 
        FROM kamar k 
        JOIN tipe_kamar t ON k.id_tipe_kamar = t.id_tipe_kamar
        WHERE k.status_kamar = 'Tersedia'
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// ===== TAMU API =====

// GET semua tamu
app.get('/api/tamu', (req, res) => {
    db.query('SELECT * FROM tamu', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST tambah tamu
app.post('/api/tamu', (req, res) => {
    const { nama_lengkap, email, no_telepon, alamat } = req.body;
    const sql = 'INSERT INTO tamu (nama_lengkap, email, no_telepon, alamat) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [nama_lengkap, email, no_telepon, alamat], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            message: 'Tamu berhasil ditambahkan',
            id: result.insertId 
        });
    });
});

// ===== RESERVASI API =====

// GET semua reservasi
app.get('/api/reservasi', (req, res) => {
    const sql = `
        SELECT r.*, t.nama_lengkap, k.no_kamar, s.nama_staf
        FROM reservasi r
        JOIN tamu t ON r.id_tamu = t.id_tamu
        JOIN kamar k ON r.id_kamar = k.id_kamar
        JOIN staf s ON r.id_staf = s.id_staf
        ORDER BY r.id_reservasi DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST buat reservasi baru
app.post('/api/reservasi', (req, res) => {
    const { kode_booking, id_tamu, id_kamar, id_staf, tanggal_check_in, tanggal_check_out, total_biaya } = req.body;
    const sql = `
        INSERT INTO reservasi 
        (kode_booking, id_tamu, id_kamar, id_staf, tanggal_check_in, tanggal_check_out, total_biaya, status_reservasi) 
        VALUES (?, ?, ?, ?, ?, ?, ?, 'Dipesan')
    `;
    
    db.query(sql, [kode_booking, id_tamu, id_kamar, id_staf, tanggal_check_in, tanggal_check_out, total_biaya], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        
        // Update status kamar jadi 'Dipesan'
        db.query('UPDATE kamar SET status_kamar = "Dipesan" WHERE id_kamar = ?', [id_kamar]);
        
        res.status(201).json({ 
            message: 'Reservasi berhasil dibuat',
            id: result.insertId 
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
});