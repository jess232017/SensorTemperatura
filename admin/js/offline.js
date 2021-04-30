const dbSensor = new Dexie('dbSensor');

// Declare tables, IDs and indexes
dbSensor.version(1).stores({
    asistencias: '',
    estudiantes: '',
    sensores: ''
});

function addStudent(student) {
    console.log(student);
    dbSensor.estudiantes.add(student);
}