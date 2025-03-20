function initializeGoogleLogin() {
    if (typeof GOOGLE_CLIENT_ID === "undefined") {
        console.error("⚠️ Client ID não foi carregado. Verifique se o config.js foi criado no GitHub Pages.");
        return;
    }

    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse
    });

    google.accounts.id.prompt();
}

function handleCredentialResponse(response) {
    console.log("Login bem-sucedido!", response);
    const userData = parseJwt(response.credential);
    if (userData && userData.name) {
        updateUserName(userData.name);
        updateProfileIcon();
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
    document.getElementById('desktop-1').classList.add('hidden');
    document.getElementById('desktop-2').classList.remove('hidden');
}

function goToHome() {
    document.getElementById('desktop-2').classList.add('hidden');
    document.getElementById('desktop-1').classList.remove('hidden');
}

function redirectToYouTube() {
    window.location.href = "https://www.youtube.com/watch?v=kFTS9B1Kx14";
}

window.onload = initializeGoogleLogin;