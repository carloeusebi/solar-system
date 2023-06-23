const url = 'https://planets-info-by-newbapi.p.rapidapi.com/api/v1/planets/';
const host = 'planets-info-by-newbapi.p.rapidapi.com';

const card = document.getElementById("card");

const cardOrbitsLabel = card.querySelector('.planet-orbits-completed');
const cardName = card.querySelector('.planet-name')
const cardDescription = card.querySelector('.planet-description')
const cardPeriod = card.querySelector('.planet-period')
const cardVolume = card.querySelector('.planet-volume')
const cardMass = card.querySelector('.planet-mass')
const cardLink = card.querySelector('.planet-link')
const cardImage = card.querySelector('.planet-image')
const cardClose = document.getElementById('card-close');

let orbitsCompleted = 0;
let myInterval;

/**
 * Calls the api
 * @param {object} planet 
 * @returns the api response
 */
const getPlanetData = async planet => {
    const options = {
        method: 'GET',
        url: url + planet.id,
        headers: {
            'X-RapidAPI-Key': API_KEY,
            'X-rapidApi-Host': host
        }
    };
    try {
        const response = await axios.request(options);
        return response.data;
    } catch (e) {
        console.error(e);
    }
};



const showCard = (planet, data) => {

    const updateOrbitsCompleted = planet => {
        clearInterval(myInterval);
        myInterval = setInterval(() => {
            const orbitsCompleted = (elapsedDays / planet.orbitalPeriod).toFixed(2);
            cardOrbitsLabel.innerText = 'Orbits completed: ' + orbitsCompleted;
        }, 100);
    }

    cardName.innerText = data.name;
    cardDescription.innerText = data.description;
    cardPeriod.innerText = `Period: ${planet.orbitalPeriod} days`;
    cardVolume.innerText = `Volume: ${data.basicDetails.volume}`;
    cardMass.innerText = `Mass: ${data.basicDetails.mass}`;
    cardLink.innerHTML = `<a href="${data.wikiLink}" target="_blank">${data.wikiLink}</a>`
    cardImage.innerHTML = `<img src="${data.imgSrc.img}" alt="${data.imgSrc.imgDescription}" title="${data.imgSrc.imgDescription}">`

    updateOrbitsCompleted(planet);

    card.classList.remove('hidden');
};

planets.forEach(planet => {
    planet.planet.addEventListener('click', async () => {
        document.body.style.cursor = 'wait';
        const planetData = await getPlanetData(planet);

        showCard(planet, planetData);
        document.body.style.cursor = 'default';
    });
});

// ! close cards

cardClose.addEventListener('click', () => {
    card.classList.add('hidden');
    //reset card position
    card.style.left = 'calc(100% - 350px)';
    card.style.top = '50%';
})