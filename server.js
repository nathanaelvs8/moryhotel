const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));
app.use(express.json());
app.use(express.static('public')); // Serve static files dari folder public

// ===== ROUTE TESTING =====

// Route utama - redirect ke login page
app.get('/', (req, res) => {
    res.redirect('/login.html');
});

// API info endpoint
app.get('/api', (req, res) => {
    res.json({ 
        message: '🏨 Hotel Booking System API',
        status: 'running',
        version: '2.0',
        endpoints: {
            test: '/test-db',
            auth: '/api/auth/login',
            dashboard: '/api/dashboard/stats',
            tipeKamar: '/api/tipe-kamar',
            kamar: '/api/kamar',
            tamu: '/api/tamu',
            reservasi: '/api/reservasi',
            pembayaran: '/api/pembayaran'
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

// ===== AUTH API =====

// Login staf
app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    
    const sql = 'SELECT * FROM staf WHERE username = ?';
    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) {
            return res.status(401).json({ message: 'Username atau password salah' });
        }
        
        const staf = results[0];
        
        // Simple password check (untuk demo)
        if (password === 'admin123') {
            res.json({
                success: true,
                message: 'Login berhasil',
                data: {
                    id_staf: staf.id_staf,
                    nama_staf: staf.nama_staf,
                    username: staf.username,
                    peran: staf.peran
                }
            });
        } else {
            res.status(401).json({ message: 'Username atau password salah' });
        }
    });
});

// ===== DASHBOARD STATS API =====

app.get('/api/dashboard/stats', (req, res) => {
    const stats = {};
    
    // Total tamu
    db.query('SELECT COUNT(*) as total FROM tamu', (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        stats.total_tamu = result[0].total;
        
        // Total kamar
        db.query('SELECT COUNT(*) as total FROM kamar', (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            stats.total_kamar = result[0].total;
            
            // Kamar tersedia
            db.query('SELECT COUNT(*) as total FROM kamar WHERE status_kamar = "Tersedia"', (err, result) => {
                if (err) return res.status(500).json({ error: err.message });
                stats.kamar_tersedia = result[0].total;
                
                // Total reservasi
                db.query('SELECT COUNT(*) as total FROM reservasi', (err, result) => {
                    if (err) return res.status(500).json({ error: err.message });
                    stats.total_reservasi = result[0].total;
                    
                    // Reservasi aktif
                    db.query('SELECT COUNT(*) as total FROM reservasi WHERE status_reservasi IN ("Dipesan", "Check-in")', (err, result) => {
                        if (err) return res.status(500).json({ error: err.message });
                        stats.reservasi_aktif = result[0].total;
                        
                        // Total pendapatan bulan ini
                        db.query(`
                            SELECT COALESCE(SUM(r.total_biaya), 0) as total 
                            FROM reservasi r 
                            WHERE MONTH(r.tanggal_check_in) = MONTH(CURRENT_DATE())
                            AND YEAR(r.tanggal_check_in) = YEAR(CURRENT_DATE())
                            AND r.status_reservasi != 'Dibatalkan'
                        `, (err, result) => {
                            if (err) return res.status(500).json({ error: err.message });
                            stats.pendapatan_bulan_ini = result[0].total;
                            
                            res.json(stats);
                        });
                    });
                });
            });
        });
    });
});

// ===== TIPE KAMAR API =====

// GET semua tipe kamar
app.get('/api/tipe-kamar', (req, res) => {
    db.query('SELECT * FROM tipe_kamar ORDER BY id_tipe_kamar', (err, results) => {
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
            success: true,
            message: 'Tipe kamar berhasil ditambahkan',
            id: result.insertId 
        });
    });
});

// PUT update tipe kamar
app.put('/api/tipe-kamar/:id', (req, res) => {
    const { id } = req.params;
    const { nama_tipe, harga_per_malam, deskripsi, fasilitas } = req.body;
    const sql = 'UPDATE tipe_kamar SET nama_tipe = ?, harga_per_malam = ?, deskripsi = ?, fasilitas = ? WHERE id_tipe_kamar = ?';
    
    db.query(sql, [nama_tipe, harga_per_malam, deskripsi, fasilitas, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ 
            success: true,
            message: 'Tipe kamar berhasil diupdate' 
        });
    });
});

