//#region Inicializar tabla de estudiantes
var tableUser = $('#table-user').DataTable({
    responsive: true,
    /*"order": [
        [3, "asc"]
    ],*/
    language: {
        url: './assets/translate.json'
    },
    columnDefs: [{
            targets: [0],
            visible: false, //ocultamos la columna de idFirebase que es la [0]                        
        }, {
            targets: [1],
            //let effect2 = "c_scale,e_auto_brightness,h_48,q_80,w_48";
            render: (data) => {
                let url = obtenerImagen(data, effect2);
                return `<img loading="lazy" style="border-radius:50%" src="${url}" alt="${data}">`;
            }
        },
        {
            targets: [10],
            render: data => {
                return `<div class='wrapper text-center'>
                    <div class='btn-group'>
                        <button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>
                            <svg class="c-icon c-icon-x">
                                <use xlink:href="assets/svg-symbols.svg#edit"></use>
                            </svg>
                        </button>
                        <button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Borrar'>
                            <svg class="c-icon c-icon-x">
                                <use xlink:href="assets/svg-symbols.svg#delete"></use>
                            </svg>
                        </button>
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
            codigo: data[1],
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
        render: data => `
            <div class='wrapper text-center'>
                <img loading="lazy" style="border-radius:50%" src="https://res.cloudinary.com/js-media/image/upload/c_scale,e_auto_brightness,h_48,q_80,w_48/v1620739560/STC-UNI/Estudiantes/${data}.jpg" alt="${data}">
            </div>
        `

    }, {
        targets: [2],
        render: data => {
            let badge = data.temperatura < MaxTemperatura ? `<span class="badge bg-light text-dark">${data.temperatura}</span>` : `<span class="badge bg-danger">${data.temperatura}</span>`;
            return `
            <div class="d-flex flex-column">
                <div>${badge}</div>
                <span class="small text-muted">${data.codigo}</span>
            </div>`;
        }
    },
    {
        targets: [3],
        render: data => `
            <div class="d-flex flex-column">
                <div>${data.fecha}</div>
                <span class="small text-muted">${data.hora}</span>
            </div>
        `
    },
    {
        targets: [5],
        render: data => {
            return `
            <div class='wrapper text-center'>
                <div class='btn-group'>
                    <button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>
                        <svg class="c-icon c-icon-x">
                            <use xlink:href="assets/svg-symbols.svg#edit"></use>
                        </svg>
                    </button>
                    <button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Borrar'>
                        <svg class="c-icon c-icon-x">
                            <use xlink:href="assets/svg-symbols.svg#delete"></use>
                        </svg>
                    </button>
                    <input type="hidden" value="${data}">
                </div>
            </div>`;
        }
    }
];

const clVisitorAttend = [{
        targets: [2],
        render: data => {
            let badge = data.temperatura < MaxTemperatura ? `<span class="badge bg-light text-dark">${data.temperatura}</span>` : `<span class="badge bg-danger">${data.temperatura}</span>`;
            return `<div>${badge}</div>`;
        }
    },
    {
        targets: [3],
        render: data => `
        <div class="d-flex flex-column">
            <div>${data.fecha}</div>
            <span class="small text-muted">${data.hora}</span>
        </div>
    `
    },
    {
        targets: [4],
        render: data => {
            return `
        <div class='wrapper text-center'>
            <div class='btn-group'>
                <button class='btnEditar btn btn-primary' data-toggle='tooltip' title='Editar'>
                    <svg class="c-icon c-icon-x">
                        <use xlink:href="assets/svg-symbols.svg#edit"></use>
                    </svg>
                </button>
                <button class='btnBorrar btn btn-danger' data-toggle='tooltip' title='Borrar'>
                    <svg class="c-icon c-icon-x">
                        <use xlink:href="assets/svg-symbols.svg#delete"></use>
                    </svg>
                </button>
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

let tablehight = $('#table-hight').DataTable({
    responsive: true,
    language: {
        url: './assets/translate.json'
    },
    columnDefs: clDefAttend,
});

let tablePerson = $('#table-attend-personal').DataTable({
    responsive: true,
    language: {
        url: './assets/translate.json'
    },
    columnDefs: clDefAttend,
});

let tableAttendVisit = $('#table-attend-visit').DataTable({
    responsive: true,
    language: {
        url: './assets/translate.json'
    },
    columnDefs: clVisitorAttend,
});

$('#table-attend tbody').on('click', 'tr', function() {
    let data = tableAttend.row(this).data();
    if (typeof data !== 'undefined') {
        getStudent(data[1], ajustPerson);
        getAttendees(data[1], ajustAlert);
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
            {
                codigo: item.codigo,
                temperatura: item.temperatura
            },
            {
                fecha: item.fecha,
                hora: item.hora
            },
            item.descripcion,
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

function drawVisitorTable(attendances) {
    tableAttendVisit.clear().draw();

    for (let i in attendances) {
        let item = attendances[i];
        dataSet = [
            i,
            item.descripcion,
            {
                codigo: item.codigo,
                temperatura: item.temperatura
            },
            {
                fecha: item.fecha,
                hora: item.hora
            },
            i,
        ];
        tableAttendVisit.rows.add([dataSet]).draw();
    }
    tableAttendVisit.columns.adjust().draw();
}
//#endregion