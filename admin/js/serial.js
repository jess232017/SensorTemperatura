var isServing = false;
const divConsole = document.getElementById("console");
const btnServer = document.getElementById('btnServer');
const onlyServer = document.getElementById("only-server");
const errorText = '<span class="badge bg-danger">Error: </span><span style="color:red">';

if (typeof(divConsole) != 'undefined' && divConsole != null) {
    const ps = new PerfectScrollbar(divConsole);
}

if (typeof(btnServer) != 'undefined' && btnServer != null) {
    btnServer.addEventListener('click', () => {
        divConsole.innerHTML = "Intentando conectarse <br>";
        if (navigator.serial) {
            connectSerial();
        } else {
            writeInConsole(errorText + 'Web Serial API no soportada.</span>');
        }
    });
}

async function connectSerial() {
    try {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 });

        const decoder = new TextDecoderStream();

        port.readable.pipeTo(decoder.writable);

        const inputStream = decoder.readable;
        const reader = inputStream.getReader();

        setServing(true);
        while (true) {
            const { value, done } = await reader.read();

            if (value) {
                writeInConsole(value.toString());
                fromArduino(value.toString());
            }

            if (done) {
                console.log('[readLoop] DONE', done);
                reader.releaseLock();
                setServing(false);
                break;
            }
        }
    } catch (error) {
        writeInConsole(errorText + error + '</span>');
        setServing(false);
    }
}

function writeInConsole(mensaje) {
    if (typeof(divConsole) != 'undefined' && divConsole != null) {
        divConsole.innerHTML += "<br>" + mensaje;
        divConsole.scrollTop = divConsole.scrollHeight;
    }
}

function toArduino() {
    var data = document.getElementById("txtArduino").value;
    document.getElementById("txtArduino").value = "";
    document.sendform.txtArduino.focus();

    dbSensor1.child('to-serial').set(data, error => {
        if (error) {
            console.log("Error al escribir: " + error)
        }
    });
}

function setServing(value) {
    isServing = value;
    btnServer.innerText = isServing ? "Conectado" : "Conectar"
        /*if (isServing) {
            onlyServer.classList.remove("hide")
        } else {
            onlyServer.classList.add("hide")
        }*/
}