// DELETE tipe kamar
app.delete('/api/tipe-kamar/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tipe_kamar WHERE id_tipe_kamar = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ 
            success: true,
            message: 'Tipe kamar berhasil dihapus' 
        });
    });
});

// ===== KAMAR API =====

// GET semua kamar dengan info tipe
app.get('/api/kamar', (req, res) => {
    const sql = `
        SELECT k.*, t.nama_tipe, t.harga_per_malam, t.fasilitas
        FROM kamar k 
        JOIN tipe_kamar t ON k.id_tipe_kamar = t.id_tipe_kamar
        ORDER BY k.no_kamar
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET kamar tersedia
app.get('/api/kamar/tersedia', (req, res) => {
    const sql = `
        SELECT k.*, t.nama_tipe, t.harga_per_malam, t.fasilitas
        FROM kamar k 
        JOIN tipe_kamar t ON k.id_tipe_kamar = t.id_tipe_kamar
        WHERE k.status_kamar = 'Tersedia'
        ORDER BY k.no_kamar
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST tambah kamar
app.post('/api/kamar', (req, res) => {
    const { no_kamar, id_tipe_kamar, status_kamar } = req.body;
    const sql = 'INSERT INTO kamar (no_kamar, id_tipe_kamar, status_kamar) VALUES (?, ?, ?)';
    
    db.query(sql, [no_kamar, id_tipe_kamar, status_kamar || 'Tersedia'], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            success: true,
            message: 'Kamar berhasil ditambahkan',
            id: result.insertId 
        });
    });
});

// PUT update kamar
app.put('/api/kamar/:id', (req, res) => {
    const { id } = req.params;
    const { no_kamar, id_tipe_kamar, status_kamar } = req.body;
    const sql = 'UPDATE kamar SET no_kamar = ?, id_tipe_kamar = ?, status_kamar = ? WHERE id_kamar = ?';
    
    db.query(sql, [no_kamar, id_tipe_kamar, status_kamar, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ 
            success: true,
            message: 'Kamar berhasil diupdate' 
        });
    });
});

// DELETE kamar
app.delete('/api/kamar/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM kamar WHERE id_kamar = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ 
            success: true,
            message: 'Kamar berhasil dihapus' 
        });
    });
});

// ===== TAMU API =====

// GET semua tamu
app.get('/api/tamu', (req, res) => {
    db.query('SELECT * FROM tamu ORDER BY id_tamu DESC', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET tamu by ID
app.get('/api/tamu/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM tamu WHERE id_tamu = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Tamu tidak ditemukan' });
        res.json(results[0]);
    });
});

// POST tambah tamu
app.post('/api/tamu', (req, res) => {
    const { nama_lengkap, email, no_telepon, alamat } = req.body;
    const sql = 'INSERT INTO tamu (nama_lengkap, email, no_telepon, alamat) VALUES (?, ?, ?, ?)';
    
    db.query(sql, [nama_lengkap, email, no_telepon, alamat], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            success: true,
            message: 'Tamu berhasil ditambahkan',
            id: result.insertId 
        });
    });
});

// PUT update tamu
app.put('/api/tamu/:id', (req, res) => {
    const { id } = req.params;
    const { nama_lengkap, email, no_telepon, alamat } = req.body;
    const sql = 'UPDATE tamu SET nama_lengkap = ?, email = ?, no_telepon = ?, alamat = ? WHERE id_tamu = ?';
    
    db.query(sql, [nama_lengkap, email, no_telepon, alamat, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ 
            success: true,
            message: 'Data tamu berhasil diupdate' 
        });
    });
});

// DELETE tamu
app.delete('/api/tamu/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM tamu WHERE id_tamu = ?', [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ 
            success: true,
            message: 'Data tamu berhasil dihapus' 
        });
    });
});

// ===== RESERVASI API =====

