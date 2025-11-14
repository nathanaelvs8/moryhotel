// Admin Utility Functions

// Format currency to IDR
function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount).replace('Rp', 'Rp ');
}

// Format date to Indonesian format
function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Format date to input format (YYYY-MM-DD)
function formatDateInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Show loading state
function showLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'block';
    }
}

// Hide loading state
function hideLoading(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.style.display = 'none';
    }
}

// Show success alert
function showSuccess(message) {
    alert(message);
}

// Show error alert
function showError(message) {
    alert('Error: ' + message);
}

// Get status badge class
function getStatusBadgeClass(status) {
    const statusMap = {
        'Dipesan': 'info',
        'Check-in': 'warning',
        'Selesai': 'success',
        'Dibatalkan': 'danger',
        'Tersedia': 'success',
        'Perawatan': 'danger',
        'Sudah Bayar': 'success',
        'Belum Bayar': 'danger',
        'Refund': 'warning'
    };
    return statusMap[status] || 'info';
}

// Generate random booking code
function generateBookingCode() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 10000);
    return `BK${year}${month}${day}${random}`;
}

// Calculate number of nights
function calculateNights(checkIn, checkOut) {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = end - start;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

// API helper functions

async function fetchAPI(endpoint, options = {}) {
    try {
        const response = await fetch(`${window.API_URL}${endpoint}`, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

async function getData(endpoint) {
    return fetchAPI(endpoint);
}

async function postData(endpoint, data) {
    return fetchAPI(endpoint, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

async function putData(endpoint, data) {
    return fetchAPI(endpoint, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

async function deleteData(endpoint) {
    return fetchAPI(endpoint, {
        method: 'DELETE'
    });
}

// Modal helpers
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('show');
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('show');
    }
}

// Table rendering helper
function renderTable(data, columns, tbody) {
    tbody.innerHTML = '';
    
    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="' + columns.length + '" style="text-align: center; padding: 40px; color: #999;">Tidak ada data</td></tr>';
        return;
    }
    
    data.forEach(row => {
        const tr = document.createElement('tr');
        columns.forEach(col => {
            const td = document.createElement('td');
            
            if (col.render) {
                td.innerHTML = col.render(row);
            } else {
                td.textContent = row[col.field] || '-';
            }
            
            tr.appendChild(td);
        });
        tbody.appendChild(tr);
    });
}