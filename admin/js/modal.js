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

function resetModal() {
    stepper.reset();

    document.querySelector('#idAsistencia').value = "";
    document.querySelector('#txtCodigo').classList.remove('is-valid');
    document.querySelector('#txtTemperatura').classList.remove('is-valid');
    document.querySelector('#txtFecha').classList.remove('is-valid');
    document.querySelector('#txtHora').classList.remove('is-valid');

    document.querySelector("form#frm-attend").reset();
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
    document.querySelector("#profileImage").src = URL.createObjectURL(e.target.files[0]);
}

// Eventos
document.getElementById('regAsistencia').addEventListener('hidden.bs.modal', () => {
    document.querySelector('#idEstudiante').value = "";
});
//#endregion