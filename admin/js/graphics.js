//#region Graficos
var temperatureChart;
var humidityChart;

if ($("#main-chart").length) {
    var chartDegree = document.querySelector("#main-chart").getContext('2d');
    temperatureChart = new Chart(chartDegree, {
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

if ($("#humidity-chart").length) {
    var charthumidity = document.querySelector("#humidity-chart").getContext('2d');
    humidityChart = new Chart(charthumidity, {
        type: 'line', // 
        data: {
            labels: [],
            datasets: [{
                data: [],
                label: 'Humedad',
                fill: true,
                backgroundColor: "rgba(54, 162, 235, 0.2)",
                borderWidth: 1,
                borderColor: "blue"
            }]
        },
    });
}

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

if ($("#gauge-humidity").length) {
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
    let target2 = document.querySelector('#gauge-humidity'); // your canvas element
    gaugeHumidity = new Gauge(target2).setOptions(opts); // create sexy gauge!
    gaugeHumidity.maxValue = 100; // set max gauge value
    gaugeHumidity.setMinValue(-50); // Prefer setter over gauge.minValue = 0
    gaugeHumidity.animationSpeed = 32; // set animation speed (32 is default value)
    gaugeHumidity.set(30); // set actual value
}

var Contador = 0;

function addData(chart, label, data) {
    if (typeof(chart) != 'undefined' && chart != null) {
        chart.data.labels.push(label);
        chart.data.datasets.forEach((dataset) => {
            dataset.data.push(data);
        });
        chart.update();
    }
}

function removeData(chart) {
    if (typeof(chart) != 'undefined' && chart != null) {
        chart.data.labels.shift();
        chart.data.datasets.forEach((dataset) => {
            dataset.data.shift();
        });
        chart.update();
    }
}



//#endregion