//Determinar si la imagen existe
function imageExists(image_url) {
    var http = new XMLHttpRequest();
    http.open('HEAD', image_url, false);
    http.send();
    return http.status != 404;
}

//Enviar una notificacion a los usuarios
function enviarNotificacion(Titulo, Mensaje, URL = "", Image = "") {
    let myHeaders = new Headers();
    myHeaders.append("Authorization", "Basic ODU0NmI1YTMtZjAyNy00ZDRkLTgyODAtNTc3MDAzMmU0ZTQ2");
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Cookie", "__cfduid=d27872b10d36f1b3e813c8c6f3cfc19d11619630966");

    let raw = JSON.stringify({
        "app_id": "478939bb-8e38-49fc-84fc-7115a4e05b8a",
        "url": URL,
        "chrome_web_image": Image,
        "included_segments": ["Subscribed Users"],
        "data": { "foo": "bar" },
        "contents": { "en": Mensaje },
        "headings": { "en": Titulo }
    });

    let requestOptions = { method: 'POST', headers: myHeaders, body: raw, redirect: 'follow' };

    fetch("https://onesignal.com/api/v1/notifications", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

//Subir una imagen a cloudinary
function enviarImagen(fileInput, public_id) {
    let formdata = new FormData();
    formdata.append("file", fileInput.files[0]);
    formdata.append("upload_preset", "ml_default");
    formdata.append("public_id", public_id);

    let requestOptions = { method: 'POST', body: formdata, redirect: 'follow' };

    fetch("https://api.cloudinary.com/v1_1/js-media/upload", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

//Obtener una imagen desde cloudinary
function obtenerImagen(path, element) {
    let effect = "c_thumb,g_face,h_250,w_250";
    let url = `https://res.cloudinary.com/js-media/image/upload/${effect}/v1620739560/STC-UNI/Estudiantes/${path}.jpg`;
    if (imageExists(url)) {
        $(element).attr("src", url);
    } else {
        $(element).attr("src", "https://img.icons8.com/office/16/000000/no-image.png");
    }
}