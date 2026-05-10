let isLoginMode = false;
let selectedGender = '';
let currentUser = JSON.parse(localStorage.getItem('session')) || null;

// On Page Load
window.onload = () => {
    if (currentUser) {
        showApp();
    }
};

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Login" : "Create Account";
    document.getElementById('auth-btn').innerText = isLoginMode ? "Login" : "Sign Up";
    document.getElementById('gender-box').classList.toggle('hidden', isLoginMode);
}

function handleAuth() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;

    if (user.length < 3 || user.length > 16) {
        alert("Username must be 3-16 characters!");
        return;
    }

    if (isLoginMode) {
        const storedUser = JSON.parse(localStorage.getItem(`user_${user}`));
        if (storedUser && storedUser.pass === pass) {
            login(storedUser);
        } else {
            alert("Invalid credentials!");
        }
    } else {
        if (localStorage.getItem(`user_${user}`)) {
            alert("Username already taken!");
            return;
        }
        const newUser = { user, pass, gender: selectedGender, pastes: [], folders: ['Default'] };
        localStorage.setItem(`user_${user}`, JSON.stringify(newUser));
        login(newUser);
    }
}

function login(userObj) {
    localStorage.setItem('session', JSON.stringify(userObj));
    currentUser = userObj;
    showApp();
}

function showApp() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');
    renderSidebar();
}

function togglePlusMenu() {
    document.getElementById('plus-menu').classList.toggle('hidden');
}

function openFolderModal() {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
        currentUser.folders.push(folderName);
        updateStorage();
        renderSidebar();
    }
}

function renderSidebar() {
    const list = document.getElementById('folder-list');
    list.innerHTML = currentUser.folders.map(f => `<div class="folder-item">📁 ${f}</div>`).join('');
    
    // Update the dropdown in the Paste Modal
    const select = document.getElementById('target-folder-select');
    select.innerHTML = currentUser.folders.map(f => `<option value="${f}">${f}</option>`).join('');
}

function updateStorage() {
    localStorage.setItem(`user_${currentUser.user}`, JSON.stringify(currentUser));
    localStorage.setItem('session', JSON.stringify(currentUser));
}

function logout() {
    localStorage.removeItem('session');
    location.reload();
}

// Logic for Copy/Raw
function copyToClipboard(text) {
    navigator.clipboard.writeText(text);
    alert("Copied!");
}

function openRaw(text) {
    const win = window.open("", "_blank");
    win.document.write(`<pre>${text}</pre>`);
  }
