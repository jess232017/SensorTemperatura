//#region Inicializar tabla de estudiantes
var tableUser = $('#table-user').DataTable({
    responsive: true,
    language: {
        url: './assets/translate.json'
    },
    columnDefs: [{
            targets: [0],
            visible: false, //ocultamos la columna de idFirebase que es la [0]                        
        }, {
            targets: [1],
            render: function(data) {
                return `<img loading="lazy" style="border-radius:50%" src="https://res.cloudinary.com/js-media/image/upload/c_scale,e_auto_brightness,h_48,q_80,w_48/v1620739560/STC-UNI/Estudiantes/${data}.jpg" alt="${data}">`
            }
        },
        {
            targets: [10],
            render: data => {
                return `<div class='wrapper text-center'>
                    <div class='btn-group'>
                        <button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>${iconoEditar}</button>
                        <button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Borrar'>${iconoBorrar}</button>
                        <input type="hidden" value="${data}">
                    </div>
                </div>`;
            }
        }
    ]
});

$('#table-user tbody').on('click', 'tr', function() {
    let data = tableUser.row(this).data();
    if (typeof data !== 'undefined') {
        setPersonCard({
            fbcode: data[0],
            codigo: data[2],
            nombres: data[3],
            apellidos: data[4],
            carrera: data[5],
            sexo: data[6],
            direccion: data[7]
        });
        getAttendees(data[1], ajustAlert);
    }
});

$("#table-user").on("click", ".btnEditar", (e) => {
    let aux = e.target.closest('.btn-group').querySelector('input');
    getStudentById(aux.value, fillFrmStudent);
});

$("#table-user").on("click", ".btnBorrar", e => {
    let aux = e.target.closest('.btn-group').querySelector('input');
    Swal.fire({
        title: '¿Está seguro de eliminar al estudiante?',
        text: "¡Está operación no se puede revertir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Borrar'
    }).then((result) => {
        if (result.value) {
            db.ref().child(`estudiantes/${aux.value}`).remove();
            Swal.fire('¡Eliminado!', 'El estudiante ha sido eliminado.', 'success')
        }
    })
});
//#endregion

//#region Inicializar tabla de asistencias
const clDefAttend = [{
        targets: [0],
        visible: false, //ocultamos la columna de idFirebase que es la [0]                        
    }, {
        targets: [1],
        render: function(data) {
            return `<img loading="lazy" style="border-radius:50%" src="https://res.cloudinary.com/js-media/image/upload/c_scale,e_auto_brightness,h_48,q_80,w_48/v1620739560/STC-UNI/Estudiantes/${data}.jpg" alt="${data}">`
        }
    },
    {
        targets: [6],
        render: data => {
            return `<div class='wrapper text-center'>
                <div class='btn-group'>
                    <button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>${iconoEditar}</button>
                    <button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Borrar'>${iconoBorrar}</button>
                    <input type="hidden" value="${data}">
                </div>
            </div>`;
        }
    }
];

var tableAttend = $('#table-attend').DataTable({
    responsive: true,
    language: {
        url: './assets/translate.json'
    },
    columnDefs: clDefAttend,
});

var tablehight = $('#table-hight').DataTable({
    responsive: true,
    language: {
        url: './assets/translate.json'
    },
    columnDefs: clDefAttend,
});

var tablePerson = $('#table-attend-personal').DataTable({
    responsive: true,
    language: {
        url: './assets/translate.json'
    },
    columnDefs: clDefAttend,
});

$('#table-attend tbody').on('click', 'tr', function() {
    let data = tableAttend.row(this).data();
    if (typeof data !== 'undefined') {
        getStudent(data[2], ajustPerson);
        getAttendees(data[2], ajustAlert);
    }
});

$("#table-attend, #table-hight, #table-attend-personal").on("click", ".btnEditar", (e) => {
    let aux = e.target.closest('.btn-group').querySelector('input');
    getAttendById(aux.value, fillFrmAttend);
});

$("#table-attend, #table-hight, #table-attend-personal").on("click", ".btnBorrar", e => {
    let aux = e.target.closest('.btn-group').querySelector('input');
    Swal.fire({
        title: '¿Está seguro de eliminar la asistencia?',
        text: "¡Está operación no se puede revertir!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Borrar'
    }).then((result) => {
        if (result.value) {
            db.ref().child(`asistencias/${aux.value}`).remove();
            Swal.fire('¡Eliminado!', 'La Asistencia ha sido eliminado.', 'success')
        }
    })
});

//#endregion

//#region Rellenar de datos las Tablas
function drawStudentTable(students) {

    tableUser.clear().draw();

    for (let i in students) {
        let item = students[i];

        dataSet = [
            i,
            item.codigo,
            item.codigo,
            item.nombres,
            item.apellidos,
            item.carrera,
            item.sexo,
            item.direccion,
            item.telefono,
            item.correo,
            i,
        ];
        tableUser.rows.add([dataSet]).draw();
    }
    tableUser.columns.adjust().draw();
}

function drawAttendTable(attendances) {
    tablePerson.clear().draw();
    tableAttend.clear().draw();
    tablehight.clear().draw();

    for (let i in attendances) {
        let item = attendances[i];
        dataSet = [
            i,
            item.codigo,
            item.codigo,
            item.fecha,
            item.hora,
            item.temperatura,
            i,
        ];
        tableAttend.rows.add([dataSet]).draw();
        if (item.temperatura > 37) {
            tablehight.rows.add([dataSet]).draw();
        }
        if (item.codigo === idPerson) {
            tablePerson.rows.add([dataSet]).draw();
        }
    }
    tablePerson.columns.adjust().draw();
    tableAttend.columns.adjust().draw();
    tablehight.columns.adjust().draw();
}
//#endregion