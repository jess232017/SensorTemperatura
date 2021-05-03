var dbOffline = new Localbase('db')

dbOffline.collection('students').add({ foo: 'to do' }, 'student-data1')

dbOffline.collection('attendances').add({ foo: 'to do' }, 'attend-data1')

function drawOffline() {
    dbOffline.collection('students').get().then(students => {
        drawStudentTable(students);
    });

    dbOffline.collection('attendances').get().then(attendances => {
        drawStudentTable(attendances);
    });
}

//#region Dibujar las Tablas
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