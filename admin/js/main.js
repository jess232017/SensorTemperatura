var MaxTemperatura = 38;
var stepper = new Stepper(document.querySelector('#stpIngresar'));

//#region Opacar menu
var path = window.location.pathname;
var page = path.split("/").pop();

if (page != "" && page != "student-info.html") {
    document.querySelector(`a[href='${page}']`).style.backgroundColor = "#323d4c";
} else {
    document.querySelector(`a[href='index.html']`).style.backgroundColor = "#323d4c";
}
//#endregion

//#region Formulario
var idCode, temperatura, hora, fecha, descripcion;

function nextStep() {
    let Current = new Date();
    idCode = $('#txtCodigo').val();
    temperatura = $('#txtTemperatura').val();
    if (Pushed) {
        hora = $('#txtHora').val();
        fecha = $('#txtFecha').val();
        descripcion = $('#txtDescripcion').val();
    } else {
        hora = Current.toLocaleTimeString('en-US');
        fecha = Current.toLocaleDateString('en-US');
        descripcion = "";
    }
    getStudent(idCode, validarForm);
}

var titleAlert, descripcionAlert;

function validarForm(data) {
    if (data.exists()) {
        //Pura validacion
        let isOkay = true;

        isOkay = validarCampo('#txtCodigo', isOkay);
        isOkay = validarCampo('#txtTemperatura', isOkay);

        if (Pushed) {
            isOkay = validarCampo('#txtFecha', isOkay);
            isOkay = validarCampo('#txtHora', isOkay);
        }

        if (isOkay) {
            data = data.val();
            data = data[Object.keys(data)[0]]

            obtenerImagen(idCode, '#cardImagen');
            $('#regHora').text(hora);
            $('#regFecha').text(fecha);
            $('#txtIded').text(idCode);
            $("#txtIded").attr("href", `student-info.html?id=${idCode}`);
            $('#regTemp').text(temperatura + ' ºC ');
            $('#txtCareer').text(data.carrera);
            $('#txtNombre').text(`${data.nombres} ${data.apellidos}`);

            if (parseInt(temperatura) > 37) {
                $("#regTemp").addClass("text-danger");
                titleAlert = `⚠️: ${data.nombres} ${data.apellidos}`;
                descripcionAlert = `presenta fiebre de ${temperatura}ºC a las ${hora} 🤒🚨`;
            } else {
                $("#regTemp").removeClass("text-danger");
            }

            stepper.next()
        }
    } else {
        document.querySelector('#txtCodigo').classList.add('is-invalid');
        stepper.reset();
    }
}

function validarCampo(element, isOkay) {
    let domInput = document.querySelector(element);

    if (domInput.value === '') {
        domInput.classList.add('is-invalid');
        return false;
    } else {
        domInput.classList.remove('is-invalid');
        domInput.classList.add('is-valid');
        return (isOkay) ? true : false;
    }
}


//#endregion

//#region Person-Card
function ajustPerson(students) {
    if (students.exists()) {
        //Obtener hijos
        students = students.val();
        let fbcode = Object.keys(students)[0];

        let item = students[fbcode];
        item.fbcode = fbcode;

        setPersonCard(item);
    } else {
        alert("No se encontro informacion del estudiante")
    }
}

function ajustAlert(attends) {
    let divAlertas = document.querySelector('#listAlertas');
    if (typeof divAlertas !== 'undefined' && divAlertas !== null) {
        if (attends.exists()) {
            //Limpiar la lista de alertas

            divAlertas.innerHTML = "";
            attends = attends.val();
            for (let i in attends) {
                let item = attends[i];
                if (item.temperatura >= MaxTemperatura) {
                    setAlertCard(item);
                }
            }
        } else {
            divAlertas.innerHTML = `
                <li class="d-flex justify-content-center">
                    <div class="align-items-center text-white bg-primary border-0">
                        <div class="d-flex">
                            <div class="toast-body">
                                No hay ninguna alerta
                            </div>
                        </div>
                    </div>
                </li>
            `;
        }
    }
}

function setPersonCard(data) {
    obtenerImagen(data.codigo, '#imgPerson');

    $('#div-list').addClass('col-xl-8');
    $('#div-person').removeClass('hide');
    tableUser.columns.adjust().draw();
    tableAttend.columns.adjust().draw();
    $('#tdCarnet').text(data.codigo);
    $('#txt-Nombre').text(data.nombres);
    $('#tdApellido').text(data.apellidos);
    $('#tdCarrera').text(data.carrera);
    $('#tdDireccion').text(data.direccion);
    $('#link-person').attr('href', `student-info.html?id=${data[1]}`);

    document.querySelector('#txtCodigo').value = data[1];
}

function setAlertCard(data) {
    let divAlertas = document.querySelector('ul#listAlertas');

    let item = document.createElement('li');
    item.classList.add('timeline-item');
    item.innerHTML = `
            <strong>Temperatura: ${data.temperatura}º</strong>
            <span class="float-right text-muted text-sm">${data.fecha}</span>
            <p>La temperatura que se registro a las <span id="regHora" class="font-weight-bold">${data.hora}</span> 
            del estudiante es alta</p>
            
    `;
    divAlertas.appendChild(item);
}

//#endregion

//#region Obtener ID si hay
let params = new URLSearchParams(location.search);
var idPerson = params.get('id');

if (idPerson != null) {
    console.log(idPerson);
    getStudent(idPerson, ajustPerson);
    getAttendees(idPerson, ajustAlertTable);
    $('#tabAlertas').click();
}

function ajustAlertTable(attends) {
    if (attends.exists()) {
        attends = attends.val();
        for (let i in attends) {
            let item = attends[i];
            if (item.temperatura >= 38) {
                setAlertTable(item);
            }
        }
    } else {
        document.querySelector('#listAlertas').innerHTML = `
            <li class="d-flex justify-content-center">
                <div class="align-items-center text-white bg-primary border-0">
                    <div class="d-flex">
                        <div class="toast-body">
                            No hay ninguna alerta
                        </div>
                    </div>
                </div>
            </li>
        `;
    }
}

function setAlertTable(data) {
    let divAlertas = document.querySelector('#listAlertas');

    let item = document.createElement('tr');
    item.innerHTML = `
        <td class="text-center">
            <img src="https://img.icons8.com/windows/24/000000/box-important--v4.png"/>
        </td>
        <td>
            La temperatura registrada es de ${data.temperatura}º, la cual, supera el rango normal establecido.
        </td>
        <td>
            ${data.fecha} ${data.hora}
        </td>
    `;
    divAlertas.appendChild(item);
    console.log(item);
}

//#endregion

//#region reparar shadow effect en el sidebar
var shadow = document.createElement('div');
shadow.className = "c-sidebar-backdrop c-fade c-show";
shadow.addEventListener('click', () => {
    shadow.parentNode.removeChild(shadow);
    sidebar.classList.remove('c-sidebar-show');
})

function toogleMenu() {
    let sidebar = document.querySelector('aside#sidebar');
    document.querySelector('body').appendChild(shadow);
    sidebar.classList.add('c-sidebar-show');
}
//#endregion