// GET semua reservasi
app.get('/api/reservasi', (req, res) => {
    const sql = `
        SELECT r.*, 
               t.nama_lengkap, t.no_telepon,
               k.no_kamar, 
               tk.nama_tipe,
               s.nama_staf
        FROM reservasi r
        JOIN tamu t ON r.id_tamu = t.id_tamu
        JOIN kamar k ON r.id_kamar = k.id_kamar
        JOIN tipe_kamar tk ON k.id_tipe_kamar = tk.id_tipe_kamar
        JOIN staf s ON r.id_staf = s.id_staf
        ORDER BY r.id_reservasi DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// GET reservasi by ID
app.get('/api/reservasi/:id', (req, res) => {
    const { id } = req.params;
    const sql = `
        SELECT r.*, 
               t.nama_lengkap, t.email, t.no_telepon, t.alamat,
               k.no_kamar, 
               tk.nama_tipe, tk.harga_per_malam,
               s.nama_staf
        FROM reservasi r
        JOIN tamu t ON r.id_tamu = t.id_tamu
        JOIN kamar k ON r.id_kamar = k.id_kamar
        JOIN tipe_kamar tk ON k.id_tipe_kamar = tk.id_tipe_kamar
        JOIN staf s ON r.id_staf = s.id_staf
        WHERE r.id_reservasi = ?
    `;
    db.query(sql, [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Reservasi tidak ditemukan' });
        res.json(results[0]);
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
            success: true,
            message: 'Reservasi berhasil dibuat',
            id: result.insertId 
        });
    });
});

// PUT update status reservasi
app.put('/api/reservasi/:id/status', (req, res) => {
    const { id } = req.params;
    const { status_reservasi } = req.body;
    
    // Get reservasi detail first
    db.query('SELECT * FROM reservasi WHERE id_reservasi = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Reservasi tidak ditemukan' });
        
        const reservasi = results[0];
        
        // Update reservasi status
        db.query('UPDATE reservasi SET status_reservasi = ? WHERE id_reservasi = ?', [status_reservasi, id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            
            // Update status kamar based on reservasi status
            let status_kamar = 'Tersedia';
            if (status_reservasi === 'Dipesan' || status_reservasi === 'Check-in') {
                status_kamar = 'Dipesan';
            }
            
            db.query('UPDATE kamar SET status_kamar = ? WHERE id_kamar = ?', [status_kamar, reservasi.id_kamar]);
            
            res.json({ 
                success: true,
                message: 'Status reservasi berhasil diupdate' 
            });
        });
    });
});

// DELETE reservasi (cancel)
app.delete('/api/reservasi/:id', (req, res) => {
    const { id } = req.params;
    
    // Get reservasi detail first
    db.query('SELECT * FROM reservasi WHERE id_reservasi = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ message: 'Reservasi tidak ditemukan' });
        
        const reservasi = results[0];
        
        // Update status to Dibatalkan instead of delete
        db.query('UPDATE reservasi SET status_reservasi = "Dibatalkan" WHERE id_reservasi = ?', [id], (err) => {
            if (err) return res.status(500).json({ error: err.message });
            
            // Update status kamar to Tersedia
            db.query('UPDATE kamar SET status_kamar = "Tersedia" WHERE id_kamar = ?', [reservasi.id_kamar]);
            
            res.json({ 
                success: true,
                message: 'Reservasi berhasil dibatalkan' 
            });
        });
    });
});

// ===== PEMBAYARAN API =====

// GET semua pembayaran
app.get('/api/pembayaran', (req, res) => {
    const sql = `
        SELECT p.*, r.kode_booking, t.nama_lengkap
        FROM pembayaran p
        JOIN reservasi r ON p.id_reservasi = r.id_reservasi
        JOIN tamu t ON r.id_tamu = t.id_tamu
        ORDER BY p.id_pembayaran DESC
    `;
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// POST tambah pembayaran
app.post('/api/pembayaran', (req, res) => {
    const { id_reservasi, tanggal_pembayaran, jumlah_pembayaran, metode_pembayaran } = req.body;
    const sql = `
        INSERT INTO pembayaran 
        (id_reservasi, tanggal_pembayaran, jumlah_pembayaran, metode_pembayaran, status_pembayaran) 
        VALUES (?, ?, ?, ?, 'Sudah Bayar')
    `;
    
    db.query(sql, [id_reservasi, tanggal_pembayaran, jumlah_pembayaran, metode_pembayaran], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
            success: true,
            message: 'Pembayaran berhasil dicatat',
            id: result.insertId 
        });
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
});