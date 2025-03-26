// Inicializa el SDK de Facebook
window.fbAsyncInit = function() {
    FB.init({
        appId: '24005084342427321',
        cookie: true,
        xfbml: true,
        version: 'v12.0' 
    });
    
    console.log('El SDK de Facebook está listo');
};
