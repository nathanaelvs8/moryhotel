// API Configuration
// Ganti URL ini sesuai dengan Railway deployment lu
const API_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000' 
    : 'https://moryhotel-production.up.railway.app/';

// Export untuk digunakan di file lain
window.API_URL = API_URL;