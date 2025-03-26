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
    intercambiarPorToken(authCode); // Intercambiar el código por un token de acceso
} else {
    console.log('No se encontró el código de autorización. Es posible que el usuario no haya autorizado la app.');
}

// Función para intercambiar el código de autorización por un token de acceso
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
            obtenerCuentasVinculadas(result.access_token); // Usar el token para obtener las cuentas vinculadas
        } else {
            console.error('Error al obtener el token de acceso:', result);
        }
    } catch (error) {
        console.error('Error al intercambiar el código por el token:', error);
    }
}

// Función para obtener las cuentas vinculadas a una Página de Facebook
async function obtenerCuentasVinculadas(accessToken) {
    try {
        const url = `https://graph.facebook.com/v12.0/me/accounts?access_token=${accessToken}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data && data.data && data.data.length > 0) {
            console.log('Cuentas vinculadas:', data.data);

            // Obtener el ID de la primera cuenta vinculada (puedes manejar múltiples cuentas si es necesario)
            const instagramAccountId = data.data[0].id;
            console.log('ID de la cuenta de Instagram vinculada:', instagramAccountId);

            obtenerMetricasInstagram(instagramAccountId, accessToken); // Obtener métricas
        } else {
            console.error('No se encontraron cuentas vinculadas. Verifica que la cuenta de Instagram esté conectada a una página de Facebook y que sea Business o Creator.');
            console.error('Respuesta completa:', data); // Mostrar datos para depuración
        }
    } catch (error) {
        console.error('Error al obtener las cuentas vinculadas:', error);
    }
}

// Función para obtener métricas como seguidores y publicaciones de Instagram
async function obtenerMetricasInstagram(instagramAccountId, accessToken) {
    try {
        const url = `https://graph.facebook.com/v12.0/${instagramAccountId}?fields=followers_count,media_count&access_token=${accessToken}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data) {
            console.log('Datos de la cuenta de Instagram:', data);
            document.getElementById('followers').innerText = `Número de seguidores: ${data.followers_count}`;
            document.getElementById('media').innerText = `Número de publicaciones: ${data.media_count}`;
        } else {
            console.error('Error al obtener datos de la cuenta de Instagram:', data);
        }
    } catch (error) {
        console.error('Error al realizar la solicitud:', error);
    }
}

