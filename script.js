let isLoginMode = true;
let selectedGender = 'male';
let currentUser = JSON.parse(localStorage.getItem('rbx_session')) || null;

window.onload = () => {
    if (currentUser) showApp();
};

function toggleAuthMode() {
    isLoginMode = !isLoginMode;
    document.getElementById('auth-title').innerText = isLoginMode ? "Login to RobloxPaste" : "Create Account";
    document.getElementById('auth-btn').innerText = isLoginMode ? "Log In" : "Sign Up";
    document.getElementById('signup-extras').classList.toggle('hidden', isLoginMode);
}

function selectGender(g) {
    selectedGender = g;
    document.querySelectorAll('.gender-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-gender="${g}"]`).classList.add('active');
}

function handleAuth() {
    const user = document.getElementById('username').value.trim();
    const pass = document.getElementById('password').value;

    if (!isLoginMode) {
        if (user.length < 3 || user.length > 16) return alert("Username: 3-16 chars!");
        if (localStorage.getItem(`rbx_u_${user}`)) return alert("Taken!");
        
        const userData = { user, pass, gender: selectedGender, folders: ['Default'], pastes: [] };
        localStorage.setItem(`rbx_u_${user}`, JSON.stringify(userData));
        login(userData);
    } else {
        const stored = JSON.parse(localStorage.getItem(`rbx_u_${user}`));
        if (stored && stored.pass === pass) login(stored);
        else alert("Wrong credentials!");
    }
}

function login(data) {
    localStorage.setItem('rbx_session', JSON.stringify(data));
    currentUser = data;
    showApp();
}

function showApp() {
    document.getElementById('auth-section').classList.add('hidden');
    document.getElementById('app-section').classList.remove('hidden');
    renderAll();
}

function renderAll() {
    // Folders
    const fList = document.getElementById('folder-list');
    fList.innerHTML = currentUser.folders.map(f => `<div class="folder-item"><i class="fas fa-folder"></i> ${f}</div>`).join('');
    
    // Folder Select in Modal
    document.getElementById('paste-folder-select').innerHTML = currentUser.folders.map(f => `<option>${f}</option>`).join('');

    // Pastes
    const pGrid = document.getElementById('paste-grid');
    pGrid.innerHTML = currentUser.pastes.map((p, idx) => `
        <div class="paste-card">
            <h4>${p.title}</h4>
            <small>${p.folder} | ${p.privacy}</small>
            <div class="paste-actions">
                <button class="btn-mini" onclick="copyPaste(${idx})">Copy</button>
                <button class="btn-mini" onclick="viewRaw(${idx})">Raw</button>
            </div>
        </div>
    `).join('');
}

function savePaste() {
    const title = document.getElementById('paste-name').value;
    const content = document.getElementById('paste-content').value;
    const folder = document.getElementById('paste-folder-select').value;
    const privacy = document.getElementById('paste-privacy').value;

    if(!title || !content) return alert("Fill everything!");

    currentUser.pastes.push({ title, content, folder, privacy });
    sync();
    closeModals();
    renderAll();
}

function sync() {
    localStorage.setItem(`rbx_u_${currentUser.user}`, JSON.stringify(currentUser));
    localStorage.setItem('rbx_session', JSON.stringify(currentUser));
}

function togglePlusMenu() { document.getElementById('plus-dropdown').classList.toggle('hidden'); }
function openPasteModal() { document.getElementById('modal-overlay').classList.remove('hidden'); togglePlusMenu(); }
function closeModals() { document.getElementById('modal-overlay').classList.add('hidden'); }
function toggleSidebar() { document.getElementById('sidebar').classList.toggle('active'); }
function logout() { localStorage.removeItem('rbx_session'); location.reload(); }

function copyPaste(idx) {
    navigator.clipboard.writeText(currentUser.pastes[idx].content);
    alert("Copied to clipboard!");
}

function viewRaw(idx) {
    const win = window.open("", "_blank");
    win.document.write(`<pre style="color:white; background:#111; height:100vh; margin:0; padding:20px;">${currentUser.pastes[idx].content}</pre>`);
}
