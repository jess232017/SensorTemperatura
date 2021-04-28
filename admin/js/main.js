
var stepper = new Stepper(document.querySelector('#stpIngresar'), { linear: false })

//#region Graficos
var myChart;

function showTemperatura() {
    if ($("#main-chart").length) {
        var chartDegree = document.querySelector("#main-chart").getContext('2d');
        myChart = new Chart(chartDegree, {
            type: 'line', // 
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    label: 'Temperatura',
                    fill: true,
                    backgroundColor: "rgba(54, 162, 235, 0.2)",
                    borderWidth: 1,
                    borderColor: "blue"
                }]
            },
        });
    }
}

function setGaugeTemperature() {
    if ($("#gauge-temperature").length) {
        var aux = {
            angle: -0.09,
            animationSpeed: 63,
            colorStart: "#6FADCF",
            colorStop: "#8FC0DA",
            currval: 1500,
            fontSize: 42,
            generateGradient: true,
            lineWidth: 0.43,
            pointer: { length: 0.31, color: "#000000", strokeWidth: 0.115 },
            radiusScale: 1,
            renderTicks: {
                divColor: "#333333",
                divLength: 0.45,
                divWidth: 1.1,
                divisions: 3,
                subColor: "#666666",
                subDivisions: 3,
                subLength: 0.5,
                subWidth: 0.6
            },
            staticLabels: {
                font: "10px sans-serif", // Specifies font
                labels: [-40, -20, 0, 20, 40], // Print labels at these values
                color: "#000000", // Optional: Label text color
                fractionDigits: 0 // Optional: Numerical precision. 0=round off.
            },
            strokeColor: "#E0E0E0",
            staticZones: [
                { strokeStyle: "#6495ed", min: -50, max: -20 },
                { strokeStyle: "#96acd6", min: -21, max: 20 },
                { strokeStyle: "#FFDD00", min: 19, max: 33 }, // Yellow
                { strokeStyle: "#30B32D", min: 32, max: 37 }, // Green
                { strokeStyle: "#F03E3E", min: 37, max: 50 }, // Yellow
            ],
        }

        let target = document.querySelector('#gauge-temperature'); // your canvas element
        gauge = new Gauge(target).setOptions(aux); // create sexy gauge!
        gauge.maxValue = 50; // set max gauge value
        gauge.setMinValue(-50); // Prefer setter over gauge.minValue = 0
        gauge.animationSpeed = 32; // set animation speed (32 is default value)
        gauge.set(50); // set actual value
    }

}

showTemperatura();
setGaugeTemperature();
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

    getStudent(idCode, validarForm);
}

function validarForm(data) {
    if(data.exists()){
        if (Pushed) {
            hora = $('#txtHora').val();
            fecha = $('#txtFecha').val();
            descripcion = $('#txtDescripcion').val();
        }
            
        if (idCode === '' || temperatura === '' || ((hora === '' || fecha === '') && Pushed)) {
            alert('Debe completar la informacion');

        } else {
            data = data.val();
            data = data[Object.keys(data)[0]]

            setImgfromFirebase(idCode, '#cardImagen');
            $('#regHora').text(hora);
            $('#regFecha').text(fecha);
            $('#txtIded').text(idCode);
            $("#txtIded").attr("href", `student-info.html?id=${idCode}`);
            $('#regTemp').text(temperatura + ' ºC ');
            $('#txtCarrera').text(data.carrera);
            $('#txtNombre').text(`${data.nombres} ${data.apellidos}`);

            if (parseInt(temperatura) > 37) {
                $("#regTemp").addClass("text-danger");
            } else {
                $("#regTemp").removeClass("text-danger");
            }

            stepper.next()
        }
    }else{
        alert('no hay ningun registro con este codigo');
    }
}

function CerrarModal(modalId) {
    // obtener el modal
    const modal = document.querySelector(modalId);

    // change state like in hidden modal
    modal.classList.remove('show');
    modal.setAttribute('aria-hidden', 'true');
    modal.setAttribute('style', 'display: none');

    // obtener el modal backdrop
    const modalBackdrops = document.getElementsByClassName('modal-backdrop');

    // remover opened modal backdrop
    document.body.removeChild(modalBackdrops[0]);
}
//#endregion

//#region Person-Card
$('#table-attend tbody').on('click', 'tr', function() {
    let data = tableAttend.row(this).data();
    getStudent(data[1], ajustPerson);
    getAttendees(data[1], ajustAlert);
});

function ajustPerson(students) {  
    if(students.exists()){
        //Obtener hijos
        students = students.val();
        let fbcode = Object.keys(students)[0];

        let item = students[fbcode];
        item.fbcode = fbcode;
    
        let data = [item.fbcode, item.codigo ,item.nombres, item.apellidos, item.carrera, item.sexo, item.direccion];
        setPersonCard(data);
    }else{
        alert("no se obtuvo informacion")
    }
}

function ajustAlert(attends) {
    if(attends.exists()){
        attends = attends.val();
        for (let i in attends) {
            let item = attends[i];
            if (item.temperatura >= 38) {
                setAlertCard(item);
            }
        }
    }else{
        alert("no se obtuvo informacion")
    }
}

function setPersonCard(data) {
    setImgfromFirebase(data[1], '#imgPerson');
    
    $('#div-list').addClass('col-xl-8');
    $('#div-person').removeClass('hide');
    tableUser.columns.adjust().draw();
    tableAttend.columns.adjust().draw();
    $('#tdCarnet').text(data[1]);
    $('#txt-Nombre').text(data[2]);
    $('#tdApellido').text(data[3]);
    $('#tdCarrera').text(data[4]);
    $('#tdDireccion').text(data[6]);
    $('#link-person').attr('href', `student-info.html?id=${data[1]}`);

    document.querySelector('#txtCodigo').value = data[1];
    document.querySelector('#listAlertas').innerHTML = "";
}

function setAlertCard(data) {
    $('#remove-me').remove();
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

if (idPerson != null){
    getStudent(idPerson, ajustPerson);
    getAttendees(idPerson, ajustAlertTable);
    $('#tabAlertas').click();
}

function ajustAlertTable(attends) {
    if(attends.exists()){
        attends = attends.val();
        for (let i in attends) {
            let item = attends[i];
            if (item.temperatura >= 38) {
                setAlertTable(item);
            }
        }
    }else{
        alert("no se obtuvo informacion")
    }
}

function setAlertTable(data) {
    document.querySelector('div#remove-me').remove();
    let divAlertas = document.querySelector('#listAlertas');

    let item = document.createElement('tr');
    item.innerHTML = `
        <td class="text-center">
            <i class="fa fa-exclamation-triangle"></i>
        </td>
        <td>
            La temperatura registrada es de ${data.temperatura}º, la cual, supera el rango normal establecido.
        </td>
        <td>
            ${data.fecha} ${data.hora}
        </td>
    `;
    divAlertas.appendChild(item);
}

//#endregion