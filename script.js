const clientId = '1010459561182497'; 
const redirectUri = 'https://idiamer0707.github.io/PruebaAPIInstagram/'; 

// Redirigir al usuario para iniciar sesión con Instagram
document.getElementById('loginButton').addEventListener('click', () => {
    const authUrl = `https://www.facebook.com/v12.0/dialog/oauth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=pages_show_list,instagram_basic&response_type=code`;
    window.location.href = authUrl;
});

// Capturar el código de autorización desde la URL
const queryParams = new URLSearchParams(window.location.search);
const authCode = queryParams.get('code');

if (authCode) {
    console.log('Código de autorización obtenido:', authCode);
    intercambiarPorToken(authCode);
} else {
    console.log('No se encontró el código de autorización. Es posible que el usuario no haya autorizado la app.');
}

// Intercambiar el código de autorización por el token de acceso
async function intercambiarPorToken(authCode) {
    const data = {
        client_id: clientId,
        client_secret: 'a89d11bedbceeefbe34656653e8d56dd', 
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
        code: authCode
    };

    try {
        const response = await fetch('https://graph.facebook.com/v12.0/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams(data)
        });

        const result = await response.json();
        if (result.access_token) {
            console.log('Token de acceso obtenido:', result.access_token);
            obtenerCuentasVinculadas(result.access_token);
        } else {
            console.error('Error al obtener el token de acceso:', result);
        }
    } catch (error) {
        console.error('Error al intercambiar el código por el token:', error);
    }
}

// Obtener cuentas de Instagram vinculadas a una Página de Facebook
async function obtenerCuentasVinculadas(accessToken) {
    try {
        const url = `https://graph.facebook.com/v12.0/me/accounts?access_token=${accessToken}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.data && data.data.length > 0) {
            const instagramAccountId = data.data[0].id;
            console.log('ID de la cuenta de Instagram:', instagramAccountId);

            obtenerMetricasInstagram(instagramAccountId, accessToken);
        } else {
            console.error('No se encontraron cuentas vinculadas:', data);
        }
    } catch (error) {
        console.error('Error al obtener las cuentas vinculadas:', error);
    }
}

// Obtener métricas como seguidores y publicaciones
async function obtenerMetricasInstagram(instagramAccountId, accessToken) {
    try {
        const url = `https://graph.facebook.com/v12.0/${instagramAccountId}?fields=followers_count,media_count&access_token=${accessToken}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data) {
            console.log('Datos del usuario de Instagram:', data);
            document.getElementById('followers').innerText = `Número de seguidores: ${data.followers_count}`;
            document.getElementById('media').innerText = `Número de publicaciones: ${data.media_count}`;
        } else {
            console.error('Error al obtener los datos de Instagram:', data);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
}
