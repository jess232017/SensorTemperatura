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
const db = firebase.database();
var dbAsistencias = db.ref().child('asistencias');

//#region Tabla de usuarios
var tableUser = $('#table-user').DataTable({
    responsive: true,
    language: {
        url: './assets/translate.json'
    }
});

const dbRefUsuarios = db.ref().child('Usuarios');
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

//#region Formulario
var Pushed = false;
var btnMas = document.querySelector('#btnMas');
btnMas.addEventListener('click', function() {
    btnMas.innerText = (Pushed) ? 'Ver más' : 'Ver menos';
    Pushed = !Pushed;
});

var idCode, temperatura, hora, fecha, descripcion;

function nextStep() {
    let Current = new Date();

    idCode = $('#txtCodigo').val();
    temperatura = $('#txtTemperatura').val();
    hora = Current.toLocaleTimeString();
    fecha = Current.toLocaleDateString();
    descripcion = "";

    if (Pushed) {
        hora = $('#txtHora').val();
        fecha = $('#txtFecha').val();
        descripcion = $('#txtDescripcion').val();
    }

    if (idCode === '' || temperatura === '' || ((hora === '' || fecha === '') && Pushed)) {
        alert('Debe completar la informacion');
    } else {
        console.log(idCode, temperatura, hora, fecha, descripcion);
        stepper.next()
    }

}

// Guardar
$('form').submit(function(e) {
    e.preventDefault();
    alert("intando enviar");

    let idFirebase = $('#idAsistencia').val();

    //Si el id esta vacio entonces crear un nuevo elemento
    if (idFirebase == '') {
        idFirebase = dbAsistencias.push().key;
    };

    data = {
        codigo: idCode,
        fecha: fecha,
        hora: hora,
        temperatura: temperatura,
        descripcion: descripcion
    };

    actualizacionData = {};
    actualizacionData[`/${idFirebase}`] = data;
    dbAsistencias.update(actualizacionData);
    idFirebase = '';
    $('form').trigger('reset');
    $('#tomarDatos').modal('hide');
});


//#endregion

var stepper = new Stepper(document.querySelector('#stpIngresar'), { linear: false })