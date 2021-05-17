//#region Frm de Asistencia
function fillFrmAttend(data) {
    document.querySelector('#txtHora').value = data.hora;
    document.querySelector('#txtFecha').value = data.fecha.split("/").reverse().join("-");;
    document.querySelector('#txtCodigo').value = data.codigo;
    document.querySelector('#txtDescripcion').value = data.descripcion;
    document.querySelector('#txtTemperatura').value = data.temperatura;
    document.querySelector('#idAsistencia').value = data.idFirebase;
    $('#regAsistencia').modal('show');
    if (!Pushed) {
        document.querySelector('#btnMas').click();
    }
}

//Eventos
document.getElementById('regAsistencia').addEventListener('hidden.bs.modal', resetModal);

//#endregion

//#region Frm de Estudiante
var Pushed = false;
var btnMas = document.querySelector('#btnMas');
btnMas.addEventListener('click', function() {
    btnMas.innerText = (Pushed) ? 'Ver más' : 'Ver menos';
    Pushed = !Pushed;
});

function fillFrmStudent(data) {
    console.log(data);
    document.querySelector('#txtNombres').value = data.nombres;
    document.querySelector('#txtApellidos').value = data.apellidos;
    document.querySelector('#txtCarrera').value = data.carrera;
    document.querySelector('#txtCarnet').value = data.codigo;
    document.querySelector('#txtCorreo').value = data.correo;
    document.querySelector('#txtDireccion').value = data.direccion;
    document.querySelector('#txtSexo').value = data.sexo;
    document.querySelector('#txtTelefono').value = data.telefono;
    document.querySelector('#idEstudiante').value = data.idFirebase;
    obtenerImagen(data.codigo, "#profileImage")
    $('#record-student').modal('show');
}

function setProfileImage(e) {


    var file = document.getElementById('file').files[0];
    var reader = new FileReader();
    // it's onload event and you forgot (parameters)
    reader.onload = function(e) {
            var image = document.querySelector("#profileImage");
            // the result image data
            image.src = e.target.result;
        }
        // you have to declare the file loading
    reader.readAsDataURL(file);
}

//
document.getElementById('regAsistencia').addEventListener('hidden.bs.modal', () => {
    document.querySelector('#idEstudiante').value = "";
});
//#endregion