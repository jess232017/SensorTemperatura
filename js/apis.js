document.addEventListener('DOMContentLoaded', function() {
    if ($("#covid-api").length) {
        fetch(' https://coronavirus-19-api.herokuapp.com/countries/nicaragua')
            .then(response => response.json())
            .then(datos => {
                let divCovid = $("#covid-api");
                divCovid.append(createCovidCard('Confirmados', datos['cases']));
                divCovid.append(createCovidCard('Muertes', datos['deaths']));
                divCovid.append(createCovidCard('Recuperados', datos['recovered']));
                divCovid.append(createCovidCard('Activos', datos['active']));

                $("#logCases").text(datos['cases']);
                $("#logDeaths").text(datos['deaths']);
                $("#logRecovered").text(datos['recovered']);
            });
    }
});

function createCovidCard(titulo, dato) {
    let card =
        `<div class="card">
            <div class="card-body text-center">
                <h6 class="title">${titulo}</h6>
                <div class="h3 count">
                    <div>${dato}</div>
                </div>
            </div>
        </div>`;

    return card;
}

/*
    active: 2429
    cases: 6835
    casesPerOneMillion: 1022
    country: "Nicaragua"
    critical: 0
    deaths: 181
    deathsPerOneMillion: 27
    recovered: 4225
    testsPerOneMillion: 0
    todayCases: 0
    todayDeaths: 0
    totalTests: 0
*/

/*
                                    
*/