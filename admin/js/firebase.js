//#region Ajustes
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
//const storage = firebase.storage();
const dbEstudiantes = db.ref().child('estudiantes');
const dbAsistencias = db.ref().child('asistencias');
const dbSensor1 = db.ref().child('sensores/sensor-01');
const txtDegree = document.querySelector('.visual-number');


var connectedRef = firebase.database().ref(".info/connected").on("value", (snap) => {
    let isConnected = snap.val();
    if (!isConnected && Sensor_IdCode != "null") {
        //drawOffline();
    }
})

firebase.firestore().enablePersistence();
//#endregion

//#region Realizar Consultas a la base de datos 
dbSensor1.child('codigo').on('value', snap => {
    let codigo = snap.val();

    if (Sensor_IdCode != "null") {
        openNewAttend(codigo.split('?date=')[0]);
    }

    Sensor_IdCode = codigo;
});

dbSensor1.child('temperatura').on('value', snap => {
    let value = snap.val().toFixed(2);

    if (typeof gauge !== 'undefined') {
        gauge.set(value);
    }

    if (Contador > 60) {
        removeData(myChart);
    }

    $('#visual-thermostat').text(value);
    document.querySelector('#txtTemperatura').value = value;
    addData(temperatureChart, new Date().toLocaleTimeString(), value);
});

dbSensor1.child('humedad').on('value', snap => {
    let value = snap.val();

    if (typeof gaugeHumidity !== 'undefined') {
        gaugeHumidity.set(value);
    }

    if (Contador > 60) {
        removeData(humidityChart);
    }

    $('#visual-humidity').text(snap.val());
    addData(humidityChart, new Date().toLocaleTimeString(), value);
})

dbSensor1.child('activo').on('value', snap => {
    if ($(".fab").length) {
        let fabSwitch = document.querySelector(".fab");
        let activo = snap.val();
        fabSwitch.style.color = (activo == 1) ? '#ffffff' : '#000000';

        fabSwitch.addEventListener('click', () => {
            let actualizacionData = {};
            actualizacionData['/activo'] = ((activo == 1) ? 0 : 1);
            dbSensor1.update(actualizacionData)
        });
    }
});

dbSensor1.child('from-serial').on('value', snap => {
    if (!isServing) {
        writeInConsole(snap.val().replace(/\x0D\x0A/g, "<br/>"))
    }
});

function fromArduino(data) {
    dbSensor1.child('from-serial').set(data, error => {
        if (error) {
            console.log("Error al escribir: " + error)
        }
    });
}

dbEstudiantes.on('value', snap => {
    let students = snap.val();

    //Guardar la informacion en  una base de datos local
    //dbOffline.collection('students').doc('student-data1').set(students);

    drawStudentTable(students);
});

dbAsistencias.child("/estudiantes").on('value', snap => {
    var attendances = snap.val();

    //Guardar la informacion en una base de datos local
    //dbOffline.collection('attendances').doc('attend-data1').set(attendances);

    drawAttendTable(attendances);
});

dbAsistencias.child("/visitantes").on('value', snap => drawVisitorTable(snap.val()));

function getStudent(idCode, callback) {
    dbEstudiantes.orderByChild("codigo").equalTo(idCode).once("value", values => {
        callback(values);
    });
}

function getStudentById(idRegistro, callback) {
    dbEstudiantes.child(idRegistro).once("value", values => {
        let object = values.val();
        object.idFirebase = idRegistro;
        callback(object);
    });
}

function getAttendees(idCode, callback) {
    dbAsistencias.child("/estudiantes").orderByChild("codigo").equalTo(idCode).once("value", values => {
        callback(values);
    });
}

function getAttendById(idAttend, callback) {
    dbAsistencias.child("/estudiantes").child(idAttend).once("value", values => {
        let object = values.val();
        object.idFirebase = idAttend;
        callback(object);
    });
}
//#endregion

//#region Realizar cambios en la base de datos Crear/Editar
$('form#frm-attend').submit(e => {
    e.preventDefault();

    if (idCode == "") {
        RegistrarIngresoVisitante();
    } else {
        RegistrarIngresoEstudiante();
    }
    resetModal();
});

function RegistrarIngresoEstudiante() {
    let idFirebase = $('#idAsistencia').val();

    //Si el id esta vacio entonces crear un nuevo elemento
    if (idFirebase === '') {
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
                let URL = `https://stc-uni.netlify.app/admin/student-info.html?id=${idCode}`;
                let imgSrc = `https://res.cloudinary.com/js-media/image/upload/ar_2:1,b_rgb:ffffff,bo_0px_solid_rgb:000,c_pad,h_500,o_90,q_50,w_1000/v1620739560/STC-UNI/Estudiantes/${idCode}.jpg`;
                enviarNotificacion(titleAlert, descripcionAlert, URL, imgSrc);
            }
        })
        .catch(error => {
            alert(error);
        });

    idFirebase = '';
}

function RegistrarIngresoVisitante() {
    let idFirebase = dbAsistencias.push().key;

    data = {
        descripcion: descripcion,
        fecha: fecha,
        hora: hora,
        temperatura: temperatura,
    };

    actualizacionData = {};
    actualizacionData[`/visitantes/${idFirebase}`] = data;
    dbAsistencias.update(actualizacionData).then(() => {
            if (parseInt(temperatura) > 37) {
                let URL = `https://stc-uni.netlify.app/admin/attend-visit.html`;
                enviarNotificacion(titleAlert, descripcionAlert, URL, "");
            }
        })
        .catch(error => {
            alert(error);
        });

    idFirebase = '';
}

$('form#reg-Student').submit(e => {
    e.preventDefault();

    //Si el id esta vacio entonces crear un nuevo elemento
    let idRegistro = $('#idEstudiante').val();

    //Si el id esta vacio entonces crear un nuevo elemento
    if (idRegistro == '') {
        idRegistro = dbAsistencias.push().key;
    };

    data = {
        apellidos: $("#txtApellidos").val(),
        carrera: $("#txtCarrera").val(),
        codigo: $("#txtCarnet").val(),
        correo: $("#txtCorreo").val(),
        direccion: $("#txtDireccion").val(),
        nombres: $("#txtNombres").val(),
        sexo: $("#txtSexo").val(),
        telefono: $("#txtTelefono").val(),
    };

    actualizacionData = {};
    actualizacionData[`/${idRegistro}`] = data;
    dbEstudiantes.update(actualizacionData).then((e) => {
            console.log(e);
        })
        .catch(error => {
            console.log(error);
        });

    idRegistro = '';

    enviarImagen(document.querySelector('#addImage'), data.codigo)
    document.querySelector("#closeModal").click();
});
//#endregion