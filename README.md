# 🚀 Setup Instructions - Mory Hotel

## Langkah Setup dari Awal

### 1. Push ke GitHub

```bash
cd C:\Users\user\moryhotel

# Add semua file
git add .

# Commit
git commit -m "Fix login and add complete setup"

# Push
git push origin main
```

### 2. Railway Auto-Deploy

Railway akan otomatis detect dan deploy dalam 1-2 menit.

### 3. Setup Database di Railway MySQL

Setelah deploy selesai, import database schema:

#### **Via MySQL Workbench:**

1. **Download MySQL Workbench**: https://dev.mysql.com/downloads/workbench/

2. **Buat Connection Baru:**
   - Connection Name: `Railway Mory Hotel`
   - Hostname: `mysql.railway.internal` (atau dari Railway variables)
   - Port: `3306`
   - Username: `root`  
   - Password: `[dari Railway MySQL variables]`
   - Default Schema: `railway`

3. **Connect & Run Schema:**
   - File → Open SQL Script → pilih `schema.sql`
   - Execute (⚡ icon)

4. **Insert Data Staf:**
   - File → Open SQL Script → pilih `insert_staf.sql`
   - Execute (⚡ icon)

#### **Via Railway Data Tab:**

1. Buka Railway Dashboard
2. Klik service **MySQL**
3. Tab **"Database"** → **"Data"**
4. Klik **"Connect"** atau icon Query
5. Copy-paste isi `schema.sql`
6. Run
7. Copy-paste isi `insert_staf.sql`
8. Run

#### **Via Terminal (Advanced):**

```bash
# Connect ke Railway MySQL
mysql -h mysql.railway.internal -P 3306 -u root -p railway < schema.sql
mysql -h mysql.railway.internal -P 3306 -u root -p railway < insert_staf.sql

# Atau dengan public URL
mysql -h [MYSQLHOST dari Railway] -P [MYSQLPORT] -u root -p railway < schema.sql
```

### 4. Test Login

Buka: `https://[your-railway-url].up.railway.app/`

**Login Credentials:**

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Resepsionis | `resepsionis` | `resepsi123` |
| Manager | `manager` | `manager123` |

---

## 🔧 Troubleshooting

### Error: "Username atau password salah"

**Penyebab:** Data staf belum ada di database atau password tidak match.

**Solusi:**
1. Cek database: `SELECT * FROM staf;`
2. Pastikan ada data staf
3. Run script `insert_staf.sql`

### Error: "Failed to load resource: 404"

**Penyebab:** Frontend belum ter-deploy atau folder `public/` tidak ada.

**Solusi:**
1. Pastikan folder `public/` ada di GitHub repo
2. Check Railway logs: ada error saat build/deploy?
3. Pastikan `app.use(express.static('public'));` ada di server.js

### Error: "Database connection failed"

**Penyebab:** Environment variables belum di-set di Railway.

**Solusi:**
1. Buka Railway → service Node.js → Variables
2. Pastikan ada:
   - `DB_HOST`
   - `DB_PORT`
   - `DB_USER`
   - `DB_PASSWORD`
   - `DB_NAME`
3. Nilai ambil dari MySQL service variables

---

## 📋 Checklist Setup

Cek satu-satu:

- [ ] Code sudah di-push ke GitHub
- [ ] Railway deployment status: **Success**
- [ ] Environment variables sudah di-set di Railway
- [ ] Database schema sudah di-import (`schema.sql`)
- [ ] Data staf sudah di-insert (`insert_staf.sql`)
- [ ] Bisa akses homepage: `https://[url].up.railway.app/`
- [ ] Bisa login dengan username: `admin`, password: `admin123`
- [ ] Dashboard muncul setelah login

---

## 🎯 Quick Test Commands

### Test API Endpoints:

```bash
# Test root (harus redirect ke /login.html)
curl https://[your-url].up.railway.app/

# Test database connection
curl https://[your-url].up.railway.app/test-db

# Test login
curl -X POST https://[your-url].up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'

# Test get tipe kamar
curl https://[your-url].up.railway.app/api/tipe-kamar
```

---

## 🔐 Security Note

⚠️ **PENTING:** Password di database saat ini menggunakan **plain text** untuk kemudahan testing/development.

Untuk **production**, sebaiknya ganti dengan **bcrypt hash**:

```sql
-- Generate bcrypt hash untuk password (gunakan online tool atau code)
-- Hash untuk "admin123": $2a$10$[hash_string]

UPDATE staf 
SET password = '$2a$10$[bcrypt_hash_password]' 
WHERE username = 'admin';
```

Code di `server.js` sudah support both plain text dan bcrypt hash.

---

## 📞 Need Help?

Kalau masih error:
1. Screenshot error di browser console (F12)
2. Check Railway deployment logs
3. Verify database connection via MySQL client

**Happy Coding! 🚀**