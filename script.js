async function loadConfig() {
    try {
        const response = await fetch('config.js');
        const text = await response.text();
        eval(text); // Isso define GOOGLE_CLIENT_ID dinamicamente
        if (typeof GOOGLE_CLIENT_ID === 'undefined') {
            throw new Error('GOOGLE_CLIENT_ID não encontrado.');
        }
        initializeGoogleLogin();
    } catch (error) {
        console.error("Erro ao carregar config.js:", error);
    }
}

function initializeGoogleLogin() {
    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
    });
}

function signInWithGoogle() {
    google.accounts.id.prompt();
}

function handleCredentialResponse(response) {
    console.log("Token de ID recebido:", response.credential);
    const userData = parseJwt(response.credential);
    if (userData && userData.name) {
        updateUserName(userData.name);
        updateProfileIcon();
        alert(`Login bem-sucedido! Olá, ${userData.name}`);
    }
}

function updateUserName(name) {
    document.getElementById('welcome-message-1').innerText = `Olá, ${name}!`;
    document.getElementById('welcome-message-2').innerText = `Olá, ${name}!`;
}

function updateProfileIcon() {
    document.getElementById('profile-icon-1').src = "profile2.png";
    document.getElementById('profile-icon-2').src = "profile2.png";
}

function parseJwt(token) {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error("Erro ao decodificar token:", e);
        return null;
    }
}

function goToVideos() {
    document.getElementById('desktop-1').style.display = 'none';
    document.getElementById('desktop-2').style.display = 'flex';
}

function goToHome() {
    document.getElementById('desktop-2').style.display = 'none';
    document.getElementById('desktop-1').style.display = 'flex';
}

function redirectToYouTube() {
    window.location.href = "https://www.youtube.com/watch?v=kFTS9B1Kx14";
}

window.onload = loadConfig;
