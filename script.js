// DOM Elements
const filesGrid = document.getElementById('filesGrid');
const emptyState = document.getElementById('emptyState');
const fileCount = document.getElementById('fileCount');

// PIN Authentication
const PIN_CODE = '12345';
const PIN_STORAGE_KEY = 'pin_authenticated';

// Track all files (from files.js + Firebase)
let allFiles = [];
let isFirebaseReady = false;

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    initPinAuthentication();
    loadSharedFiles();
    renderFiles();
    initFileAddModal();
    initAuthenticationBar();
});

// Load shared files from Firebase
function loadSharedFiles() {
    if (typeof db === 'undefined') {
        console.warn('Firebase not initialized. Using local files only.');
        allFiles = [...files];
        isFirebaseReady = false;
        return;
    }

    try {
        db.collection('public_files').onSnapshot((snapshot) => {
            const firebaseFiles = [];
            snapshot.forEach((doc) => {
                firebaseFiles.push({
                    ...doc.data(),
                    firebaseId: doc.id,
                    isFromFirebase: true
                });
            });
            // Combine static files with Firebase files
            allFiles = [...files, ...firebaseFiles];
            renderFiles();
            isFirebaseReady = true;
        }, (error) => {
            console.error('Error loading Firebase files:', error);
            allFiles = [...files];
            isFirebaseReady = true;
        });
    } catch (e) {
        console.error('Error setting up Firebase listener:', e);
        allFiles = [...files];
        isFirebaseReady = false;
    }
}

// Save file to Firebase
async function saveFileToFirebase(fileData) {
    if (!isFirebaseReady || typeof db === 'undefined') {
        showNotification('Firebase not connected. File saved locally only.', 'error');
        return false;
    }

    try {
        await db.collection('public_files').add(fileData);
        return true;
    } catch (e) {
        console.error('Error saving to Firebase:', e);
        showNotification('Error uploading file to server', 'error');
        return false;
    }
}

// Delete file from Firebase
async function deleteFileFromFirebase(firebaseId) {
    if (!isFirebaseReady || typeof db === 'undefined') {
        return false;
    }

    try {
        await db.collection('public_files').doc(firebaseId).delete();
        return true;
    } catch (e) {
        console.error('Error deleting from Firebase:', e);
        showNotification('Error deleting file', 'error');
        return false;
    }
}

// PIN Authentication Logic
function initPinAuthentication() {
    const pinModal = document.getElementById('pinModal');
    const pinInput = document.getElementById('pinInput');
    const pinSubmitBtn = document.getElementById('pinSubmitBtn');
    const pinError = document.getElementById('pinError');

    // Check if user is already authenticated
    if (sessionStorage.getItem(PIN_STORAGE_KEY)) {
        pinModal.classList.add('hidden');
        return;
    }

    // Show modal
    pinModal.classList.remove('hidden');

    // Handle Enter key
    pinInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            verifyPin();
        }
    });

    // Handle Submit button
    pinSubmitBtn.addEventListener('click', verifyPin);

    function verifyPin() {
        const enteredPin = pinInput.value.trim();
        
        if (enteredPin === PIN_CODE) {
            // Correct PIN - Store authentication and hide modal
            sessionStorage.setItem(PIN_STORAGE_KEY, 'true');
            pinError.style.display = 'none';
            pinModal.style.animation = 'fadeOut 0.3s ease-out forwards';
            
            setTimeout(() => {
                pinModal.classList.add('hidden');
            }, 300);
        } else {
            // Wrong PIN - Show error
            pinError.textContent = 'Incorrect PIN. Please try again.';
            pinError.style.display = 'block';
            pinInput.value = '';
            pinInput.focus();
        }
    }
}

