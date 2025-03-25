// Capturar el código de autorización de la URL
(async () => {
    const queryParams = new URLSearchParams(window.location.search);
    const authCode = queryParams.get('code');
    
    if (!authCode) {
        console.error('No se recibió un código de autorización');
        return;
    }

    const data = {
        client_id: '24005084342427321', 
        client_secret: 'e88790e677018b2ae062308cfea7eb5c', 
        grant_type: 'authorization_code',
        redirect_uri: 'https://idiamer0707.github.io/PruebaAPIInstagram/index.html',
        code: authCode
    };

    try {
        // Intercambiar el código por un token de acceso
        const response = await fetch('https://api.instagram.com/oauth/access_token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams(data)
        });
        const result = await response.json();

        if (result.access_token) {
            console.log('Token de acceso:', result.access_token);
            await obtenerMetricas(result.access_token);
        } else {
            console.error('Error al obtener el token de acceso:', result);
        }
    } catch (error) {
        console.error('Error al intercambiar el código:', error);
    }
})();

// Función para obtener métricas del usuario
async function obtenerMetricas(accessToken) {
    try {
        const statsUrl = `https://graph.instagram.com/me?fields=followers_count,media_count&access_token=${accessToken}`;
        const statsResponse = await fetch(statsUrl);
        const statsData = await statsResponse.json();

        if (statsData) {
            const followers = statsData.followers_count;
            const mediaCount = statsData.media_count;

            // Mostrar datos en el HTML
            document.getElementById('followers').innerText = `Número de seguidores: ${followers}`;
            document.getElementById('media').innerText = `Número de publicaciones: ${mediaCount}`;
        } else {
            console.error('Datos incompletos recibidos:', statsData);
        }
    } catch (error) {
        console.error('Error al obtener métricas:', error);
        document.getElementById('output').innerText = 'Ocurrió un error al obtener los datos.';
    }
}
