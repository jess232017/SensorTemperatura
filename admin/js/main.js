var myChart;
var chartDegree = document.querySelector('#main-chart').getContext('2d');
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
showTemperatura();

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




$('#example').DataTable({
    responsive: true
});