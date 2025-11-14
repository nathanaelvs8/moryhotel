// API Configuration
// Ganti URL ini sesuai dengan Railway deployment lu

// Auto-detect environment
let API_URL;

if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    // Local development
    API_URL = 'http://localhost:3000';
} else {
    // Production - Railway
    API_URL = window.location.origin;
}

console.log('🔗 API URL:', API_URL);

// Export untuk digunakan di file lain
window.API_URL = API_URL;