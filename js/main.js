var myStorage = window.localStorage;

var gauge;
var gaugeHumidity;
var myChart;
var txtDegree;
var Contador = 0;
var lastTempt = 0;
var fabSwitch;
var varSwitch = true;
var notyfDemo = new Notyf({
    position: {
        x: 'left',
        y: 'top',
    },
});
var chartDegree;

function Init() {
    chartDegree = document.querySelector('#chartDegree').getContext('2d');
    txtDegree = document.querySelectorAll('.visual-number');
    fabSwitch = document.querySelector('#fab');

    window.onscroll = function() { myFunction() };
    fabSwitch.addEventListener('click', switchSensor);

    //Guardar variable de notificaciones inhabilitada dentro del sistema
    let pushActive = myStorage.getItem('pushActive');

    if (typeof pushActive == 'undefined') {
        localStorage.setItem('pushActive', false);
    } else {
        console.log('checkedchecked', pushActive);
        if (pushActive === 'true') {
            document.getElementById("push").checked = true;
        }
    }

    getWeather();
    showTemperatura();
    setGaugeTemperature();
    setInterval(leerTemperatura, 1250);
}

function switchSensor() {
    varSwitch = !varSwitch;
    fabSwitch.style.color = (varSwitch) ? '#ffffff' : '#000000';
}

function showTemperatura() {
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
        actions: [{
                name: 'Randomize',
                handler(chart) {
                    chart.data.datasets.forEach(dataset => {
                        dataset.data = Utils.numbers({ count: chart.data.labels.length, min: -100, max: 100 });
                    });
                    chart.update();
                }
            },
            {
                name: 'Remove Dataset',
                handler(chart) {
                    chart.data.datasets.pop();
                    chart.update();
                }
            },
        ],
    });
}

function leerTemperatura() {

    if (!varSwitch) {
        txtDegree.forEach(item => {
            item.classList.add('disabled');
        });
        return;
    } else {
        txtDegree.forEach(item => {
            item.classList.remove('disabled');
        });
    }

    let aux = getRndTemperature(-50, 50);

    txtDegree.forEach(item => {
        item.innerText = `${aux}`;
    });

    addData(myChart, Contador++, aux)

    //
    gauge.set(aux);
    gaugeHumidity.set(aux);


    if (Contador > 60) {
        removeData(myChart);
    }

    //Notificar si la temperatura es alta
    if (aux > 38 && lastTempt != aux) {

        //Si esta disponible a traves de las notificaciones del sistema
        if (Notification.permission == "granted" && myStorage.getItem('pushActive') === 'true') {
            Push.create("¡Temperatura muy alta!", {
                body: `Los ${aux}°C supera al rango maximo establecido`,
                icon: '../img/alert.png',
                timeout: 4000,
                onClick: function() {
                    window.focus();
                    this.close();
                }
            });

            //Si no desde la misma interfaz de la pagina web
        } else if (!Swal.isVisible()) {
            new Howl({ src: ['../sound/Alerty.mp3'] }).play();

            Swal.fire({
                title: "¡Temperatura muy alta!",
                text: `Los ${aux}°C supera al rango maximo establecido`,
                icon: "warning",
                timer: 6000,
                timerProgressBar: true,
                footer: '<a href="#">¿Que hacer frente al Covid-19?</a>'
            });
            //Si existe una notificacion previa enviarla de fondo
        } else {
            new Howl({ src: ['../sound/Alert.mp3'] }).play();

            notyfDemo.error({
                message: `Los ${aux}°C supera el rango maximo establecido!`,
                duration: 3000,
            });
        }
    }

    lastTempt = aux;
}

//#region Graficos de la temperatura

function addData(chart, label, data) {
    chart.data.labels.push(label);
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data);
    });
    chart.update();
}

function removeData(chart) {
    chart.data.labels.shift();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.shift();
    });
    chart.update();
}


