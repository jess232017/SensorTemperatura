//creamos constantes para los iconos editar y borrar    
const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';

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
const dbEstudiantes = db.ref().child('estudiantes');
const dbAsistencias = db.ref().child('asistencias');

//#region Tabla de estudiantes
var tableUser = $('#table-user').DataTable({
    responsive: true,
    language: {
        url: './assets/translate.json'
    },
    columnDefs: [{
            targets: [0],
            visible: false, //ocultamos la columna de idFirebase que es la [0]                        
        },
        {
            targets: -1,
            defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>" + iconoEditar + "</button><button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Borrar'>" + iconoBorrar + "</button></div></div>"
        }
    ]
});

dbEstudiantes.on('value', snap => {
    var Student = snap.val();
    tableUser.clear().draw();

    for (var i in Student) {
        let item = Student[i];
        dataSet = [
            i,
            item.codigo,
            item.nombres,
            item.apellidos,
            item.carrera,
            item.sexo,
            item.direccion,
            item.telefono,
            item.correo,
        ];
        tableUser.rows.add([dataSet]).draw();
    }
})

//#endregion

//#region Tabla de asistencias
var tableAttend = $('#table-attend').DataTable({
    responsive: true,
    language: {
        url: './assets/translate.json'
    },
    columnDefs: [{
            targets: [0],
            visible: false, //ocultamos la columna de idFirebase que es la [0]                        
        },
        {
            targets: -1,
            defaultContent: "<div class='wrapper text-center'><div class='btn-group'><button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>" + iconoEditar + "</button><button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Borrar'>" + iconoBorrar + "</button></div></div>"
        }
    ]
});

dbAsistencias.on('value', snap => {
    var Attend = snap.val();
    tableAttend.clear().draw();

    for (var i in Attend) {
        let item = Attend[i];
        dataSet = [
            i,
            item.codigo,
            item.fecha,
            item.hora,
            item.temperatura,
        ];
        tableAttend.rows.add([dataSet]).draw();
    }
});
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
        $('#regHora').text(hora);
        $('#regFecha').text(fecha);
        $('#regTemp').text(temperatura);
        if (parseInt(temperatura) > 37) {
            $("#regTemp").addClass("text-danger");
        } else {
            $("#regTemp").removeClass("text-danger");
        }
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