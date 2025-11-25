// Gerenciamento de autenticação
let currentUser = null;
const users = JSON.parse(localStorage.getItem('users')) || {};

// Elementos DOM
const loginModal = document.getElementById('loginModal');
const editorContainer = document.getElementById('editorContainer');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const loginTab = document.getElementById('loginTab');
const signupTab = document.getElementById('signupTab');
const editor = document.getElementById('editor');
const logoutBtn = document.getElementById('logoutBtn');
const newDocBtn = document.getElementById('newDocBtn');
const saveDocBtn = document.getElementById('saveDocBtn');

// Troca entre abas de login e cadastro
loginTab.addEventListener('click', () => {
    loginTab.classList.add('active');
    signupTab.classList.remove('active');
    loginForm.classList.remove('hidden');
    signupForm.classList.add('hidden');
});

signupTab.addEventListener('click', () => {
    signupTab.classList.add('active');
    loginTab.classList.remove('active');
    signupForm.classList.remove('hidden');
    loginForm.classList.add('hidden');
});

// Cadastro de novo usuário
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('signupUsername').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('As senhas não coincidem!');
        return;
    }
    
    if (users[username]) {
        alert('Nome de usuário já existe!');
        return;
    }
    
    // Armazenar usuário (senha deve ser criptografada em produção)
    users[username] = {
        password: password,
        documents: []
    };
    
    localStorage.setItem('users', JSON.stringify(users));
    alert('Cadastro realizado com sucesso!');
    
    // Alternar para login
    signupTab.classList.remove('active');
    loginTab.classList.add('active');
    signupForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Login de usuário
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;
    
    if (!users[username] || users[username].password !== password) {
        alert('Nome de usuário ou senha incorretos!');
        return;
    }
    
    currentUser = username;
    loginModal.classList.add('hidden');
    editorContainer.classList.remove('hidden');
    
    // Carregar documentos do usuário
    loadUserDocuments();
});

// Logout
logoutBtn.addEventListener('click', () => {
    currentUser = null;
    loginModal.classList.remove('hidden');
    editorContainer.classList.add('hidden');
    
    // Limpar o editor
    editor.innerHTML = '<h1>Documento Novo</h1><p>Comece a digitar seu documento aqui...</p>';
});

// Novo documento
newDocBtn.addEventListener('click', () => {
    if (!currentUser) return;
    
    if (confirm('Tem certeza que deseja criar um novo documento? O conteúdo atual será perdido.')) {
        editor.innerHTML = '<h1>Documento Novo</h1><p>Comece a digitar seu documento aqui...</p>';
    }
});

// Salvar documento
saveDocBtn.addEventListener('click', () => {
    if (!currentUser) return;
    
    const content = editor.innerHTML;
    const timestamp = new Date().toLocaleString('pt-BR');
    const docId = 'doc_' + Date.now();
    
    // Criar objeto do documento
    const document = {
        id: docId,
        title: getContentTitle(content) || 'Documento sem título',
        content: content,
        createdAt: timestamp,
        updatedAt: timestamp
    };
    
    // Adicionar ao array de documentos do usuário
    if (!users[currentUser].documents) {
        users[currentUser].documents = [];
    }
    
    users[currentUser].documents.push(document);
    
    // Salvar no localStorage
    localStorage.setItem('users', JSON.stringify(users));
    
    alert('Documento salvo com sucesso!');
});

// Função auxiliar para obter título do conteúdo
function getContentTitle(content) {
    const div = document.createElement('div');
    div.innerHTML = content;
    const firstHeading = div.querySelector('h1, h2, h3');
    return firstHeading ? firstHeading.textContent.trim() : null;
}

// Função para carregar documentos do usuário
function loadUserDocuments() {
    if (!currentUser || !users[currentUser] || !users[currentUser].documents) {
        return;
    }
    
    // Por enquanto, vamos carregar o último documento
    const userDocs = users[currentUser].documents;
    if (userDocs.length > 0) {
        const lastDoc = userDocs[userDocs.length - 1];
        editor.innerHTML = lastDoc.content;
    }
}

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Verificar se já existe um usuário logado (em uma implementação real, usaria tokens)
    // Por simplicidade, vamos manter isso no localStorage apenas para demonstração
    if (currentUser) {
        loginModal.classList.add('hidden');
        editorContainer.classList.remove('hidden');
        loadUserDocuments();
    }
});