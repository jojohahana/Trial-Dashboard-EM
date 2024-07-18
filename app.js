const baseURL = "https://swapi.dev/api/";

const categories = ["people", "planets", "films", "species", "vehicles", "starships"];

async function fetchData(category) {
    let allData = [];
    let url = `${baseURL}${category}/`;
    while (url) {
        const response = await fetch(url);
        const data = await response.json();
        allData = allData.concat(data.results);
        url = data.next;  // Move to the next page, if available
    }
    return allData;
}

function createChart(ctx, type, data, options) {
    new Chart(ctx, {
        type: type,
        data: data,
        options: options
    });
}

function generateRandomColor() {
    return `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.7)`;
}

async function init() {
    const promises = categories.map(category => fetchData(category));
    const results = await Promise.all(promises);

    // Example data processing for each category
    const peopleData = {
        labels: results[0].map(person => person.name),
        datasets: [{
            label: 'Height',
            data: results[0].map(person => person.height),
            backgroundColor: results[0].map(() => generateRandomColor())
        }]
    };

    const planetsData = {
        labels: results[1].map(planet => planet.name),
        datasets: [{
            label: 'Population',
            data: results[1].map(planet => planet.population),
            backgroundColor: results[1].map(() => generateRandomColor())
        }]
    };

    const filmsData = {
        labels: results[2].map(film => film.title),
        datasets: [{
            label: 'Episode',
            data: results[2].map(film => film.episode_id),
            backgroundColor: results[2].map(() => generateRandomColor())
        }]
    };

    const speciesData = {
        labels: results[3].map(species => species.name),
        datasets: [{
            label: 'Average Lifespan',
            data: results[3].map(species => species.average_lifespan),
            backgroundColor: results[3].map(() => generateRandomColor())
        }]
    };

    const vehiclesData = {
        labels: results[4].map(vehicle => vehicle.name),
        datasets: [{
            label: 'Cost in Credits',
            data: results[4].map(vehicle => vehicle.cost_in_credits),
            backgroundColor: results[4].map(() => generateRandomColor())
        }]
    };

    const starshipsData = {
        labels: results[5].map(starship => starship.name),
        datasets: [{
            label: 'Crew Size',
            data: results[5].map(starship => starship.crew),
            backgroundColor: results[5].map(() => generateRandomColor())
        }]
    };

    createChart(document.getElementById('peopleChart').getContext('2d'), 'bar', peopleData, { responsive: true });
    createChart(document.getElementById('planetsChart').getContext('2d'), 'bar', planetsData, { responsive: true });
    createChart(document.getElementById('filmsChart').getContext('2d'), 'line', filmsData, { responsive: true });
    createChart(document.getElementById('speciesChart').getContext('2d'), 'bar', speciesData, { responsive: true });
    createChart(document.getElementById('vehiclesChart').getContext('2d'), 'bar', vehiclesData, { responsive: true });
    createChart(document.getElementById('starshipsChart').getContext('2d'), 'bar', starshipsData, { responsive: true });
}

init();
