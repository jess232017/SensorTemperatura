var dbOffline = new Localbase('dbSensor')

dbOffline.collection('students').add({ foo: 'to do' }, 'student-data1')

dbOffline.collection('attendances').add({ foo: 'to do' }, 'attend-data1')

function drawOffline() {
    dbOffline.collection('students').get().then(students => {
        drawStudentTable(students[0]);
    });

    dbOffline.collection('attendances').get().then(attendances => {
        drawAttendTable(attendances[0]);
    });
}


function openNewAttend(code) {
    if (!document.body.classList.contains('modal-open')) {
        document.querySelector('#fab').click();
    }

    document.querySelector('#txtCodigo').value = code;
    nextStep();
}