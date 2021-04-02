var myChart;
var txtDegree;
var Contador = 0;
var notyfDemo = new Notyf();
var chartDegree = document.getElementById('chartDegree').getContext('2d');

function Init() {
    console.log('Leyendo datos...');
    document.addEventListener('DOMContentLoaded', () => {
        txtDegree = document.querySelectorAll('.visual-number');

        showTemperatura();
        setInterval(leerTemperatura, 1000);

        fetch("http://api.openweathermap.org/data/2.5/weather?id=3617762&appid=63ea8a31096b0c9250a8505ff8f2c8a9&units=metric").then(response => {
                response.json().then(data => {
                    console.log(data);

                    let imgWeather = document.querySelector('#imgWeather');
                    let txtWeather = document.querySelector('#txtWeather');
                    txtWeather.innerText = data.main.temp;
                    imgWeather.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
                    //
                });
            })
            .catch(err => {
                console.error(err);
            });
    })
}

function showTemperatura() {
    myChart = new Chart(chartDegree, {
        type: 'line', // 
        data: {
            labels: [],
            datasets: [{
                data: [],
                label: 'Nivel de Temperatura',
                fill: true,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderWidth: 1,
                borderColor: "blue"
            }]
        },
        options: {
            responsive: true,
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}

function leerTemperatura() {
    let aux = getRndTemperature(20, 50);
    txtDegree[0].innerText = `${aux}`;
    txtDegree[1].innerText = `${aux}`;
    addData(myChart, Contador++, aux)

    if (Contador > 20) {
        removeData(myChart);
    }

    if (aux > 38) {
        if (!Swal.isVisible() && false) {
            Swal.fire({
                title: "¡Temperatura muy alta!",
                text: `Los ${aux}°C supera al rango maximo establecido`,
                icon: "warning",
                timer: 6000,
                timerProgressBar: true,
                footer: '<a href="#">¿Que hacer frente al Covid-19?</a>'
            });
        } else {
            //toastr.error(`Los ${aux}°C supera al rango maximo establecido!`, '¡Temperatura muy alta!');
            /* new Notify({
                 title: "¡Temperatura muy alta!",
                 text: `Los ${aux}°C supera al rango maximo establecido!`,
                 position: 'right bottom'
             });*/

            notyfDemo.dismissible = true;
            notyfDemo.error({
                message: `Los ${aux}°C supera al rango maximo establecido!`,
                duration: 5000,
            });
        }
    }


}

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

function getRndTemperature(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

Init();