// Add fadeOut animation to styles
const pinAnimStyle = document.createElement('style');
pinAnimStyle.textContent = `
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(pinAnimStyle);

// Render files from the files array
function renderFiles() {
    // Clear existing files
    filesGrid.innerHTML = '';

    if (!allFiles || allFiles.length === 0) {
        emptyState.classList.add('show');
        fileCount.textContent = '0';
        return;
    }

    emptyState.classList.remove('show');
    fileCount.textContent = allFiles.length;

    // Create file cards
    allFiles.forEach((file, index) => {
        const fileCard = createFileCard(file, index);
        filesGrid.appendChild(fileCard);
    });
}

// Create a file card element
function createFileCard(file, index) {
    const card = document.createElement('div');
    card.className = 'file-card';
    card.style.animationDelay = `${index * 0.05}s`;

    // Check if icon is an image (URL, data URI, or emoji)
    const isImageUrl = file.icon.startsWith('http://') || file.icon.startsWith('https://');
    const isDataUri = file.icon.startsWith('data:image/');
    const isImage = isImageUrl || isDataUri;
    
    const iconHtml = isImage 
        ? `<img src="${file.icon}" class="file-icon-img" alt="icon">` 
        : `<div class="file-icon">${file.icon}</div>`;

    const deleteBtn = file.isFromFirebase 
        ? `<button class="delete-btn" data-index="${index}" data-firebase-id="${file.firebaseId}" title="Delete this file">🗑️</button>` 
        : '';

    card.innerHTML = `
        ${iconHtml}
        <div class="file-name">${escapeHtml(file.name)}</div>
        <div class="file-size">${escapeHtml(file.size)}</div>
        <div class="file-description">${escapeHtml(file.description)}</div>
        <button class="download-btn" data-url="${file.url}" data-name="${file.name}">
            Download
        </button>
        ${deleteBtn}
    `;

    // Add download functionality
    const downloadBtn = card.querySelector('.download-btn');
    downloadBtn.addEventListener('click', (e) => {
        e.preventDefault();
        downloadFile(file.url, file.name);
    });

    // Add delete functionality for Firebase files
    if (file.isFromFirebase) {
        const delBtn = card.querySelector('.delete-btn');
        delBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const firebaseId = delBtn.getAttribute('data-firebase-id');
            deleteFile(index, firebaseId);
        });
    }

    return card;
}

// Delete a file
function deleteFile(index, firebaseId = null) {
    if (confirm('Are you sure you want to delete this file?')) {
        // If it's a Firebase file, delete from Firebase
        if (firebaseId) {
            deleteFileFromFirebase(firebaseId).then((success) => {
                if (success) {
                    allFiles.splice(index, 1);
                    renderFiles();
                    showNotification('File deleted successfully');
                }
            });
        } else {
            // Local file - just remove from array
            allFiles.splice(index, 1);
            renderFiles();
            showNotification('File deleted successfully');
        }
    }
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
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    
    const bgColor = type === 'error' 
        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
        : 'linear-gradient(135deg, #a78bfa 0%, #60a5fa 100%)';
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
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

// Authentication system for nested access
const AUTH_CODE_1 = 'hartmann69420';
const AUTH_CODE_2 = 'idhensk8473hhejsi';

function initAuthenticationBar() {
    const authInput1 = document.getElementById('authInput1');
    const authBtn1 = document.getElementById('authBtn1');
    const authResult1 = document.getElementById('authResult1');
    const authStep1 = document.getElementById('authStep1');
    const authStep2 = document.getElementById('authStep2');

    const authInput2 = document.getElementById('authInput2');
    const authBtn2 = document.getElementById('authBtn2');
    const authResult2 = document.getElementById('authResult2');

    // Step 1: Verify first code
    authBtn1.addEventListener('click', () => {
        const input = authInput1.value.trim();
        
        if (input === AUTH_CODE_1) {
            authResult1.textContent = '✓ Correct';
            authResult1.className = 'auth-result correct';
            authResult1.style.display = 'block';
            authInput1.disabled = true;
            authBtn1.disabled = true;
            
            // Show step 2 after delay
            setTimeout(() => {
                authStep1.style.display = 'none';
                authStep2.style.display = 'block';
                authInput2.focus();
            }, 600);
        } else {
            authResult1.textContent = '✗ False';
            authResult1.className = 'auth-result incorrect';
            authResult1.style.display = 'block';
            authInput1.value = '';
            authInput1.focus();
        }
    });

    // Step 2: Verify second code and redirect
    authBtn2.addEventListener('click', () => {
        const input = authInput2.value.trim();
        
        if (input === AUTH_CODE_2) {
            authResult2.textContent = '✓ Correct';
            authResult2.className = 'auth-result correct';
            authResult2.style.display = 'block';
            authInput2.disabled = true;
            authBtn2.disabled = true;
            
            // Redirect to secret endpoint
            setTimeout(() => {
                window.location.href = window.location.origin + '/secret';
            }, 800);
        } else {
            authResult2.textContent = '✗ False';
            authResult2.className = 'auth-result incorrect';
            authResult2.style.display = 'block';
            authInput2.value = '';
            authInput2.focus();
        }
    });

    // Allow Enter key to submit
    authInput1.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') authBtn1.click();
    });

    authInput2.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') authBtn2.click();
    });
}

// Initialize Add File Modal
function initFileAddModal() {
    const addFileBtn = document.getElementById('addFileBtn');
    const addFileModal = document.getElementById('addFileModal');
    const closeBtn = document.getElementById('closeAddFileModal');
    const cancelBtn = document.getElementById('cancelAddFileBtn');
    const addFileForm = document.getElementById('addFileForm');
    const fileIcon = document.getElementById('fileIcon');
    const iconPreview = document.getElementById('iconPreview');
    const iconPreviewImg = document.getElementById('iconPreviewImg');

    // Open modal
    addFileBtn.addEventListener('click', () => {
        addFileModal.classList.remove('hidden');
        addFileForm.reset();
        iconPreview.classList.add('hidden');
    });

    // Close modal
    closeBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    function closeModal() {
        addFileModal.classList.add('hidden');
    }

    // Close modal when clicking outside
    addFileModal.addEventListener('click', (e) => {
        if (e.target === addFileModal) {
            closeModal();
        }
    });

    // Preview image
    fileIcon.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                iconPreviewImg.src = event.target.result;
                iconPreview.classList.remove('hidden');
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle drag and drop
    const fileInputWrapper = document.querySelector('.file-input-wrapper');
    fileInputWrapper.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInputWrapper.style.borderColor = 'rgba(167, 139, 250, 0.7)';
    });

    fileInputWrapper.addEventListener('dragleave', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInputWrapper.style.borderColor = 'rgba(167, 139, 250, 0.4)';
    });

    fileInputWrapper.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        fileInputWrapper.style.borderColor = 'rgba(167, 139, 250, 0.4)';
        
        const droppedFiles = e.dataTransfer.files;
        if (droppedFiles.length > 0) {
            fileIcon.files = droppedFiles;
            const event = new Event('change', { bubbles: true });
            fileIcon.dispatchEvent(event);
        }
    });

    fileInputWrapper.addEventListener('click', () => {
        fileIcon.click();
    });

    // Handle form submission
    addFileForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fileName = document.getElementById('fileName').value.trim();
        const fileDesc = document.getElementById('fileDesc').value.trim();
        const fileSizeNum = document.getElementById('fileSizeNum').value;
        const fileSizeUnit = document.getElementById('fileSizeUnit').value;
        const fileLink = document.getElementById('fileLink').value.trim();
        const fileIconInput = document.getElementById('fileIcon').files[0];

        if (!fileIconInput) {
            showNotification('Please select an image for the icon', 'error');
            return;
        }

        // Convert image to base64
        const reader = new FileReader();
        reader.onload = (event) => {
            const newFile = {
                name: fileName,
                description: fileDesc,
                size: `${fileSizeNum} ${fileSizeUnit}`,
                url: fileLink,
                icon: event.target.result,
                timestamp: new Date().toISOString()
            };

            // Save to Firebase
            saveFileToFirebase(newFile).then((success) => {
                if (success) {
                    closeModal();
                    showNotification(`File \"${fileName}\" added successfully!`);
                } else {
                    showNotification('Error uploading file', 'error');
                }
            });
        };
        reader.readAsDataURL(fileIconInput);
    });
}
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
