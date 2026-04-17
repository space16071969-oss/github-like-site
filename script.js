// DOM Elements
const filesGrid = document.getElementById('filesGrid');
const emptyState = document.getElementById('emptyState');
const fileCount = document.getElementById('fileCount');

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    renderFiles();
});

// Render files from the files array
function renderFiles() {
    // Clear existing files
    filesGrid.innerHTML = '';

    if (!files || files.length === 0) {
        emptyState.classList.add('show');
        fileCount.textContent = '0';
        return;
    }

    emptyState.classList.remove('show');
    fileCount.textContent = files.length;

    // Create file cards
    files.forEach((file, index) => {
        const fileCard = createFileCard(file, index);
        filesGrid.appendChild(fileCard);
    });
}

// Create a file card element
function createFileCard(file, index) {
    const card = document.createElement('div');
    card.className = 'file-card';
    card.style.animationDelay = `${index * 0.05}s`;

    // Check if icon is a URL or emoji
    const isImageUrl = file.icon.startsWith('http://') || file.icon.startsWith('https://');
    const iconHtml = isImageUrl 
        ? `<img src="${file.icon}" class="file-icon-img" alt="icon">` 
        : `<div class="file-icon">${file.icon}</div>`;

    card.innerHTML = `
        ${iconHtml}
        <div class="file-name">${escapeHtml(file.name)}</div>
        <div class="file-size">${escapeHtml(file.size)}</div>
        <div class="file-description">${escapeHtml(file.description)}</div>
        <button class="download-btn" data-url="${file.url}" data-name="${file.name}">
            Download
        </button>
    `;

    // Add download functionality
    const downloadBtn = card.querySelector('.download-btn');
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        downloadFile(file.url, file.name);
    });

    return card;
}

// Download file
function downloadFile(url, filename) {
    // Create a temporary anchor element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.target = '_blank';

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Optional: Show notification (can be enhanced with a toast library)
    showNotification(`Downloading: ${filename}`);
}

// Show a simple notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 1000;
        animation: slideInRight 0.3s ease-out;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.2);
        max-width: 300px;
        word-wrap: break-word;
    `;
    notification.textContent = message;

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Add animation styles for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(30px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(30px);
        }
    }
`;
document.head.appendChild(style);

// Escape HTML to prevent XSS attacks
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Refresh files when files.js is updated (for development)
// This can be triggered manually by reloading the page
window.addEventListener('load', () => {
    // You can add additional initialization code here
});
