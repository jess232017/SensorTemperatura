const cl = new cloudinary.Cloudinary({
    cloud_name: "js-media",
    secure: true
});

/*
    let effect = "c_thumb,g_face,h_250,w_250";
    let effect2 = "c_scale,e_auto_brightness,h_48,q_80,w_48";
*/

const effect1 = [
    { width: 250, height: 250, gravity: "face", crop: "thumb" },
];

const effect2 = [
    { width: 48, height: 48, quality: 80, gravity: "face", crop: "thumb" },
];

//Determinar si la imagen existe
function imageExists(image_url) {
    return true;

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
    //formdata.append("overwrite", true);
    //formdata.append("api_secret", "mPFl4NB7tsp-0AxvVftFAtfuWtM");
    //formdata.append("api_key", "749175694184996");

    let requestOptions = { method: 'POST', body: formdata, redirect: 'follow' };

    fetch("https://api.cloudinary.com/v1_1/js-media/upload", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}

//Obtener una imagen desde cloudinary
function obtenerImagen(path, transformation) {
    let url = cl.url(`STC-UNI/Estudiantes/${path}.png`, {
        secure: true,
        transformation
    });

    return url;
}