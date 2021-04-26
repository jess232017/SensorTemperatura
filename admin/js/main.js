var myChart;

var data = [
    [
        "Tiger Nixon",
        "System Architect",
        "Edinburgh",
        "5421",
        "2011/04/25",
        "$3,120"
    ],
    [
        "Garrett Winters",
        "Director",
        "Edinburgh",
        "8422",
        "2011/07/25",
        "$5,300"
    ]
]

function showTemperatura() {
    if ($("#main-chart").length) {
        var chartDegree = document.querySelector("#main-chart").getContext('2d');
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
        });
    }
}

function setGaugeTemperature() {
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

}

showTemperatura();
setGaugeTemperature();