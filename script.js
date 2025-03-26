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
    }, { scope: 'user_profile,user_media' });
}

function obtenerMetricas(accessToken) {
    FB.api('/me', { fields: 'followers_count,media_count' }, function(response) {
        if (response) {
            console.log('Datos del usuario:', response);

            document.getElementById('followers').innerText = `Número de seguidores: ${response.followers_count}`;
            document.getElementById('media').innerText = `Número de publicaciones: ${response.media_count}`;
        } else {
            console.error('Error al obtener los datos del usuario');
        }
    });
}


document.getElementById('loginButton').addEventListener('click', iniciarSesionInstagram);
