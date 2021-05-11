//#region Inicializar tabla de estudiantes
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

//#region Inicializar tabla de asistencias
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

//#region Rellenar de datos las Tablas
function drawStudentTable(students) {

    tableUser.clear().draw();

    for (let i in students) {
        let item = students[i];

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
    tableUser.columns.adjust().draw();
}

function drawAttendTable(attendances) {
    tablePerson.clear().draw();
    tableAttend.clear().draw();
    tablehight.clear().draw();

    for (var i in attendances) {
        let item = attendances[i];
        dataSet = [
            i,
            item.codigo,
            item.fecha,
            item.hora,
            item.temperatura,
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