//Gauge Temperature
function setGaugeTemperature() {
    var opts = {
        angle: 0.15, // The span of the gauge arc
        lineWidth: 0.44, // The line thickness
        radiusScale: 1, // Relative radius
        pointer: {
            length: 0.6, // // Relative to gauge radius
            strokeWidth: 0.035, // The thickness
            color: '#000000' // Fill color
        },
        limitMax: false, // If false, max value increases automatically if value > maxValue
        limitMin: false, // If true, the min value of the gauge will be fixed
        colorStart: '#6FADCF', // Colors
        colorStop: '#8FC0DA', // just experiment with them
        strokeColor: '#E0E0E0', // to see which ones work best for you
        generateGradient: true,
        highDpiSupport: true, // High resolution support

    };

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
    gauge.set(30); // set actual value

    let target2 = document.querySelector('#gauge-humidity'); // your canvas element
    gaugeHumidity = new Gauge(target2).setOptions(opts); // create sexy gauge!
    gaugeHumidity.maxValue = 50; // set max gauge value
    gaugeHumidity.setMinValue(-50); // Prefer setter over gauge.minValue = 0
    gaugeHumidity.animationSpeed = 32; // set animation speed (32 is default value)
    gaugeHumidity.set(30); // set actual value

}

//#endregion

//#region Obtener temperatura y clima
function getWeather() {
    fetch("https://api.openweathermap.org/data/2.5/weather?id=3617763&appid=63ea8a31096b0c9250a8505ff8f2c8a9&units=metric").then(response => {
            response.json().then(data => {

                let imgWeather = document.querySelector('#imgWeather');
                let txtWeather = document.querySelector('#txtWeather');
                txtWeather.innerText = data.main.temp;
                //imgWeather.src = `../img/09n.png`;
                imgWeather.src = `../img/${data.weather[0].icon}.png`;

                imgWeather.alt = data.weather[0].description;
                //
            });
        })
        .catch(err => {
            console.error(err);
        });
}

function getRndTemperature(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
//#endregion

// Get the header
var header = document.querySelector(".opcion-fixed");
var nextContent = document.querySelector('.main');

// Get the offset position of the navbar
var sticky = header.offsetTop;

// Add the sticky class to the header when you reach its scroll position. Remove "sticky" when you leave the scroll position
function myFunction() {
    if (window.pageYOffset > sticky) {
        fabSwitch.classList.remove("hide");
        header.classList.add("sticky");
        nextContent.style.marginTop = header.offsetHeight + 'px';
    } else {
        fabSwitch.classList.add("hide");
        header.classList.remove("sticky");
        nextContent.style.marginTop = 0;
    }

}

function toggle(element, event) {
    let key = element.nextElementSibling.innerText
    switch (key) {
        case "darkmode":
            alert('muy pronto');
            break;

        case "turn-sensor":
            switchSensor();
            break;

        case "notifications":
            //Cambia el estado de las notificaciones push
            if (localStorage.getItem('pushActive') != 'true') {
                new Notification("Gracias majo!");

                Push.create('Notificaciones Activadas', {
                    body: "Ha activado las notificaciones con exito",
                }).then(response => {

                    localStorage.setItem('pushActive', 'true');

                }).catch(error => {

                    alert('Debe activar las notificaciones para este sitio primero ' + error);
                    localStorage.setItem('pushActive', 'false');
                    element.checked = false;

                });

            } else {
                localStorage.setItem('pushActive', 'false');
            }

            break;

        default:
            break;
    }
}

function setting(element, event) {
    event.preventDefault();
    const sideMenu = document.getElementById('sidebar-nav');

    if (element.classList.contains('activo')) {
        element.classList.remove('activo');
        sideMenu.classList.remove('activo');
    } else {
        element.classList.add('activo');
        sideMenu.classList.add('activo');
    }
}

function sideClose(element, event) {
    event.preventDefault();

    const btnSetting = document.getElementById('btn-setting');
    element.parentElement.parentElement.classList.remove('activo');
    btnSetting.classList.remove('activo');
}

Init();