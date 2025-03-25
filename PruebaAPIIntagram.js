
const accessToken = 'IGAFVIfz0InrlBZAE5XNVN1WlNra08yY0k2dW5SeGNuOTFGTVNlVzkzUDFleXFTSGZAkYWNYMmJoYlFPVC1xY2E2X2QzbEVFbkxhcFRJdUJPb25jczZART1hkN0M5aFRlVXBqR2RwNnhobWdfR2wwUzMwWDZApekV6MjlMZAXZAqOGdMbwZDZD';



document.getElementById('fetchdata').addEventListener('click', async () => {
    const username = document.getElementById('Name').value;

    if (!username) {
        document.getElementById('output').innerText = 'Por favor, ingresa el nombre de usuario.';
        return;
    }

    try {
        // Obtener el ID de usuario a partir del nombre de usuario
        const searchUrl = `https://graph.instagram.com/v12.0/{user-id}?fields=id,username&access_token=${accessToken}`;
        
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();
        
        if (!searchData || !searchData.id) {
            document.getElementById('output').innerText = 'No se encontró ninguna cuenta con ese nombre de usuario.';
            return;
        }

        const userId = searchData.id;

        // Obtener estadísticas del usuario
        const statsUrl = `https://graph.instagram.com/${userId}?fields=followers_count,media_count&access_token=${accessToken}`;
        const statsResponse = await fetch(statsUrl);
        const statsData = await statsResponse.json();
  
        if (statsData) {
            const followers = statsData.followers_count;
            const mediaCount = statsData.media_count;

            // Mostrar seguidores y publicaciones
            document.getElementById('followers').innerText = `Número de seguidores: ${followers}`;
            document.getElementById('media').innerText = `Número de publicaciones: ${mediaCount}`;
        }
    } catch (error) {
        console.error('Error:', error);
        document.getElementById('output').innerText = 'Ocurrió un error al obtener los datos.';
    }
});


