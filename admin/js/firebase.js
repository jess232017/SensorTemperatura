//creamos constantes para los iconos editar y borrar    
const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';

const firebaseConfig = {
    apiKey: "AIzaSyCi6xuTAzN3SdQV7WOHWYOgK1aabuOZHcA",
    authDomain: "sensor-de-temperatura-a0371.firebaseapp.com",
    databaseURL: 'https://sensor-de-temperatura-a0371-default-rtdb.firebaseio.com',
    projectId: "sensor-de-temperatura-a0371",
    storageBucket: "gs://sensor-de-temperatura-a0371.appspot.com/",
    messagingSenderId: "251434379203",
    appId: "1:251434379203:web:1c923b67801ba4c7e3bf76",
    measurementId: "G-S380YW4E3B"
};

var Sensor_IdCode = "null",
    isConnected = false;

//Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();
const storage = firebase.storage();
const dbEstudiantes = db.ref().child('estudiantes');
const dbAsistencias = db.ref().child('asistencias');
const dbSensor1 = db.ref().child('sensores/sensor-01');
const txtDegree = document.querySelector('.visual-number');

//#region Ajustes

var connectedRef = firebase.database().ref(".info/connected").on("value", (snap) => {
    isConnected = snap.val();
    if (!isConnected && Sensor_IdCode != "null") {
        $('.toast').toast('show');
        drawOffline();
    }
})

firebase.firestore().enablePersistence();
//#endregion


//#region Consultas 
dbSensor1.on('value', snap => {
    let sensor = snap.val();
    if (typeof gauge !== 'undefined') {
        gauge.set(sensor.temperatura);
    }

    $('.visual-number').text(sensor.temperatura);
    document.querySelector('#txtTemperatura').value = sensor.temperatura;

    if (Sensor_IdCode != "null" && Sensor_IdCode !== sensor.codigo) {
        openNewAttend(sensor.codigo);
    }

    Sensor_IdCode = sensor.codigo;
});

dbEstudiantes.on('value', snap => {
    let students = snap.val();

    //Guardar la informacion en  una base de datos local
    dbOffline.collection('students').doc('student-data1').set(students);

    drawStudentTable(students);
});

dbAsistencias.on('value', snap => {
    var attendances = snap.val();

    //Guardar la informacion en una base de datos local
    dbOffline.collection('attendances').doc('attend-data1').set(attendances);

    drawAttendTable(attendances);
});

function getStudent(idCode, callback) {
    dbEstudiantes.orderByChild("codigo").equalTo(idCode).once("value", values => {
        callback(values);
    });
}

function getAttendees(idCode, callback) {
    dbAsistencias.orderByChild("codigo").equalTo(idCode).once("value", values => {
        callback(values);
    });
}

function setImgfromFirebase(path, element) {
    let storageRef = storage.ref('/imagenes/');
    storageRef.child(`${path}.jpg`).getDownloadURL().then(url => {
        $(element).attr("src", url);
    }).catch(error => {
        alert('el usuario no posee imagen ' + error)
    });
}

//#endregion

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

$('#table-user tbody').on('click', 'tr', function() {
    let data = tableUser.row(this).data();
    setPersonCard(data);
    getAttendees(data[1], ajustAlert);
});

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

var tablehight = $('#table-hight').DataTable({
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

var tablePerson = $('#table-attend-personal').DataTable({
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

//#endregion

//#region Enviar Formulario
//Variable con el mensaje en caso de presentar alta temperatura
var msAlert;

// Guardar
$('form').submit(function(e) {
    e.preventDefault();

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
    dbAsistencias.update(actualizacionData).then(() => {
            if (parseInt(temperatura) > 37) {
                let Titulo = "Alerta: Peligro biologico";
                let URL = `https://stc-uni.netlify.app/admin/student-info.html?id=${idCode}`;
                let imgSrc = document.querySelector("#cardImagen").src;

                enviarNotificacion(Titulo, msAlert, URL, imgSrc);
            }
        })
        .catch(error => {
            console.log(error);
        });

    idFirebase = '';

    resetModal();
});
//#endregion