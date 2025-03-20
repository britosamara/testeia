// Aguarda o carregamento do config.js antes de iniciar o login
async function loadConfig() {
    try {
        const response = await fetch('config.js');
        const configText = await response.text();
        eval(configText); // Carrega a variável GOOGLE_CLIENT_ID
        initializeGoogleLogin();
    } catch (error) {
        console.error("Erro ao carregar config.js:", error);
    }
}

// Inicializa o login do Google
function initializeGoogleLogin() {
    if (typeof GOOGLE_CLIENT_ID === "undefined") {
        console.error("⚠️ GOOGLE_CLIENT_ID não foi carregado. Verifique o config.js.");
        return;
    }

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
    });

    console.log("Google Login inicializado.");
}

// Exibe o prompt de login ao clicar no ícone do perfil
function signInWithGoogle() {
    console.log("Tentando fazer login...");
    google.accounts.id.prompt();
}

// Lida com a resposta do login
function handleCredentialResponse(response) {
    console.log("Token recebido:", response.credential);
    const userData = parseJwt(response.credential);
    if (userData && userData.name) {
        updateUserName(userData.name);
        updateProfileIcon();
        alert(`Login bem-sucedido! Olá, ${userData.name}`);
    }
}

// Atualiza a saudação do usuário
function updateUserName(name) {
    document.getElementById('welcome-message-1').innerText = `Olá, ${name}!`;
    document.getElementById('welcome-message-2').innerText = `Olá, ${name}!`;
}

// Altera o ícone de perfil após login
function updateProfileIcon() {
    document.getElementById('profile-icon-1').src = "profile2.png";
    document.getElementById('profile-icon-2').src = "profile2.png";
}

// Decodifica o token JWT do Google
function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Erro ao decodificar token:", e);
        return null;
    }
}

// Aguarda o carregamento do config.js antes de iniciar
window.onload = loadConfig;
