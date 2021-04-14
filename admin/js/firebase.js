var firebaseConfig = {
    apiKey: "AIzaSyCi6xuTAzN3SdQV7WOHWYOgK1aabuOZHcA",
    authDomain: "sensor-de-temperatura-a0371.firebaseapp.com",
    databaseURL: 'https://sensor-de-temperatura-a0371-default-rtdb.firebaseio.com',
    projectId: "sensor-de-temperatura-a0371",
    storageBucket: "sensor-de-temperatura-a0371.appspot.com",
    messagingSenderId: "251434379203",
    appId: "1:251434379203:web:1c923b67801ba4c7e3bf76",
    measurementId: "G-S380YW4E3B"
};

//Inicializar Firebase
firebase.initializeApp(firebaseConfig);

//#region Tabla de usuarios
var tableUser = $('#table-user').DataTable({
    responsive: true,
    language: {
        url: './assets/translate.json'
    }
});

const dbRefUsuarios = firebase.database().ref().child('Usuarios');
dbRefUsuarios.on('value', snap => {
    var Usuarios = snap.val(),
        result = [];

    for (var i in Usuarios)
        result.push([i, Usuarios[i]]);

    tableUser.clear().draw();

    result.forEach(element => {
        let item = element[1];
        dataSet = [
            element[0],
            item.Nombres,
            item.Apellidos,
            item.Sexo,
            item.Direccion,
            item.Telefono,
            item.Correo,
        ];
        tableUser.rows.add([dataSet]).draw();
    });


})

//#endregion

var stepper = new Stepper(document.querySelector('#stpIngresar'))

function nextStep() {
    stepper.next();
}

document.querySelector('table').style.width = '100%';