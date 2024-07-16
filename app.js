const baseURL = "https://swapi.dev/api/";

const categories = ["people", "planets", "films", "species", "vehicles", "starships"];
let currentPage = 0;
const itemsPerPage = 6; // Number of grids per page

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

function getDataSetForCategory(results, category) {
    switch (category) {
        case 'people':
            return {
                labels: results.map(person => person.name),
                datasets: [{
                    label: 'Height',
                    data: results.map(person => person.height),
                    backgroundColor: results.map(() => generateRandomColor())
                }]
            };
        case 'planets':
            return {
                labels: results.map(planet => planet.name),
                datasets: [{
                    label: 'Population',
                    data: results.map(planet => planet.population),
                    backgroundColor: results.map(() => generateRandomColor())
                }]
            };
        case 'films':
            return {
                labels: results.map(film => film.title),
                datasets: [{
                    label: 'Episode',
                    data: results.map(film => film.episode_id),
                    backgroundColor: results.map(() => generateRandomColor())
                }]
            };
        case 'species':
            return {
                labels: results.map(species => species.name),
                datasets: [{
                    label: 'Average Lifespan',
                    data: results.map(species => species.average_lifespan),
                    backgroundColor: results.map(() => generateRandomColor())
                }]
            };
        case 'vehicles':
            return {
                labels: results.map(vehicle => vehicle.name),
                datasets: [{
                    label: 'Cost in Credits',
                    data: results.map(vehicle => vehicle.cost_in_credits),
                    backgroundColor: results.map(() => generateRandomColor())
                }]
            };
        case 'starships':
            return {
                labels: results.map(starship => starship.name),
                datasets: [{
                    label: 'Crew Size',
                    data: results.map(starship => starship.crew),
                    backgroundColor: results.map(() => generateRandomColor())
                }]
            };
        default:
            return {};
    }
}

async function init() {
    const promises = categories.map(category => fetchData(category));
    const results = await Promise.all(promises);
    const data = categories.map((category, index) => getDataSetForCategory(results[index], category));
    setupPagination(data);
}

function setupPagination(data) {
    const totalPages = Math.ceil(data.length / itemsPerPage);

    function renderPage(page) {
        const gridContainer = document.getElementById('gridContainer');
        gridContainer.innerHTML = '';

        const start = page * itemsPerPage;
        const end = start + itemsPerPage;
        const itemsToShow = data.slice(start, end);

        itemsToShow.forEach((dataSet, index) => {
            const canvas = document.createElement('canvas');
            canvas.id = `chart${start + index}`;
            canvas.classList.add('grid-item');
            gridContainer.appendChild(canvas);
            createChart(canvas.getContext('2d'), 'bar', dataSet, { responsive: true });
        });

        document.getElementById('prevPage').disabled = page === 0;
        document.getElementById('nextPage').disabled = page === totalPages - 1;
    }

    renderPage(currentPage);

    window.nextPage = () => {
        if (currentPage < totalPages - 1) {
            currentPage++;
            renderPage(currentPage);
        }
    };

    window.prevPage = () => {
        if (currentPage > 0) {
            currentPage--;
            renderPage(currentPage);
        }
    };
}

init();
