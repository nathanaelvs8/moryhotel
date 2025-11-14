// Authentication Functions

// Check if user is logged in
function checkAuth() {
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = '/login.html';
        return false;
    }
    return true;
}

// Get current user data
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Logout function
function logout() {
    if (confirm('Yakin ingin logout?')) {
        localStorage.clear();
        window.location.href = '/login.html';
    }
}

// Login function
async function login(username, password) {
    try {
        const response = await fetch(`${window.API_URL}/api/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            localStorage.setItem('user', JSON.stringify(data.data));
            localStorage.setItem('isLoggedIn', 'true');
            return { success: true };
        } else {
            return { success: false, message: data.message };
        }
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, message: 'Terjadi kesalahan koneksi' };
    }
}

// Display user info in header
function displayUserInfo() {
    const user = getCurrentUser();
    if (user) {
        const userNameEl = document.getElementById('userName');
        const userRoleEl = document.getElementById('userRole');
        const userAvatarEl = document.getElementById('userAvatar');
        
        if (userNameEl) userNameEl.textContent = user.nama_staf;
        if (userRoleEl) userRoleEl.textContent = user.peran;
        if (userAvatarEl) userAvatarEl.textContent = user.nama_staf.charAt(0).toUpperCase();
    }
}