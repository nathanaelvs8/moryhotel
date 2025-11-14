# 🏨 Mory Hotel - Sistem Reservasi Hotel

Sistem manajemen reservasi hotel berbasis web dengan RESTful API dan Admin Dashboard.

## 📁 Struktur Folder

```
moryhotel/
├── node_modules/          (auto-generated, jangan di-push ke GitHub)
├── public/                (Frontend files)
│   ├── css/
│   │   ├── style.css      (Global styles)
│   │   └── admin.css      (Admin-specific styles)
│   ├── js/
│   │   ├── config.js      (API configuration)
│   │   ├── auth.js        (Authentication logic)
│   │   └── admin.js       (Admin utility functions)
│   ├── login.html         (Login page)
│   ├── dashboard.html     (Dashboard)
│   └── reservasi.html     (Reservasi management)
├── server.js              (Backend API)
├── db.js                  (Database configuration)
├── package.json
├── package-lock.json
└── .gitignore
```

## 🚀 Setup Local

### 1. Install Dependencies

```bash
cd C:\Users\user\moryhotel
npm install
```

### 2. Configure Database

Edit `db.js` kalau mau test di local dengan database local:

```javascript
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'hotel_db',
    port: 3306
});
```

### 3. Run Server

```bash
npm start
```

atau

```bash
node server.js
```

### 4. Test di Browser

- API: `http://localhost:3000`
- Login: `http://localhost:3000/login.html`

## 🌐 Deploy ke Railway

### 1. Push ke GitHub

```bash
# Pastikan sudah di folder project
cd C:\Users\user\moryhotel

# Add semua file
git add .

# Commit
git commit -m "Add complete hotel management system"

# Push
git push origin main
```

### 2. Railway Auto-Deploy

Railway akan otomatis:
- Detect perubahan
- Install dependencies (`npm install`)
- Run `node server.js`
- Deploy ke production

### 3. Environment Variables di Railway

Pastikan variables ini sudah diset di Railway:

```
DB_HOST = mysql.railway.internal
DB_PORT = 3306
DB_USER = root
DB_PASSWORD = [password dari Railway MySQL]
DB_NAME = railway
```

### 4. Update API URL

Setelah deploy, URL Railway lu akan jadi: `https://xxx.up.railway.app`

File `public/js/config.js` sudah handle ini otomatis:
- Local: `http://localhost:3000`
- Production: Pake hostname Railway

## 📝 Fitur

### Backend API

✅ **Authentication**
- Login staf dengan username & password
- Session management dengan localStorage

✅ **Dashboard Statistics**
- Total tamu
- Kamar tersedia vs total
- Reservasi aktif
- Pendapatan bulan ini

✅ **Manajemen Tipe Kamar**
- CRUD operations
- View all, create, update, delete

✅ **Manajemen Kamar**
- CRUD operations
- Filter kamar tersedia
- Update status kamar

✅ **Manajemen Tamu**
- CRUD operations
- Data tamu lengkap

✅ **Manajemen Reservasi**
- Create reservasi baru
- Update status (Dipesan → Check-in → Selesai)
- Cancel/batalkan reservasi
- Auto-generate kode booking
- Auto-update status kamar

✅ **Pembayaran**
- Record pembayaran
- Multiple metode pembayaran

### Frontend Dashboard

✅ **Login System**
- Secure authentication
- Remember user session

✅ **Dashboard**
- Real-time statistics
- Recent reservations table
- User info display

✅ **Reservasi Management**
- Add new reservasi via modal
- Update status via modal
- Cancel reservasi
- Auto-populate dropdowns (tamu, kamar)

✅ **Responsive Design**
- Mobile-friendly
- Tablet-optimized

## 🎨 Customization

### Ganti Warna Theme

Edit `public/css/admin.css`:

```css
/* Ubah gradient warna sidebar */
.sidebar {
    background: linear-gradient(135deg, #YOUR_COLOR1 0%, #YOUR_COLOR2 100%);
}
```

### Update API URL

Edit `public/js/config.js`:

```javascript
const API_URL = 'https://your-railway-url.up.railway.app';
```

## 📡 API Endpoints

### Authentication
```
POST /api/auth/login
Body: { username, password }
```

### Dashboard
```
GET /api/dashboard/stats
```

### Tipe Kamar
```
GET    /api/tipe-kamar          # Get all
GET    /api/tipe-kamar/:id      # Get by ID
POST   /api/tipe-kamar          # Create
PUT    /api/tipe-kamar/:id      # Update
DELETE /api/tipe-kamar/:id      # Delete
```

### Kamar
```
GET    /api/kamar               # Get all
GET    /api/kamar/tersedia      # Get available
POST   /api/kamar               # Create
PUT    /api/kamar/:id           # Update
DELETE /api/kamar/:id           # Delete
```

### Tamu
```
GET    /api/tamu                # Get all
GET    /api/tamu/:id            # Get by ID
POST   /api/tamu                # Create
PUT    /api/tamu/:id            # Update
DELETE /api/tamu/:id            # Delete
```

### Reservasi
```
GET    /api/reservasi           # Get all
GET    /api/reservasi/:id       # Get by ID
POST   /api/reservasi           # Create
PUT    /api/reservasi/:id/status # Update status
DELETE /api/reservasi/:id       # Cancel
```

### Pembayaran
```
GET    /api/pembayaran          # Get all
POST   /api/pembayaran          # Create
```

## 🔐 Login Demo

**Username:** `admin`  
**Password:** `admin123`

## 🗄️ Database Schema

```sql
-- Tables
tipe_kamar    (id, nama_tipe, harga, deskripsi, fasilitas)
kamar         (id, no_kamar, id_tipe_kamar, status)
tamu          (id, nama, email, no_telepon, alamat)
staf          (id, nama, username, password, peran)
reservasi     (id, kode_booking, id_tamu, id_kamar, id_staf, 
               tanggal_check_in, tanggal_check_out, total, status)
pembayaran    (id, id_reservasi, tanggal, jumlah, metode, status)
```

## 🐛 Troubleshooting

### Frontend ga bisa konek ke API

1. Cek `public/js/config.js` - pastikan API_URL benar
2. Cek CORS di `server.js`
3. Cek Railway logs

### Database connection failed

1. Cek environment variables di Railway
2. Pastikan MySQL service running
3. Cek credentials di Railway MySQL Variables

### Login gagal

1. Cek database: `SELECT * FROM staf WHERE username = 'admin'`
2. Pastikan ada data staf
3. Password default: `admin123`

### Modal tidak muncul

1. Cek console browser (F12)
2. Pastikan file JS ter-load semua
3. Clear browser cache

## 🔄 Update Code

Kalau ada perubahan code:

```bash
git add .
git commit -m "Update: deskripsi perubahan"
git push origin main
```

Railway auto-deploy dalam 1-2 menit.

## 📞 Support

Issues? Contact developer atau cek:
- Railway logs: `railway logs`
- Browser console: F12 → Console
- Network tab: F12 → Network

## 📄 License

MIT License - Free to use & modify!

---

**Made with ❤️ for Mory Hotel**

**Version:** 2.0  
**Last Update:** 2025