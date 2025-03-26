// Inicialización del SDK de Facebook/Instagram
window.fbAsyncInit = function() {
    FB.init({
        appId: '1010459561182497', 
        cookie: true,
        xfbml: true,
        version: 'v12.0' 
    });
    console.log('SDK de Instagram inicializado correctamente');
};

// Función para iniciar sesión y autenticar al usuario
function iniciarSesionInstagram() {
    FB.login(function(response) {
        if (response.authResponse) {
            console.log('Usuario autenticado:', response.authResponse);
            const accessToken = response.authResponse.accessToken;

            obtenerMetricas(accessToken);
        } else {
            console.error('Error en la autenticación');
        }
    }, { scope: 'instagram_basic' }); 
}

function obtenerMetricas(accessToken) {
    FB.api(
        '/me/accounts', // Paso intermedio para obtener la cuenta de Instagram
        { access_token: accessToken },
        function(response) {
            if (response && response.data && response.data.length > 0) {
                const instagramAccountId = response.data[0].id; // ID de la cuenta vinculada

                // Ahora obtenemos las métricas
                FB.api(
                    `/${instagramAccountId}`,
                    { fields: 'followers_count,media_count', access_token: accessToken },
                    function(instagramResponse) {
                        if (instagramResponse) {
                            console.log('Datos del usuario de Instagram:', instagramResponse);

                            document.getElementById('followers').innerText = `Número de seguidores: ${instagramResponse.followers_count}`;
                            document.getElementById('media').innerText = `Número de publicaciones: ${instagramResponse.media_count}`;
                        } else {
                            console.error('Error al obtener los datos de la cuenta de Instagram');
                        }
                    }
                );
            } else {
                console.error('No se encontró una cuenta de Instagram vinculada');
            }
        }
    );
}

// Agregar evento al botón
document.getElementById('loginButton').addEventListener('click', iniciarSesionInstagram);

