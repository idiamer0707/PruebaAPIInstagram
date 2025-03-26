const clientId = '1010459561182497'; 
const redirectUri = 'https://idiamer0707.github.io/PruebaAPIInstagram/'; 

// Redirigir al usuario a Instagram para iniciar sesión
document.getElementById('loginButton').addEventListener('click', () => {
    const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=instagram_basic&response_type=code`;
    window.location.href = authUrl;
});
// Captura el código de autorización desde la URL
const queryParams = new URLSearchParams(window.location.search);
const authCode = queryParams.get('code');

if (authCode) {
    console.log('Código de autorización obtenido:', authCode);
    intercambiarPorToken(authCode); 
} else {
    console.log('No se encontró el código de autorización. Es posible que el usuario no haya autorizado la app.');
}

// Intercambiar el código por un token de acceso 
async function intercambiarPorToken(authCode) {
    const data = {
        client_id: clientId,
        client_secret: 'e88790e677018b2ae062308cfea7eb5c', 
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code: authCode
    };

    try {
        const response = await fetch('https://api.instagram.com/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data)
        });

        const result = await response.json();
        if (result.access_token) {
            console.log('Token de acceso obtenido:', result.access_token);
            obtenerMetricas(result.access_token);
        } else {
            console.error('Error al obtener el token de acceso:', result);
        }
    } catch (error) {
        console.error('Error al intercambiar el código por el token:', error);
    }
}

// Obtener métricas del usuario usando el token de acceso
async function obtenerMetricas(accessToken) {
    try {
        const url = `https://graph.instagram.com/me?fields=followers_count,media_count&access_token=${accessToken}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data) {
            console.log('Datos del usuario:', data);

            document.getElementById('followers').innerText = `Número de seguidores: ${data.followers_count}`;
            document.getElementById('media').innerText = `Número de publicaciones: ${data.media_count}`;
        } else {
            console.error('Error al obtener los datos del usuario:', data);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
}


