// DOM ELEMENTS
const timeCounter = document.getElementById('time-counter');
let elapsedDays = 0;

//checkboxes
const planetNamesCheckbox = document.getElementById("planet-names");
const orbitsCheckbox = document.getElementById("orbits")
const backgroundCheckbox = document.getElementById("background")

//sliders (range)
const zoomSlider = document.getElementById("zoom-slider");
const speedSlider = document.getElementById("speed-slider");
const zoomLabel = document.getElementById('zoom-label');
const speedLabel = document.getElementById('speed-label');

let speedValue = speedSlider.value;
let zoomValue = zoomSlider.value;

//buttons
const restartButton = document.getElementById('restart-button');
const centerButton = document.getElementById('center-button');

//arrays
const planetNames = document.querySelectorAll(".planet-name");
const orbits = document.querySelectorAll(".orbit");
const planets = document.querySelectorAll(".planet");

const solarSystem = document.getElementById('solar-system')
const html = document.querySelector('html');

const orbitalPeriodsArray = [88, 225, 365, 687, 4333, 10759, 30687, 60190];

// every 10ms updates the elapsed time counter
setInterval(updateElapsedTime, 10);

// start planets rotation on page load
startPlanetsRotation();


// ! Restart function
restartButton.addEventListener('click', function () {
    daysPassed = 0;
    startPlanetsRotation();
})

// ! Center function
centerButton.addEventListener('click', function () {
    solarSystem.style.left = "50%";
    solarSystem.style.top = "50%";
})

// ! zoom function
zoomSlider.addEventListener('change', () => {
    let zoomValue = zoomSlider.value;
    zoomLabel.innerText = `Zoom: 1AU: ${zoomValue}px`;
    html.style.fontSize = zoomValue + 'px';
})

/**
 * counts seconds and update timer
 */

function updateElapsedTime() {

    const daysPerHundredthSecond = speedValue / 100;
    elapsedDays += daysPerHundredthSecond;

    const years = Math.floor(elapsedDays / 365);
    const days = Math.floor(elapsedDays % 365);

    timeCounter.innerText = `Elapsed time: ${years} years and ${days} days`
}


// ! rotation
/**
 * gets planets position everytime speed is changed; without it planets would reset position every time speed is updated
 * @param {Node} element the element (orbit, or planet name) of wich we want to know the position
 * @returns the current position of the element at the moment the function is called
 */
function getCurrentRotation(element) {

    let st = window.getComputedStyle(element, null);
    let tm = st.getPropertyValue("transform");

    let values = tm.split('(')[1].split(')')[0].split(',');

    let angle = Math.atan2(values[1], values[0]) * (180 / Math.PI);

    return angle;
}

/**
 * this function starts planets rotation, it is called when page is first loaded and on simulation reset
 */
function startPlanetsRotation() {

    for (let i = 0; i < orbits.length; i++) {

        updateSpeed(orbits[i], 0, orbitalPeriodsArray[i], planetNames[i], 0);
    }
}


/**
 * uptdates orbits speed, it also set planets position to where they were when speed was changed 
 * @param {Node} orbit the node element representing the orbit
 * @param {Number} orbitAngle the angle at which the planet currently is
 * @param {Number} orbitalPeriod the orbital period of the planet we want to cheange the speed
 * @param {Node} planetNames the node element representing the planet name
 * @param {Number} nameAngle the angle at which the planet currently is
 */
function updateSpeed(orbit, orbitAngle, orbitalPeriod, planetName, nameAngle) {

    const rotateOrbitFrom = `rotate(${orbitAngle}deg)`;
    const rotateOrbitTo = `rotate(${orbitAngle + 360}deg)`;
    const rotateNameFrom = `rotate(${nameAngle}deg)`;
    const rotateNameTo = `rotate(${nameAngle - 360}deg)`;

    const rotations = (orbitalPeriod / speedValue) * 1000;

    orbit.animate([
        { transform: rotateOrbitFrom },
        { transform: rotateOrbitTo }
    ],
        {
            duration: rotations,
            iterations: Infinity
        })

    planetName.animate([
        { transform: rotateNameFrom },
        { transform: rotateNameTo }
    ],
        {
            duration: rotations,
            iterations: Infinity
        })
}


// ! update planets rotation speed
// when speed slide speed is changed it saves planets position, and updates their speed
speedSlider.onchange = () => {

    speedValue = speedSlider.value;

    speedLabel.innerText = `Speed: 1sec = ${speedValue} Earth days`;

    for (let i = 0; i < orbits.length; i++) {

        angle = getCurrentRotation(orbits[i]);
        nameAngle = getCurrentRotation(planetNames[i]);

        updateSpeed(orbits[i], angle, orbitalPeriodsArray[i], planetNames[i], nameAngle);

    }
}


// ! hide or show planets and orbits
planetNamesCheckbox.addEventListener('change', () => {

    planetNames.forEach(planetName => {

        planetName.classList.toggle('hidden');
        planetName.classList.toggle('visible');
    });
})

orbitsCheckbox.addEventListener('change', () => {

    orbits.forEach(orbit => {

        orbit.classList.toggle('hidden');
        orbit.classList.toggle('visible');
    }
    )
})

backgroundCheckbox.addEventListener('change', () => {
    solarSystem.classList.toggle('galaxy-background');
})


// ! scroll functions
let event = new Event('change');

window.addEventListener('wheel', function (e) {

    if (e.deltaY < 0) {
        zoomSlider.stepUp()
    } else {
        zoomSlider.stepDown();
    }

    zoomSlider.dispatchEvent(event);
})

speedSlider.addEventListener("wheel", function (e) {
    if (e.deltaY < 0) {
        speedSlider.stepUp()
    } else {
        speedSlider.stepDown();
    }
    e.preventDefault();
    e.stopPropagation();

    speedSlider.dispatchEvent(event);
})

// ! Drag function
let isDown = false;
let offset = [0, 0];
let mousePosition;


solarSystem.addEventListener('mousedown', function (e) {
    isDown = true;
    offset = [
        solarSystem.offsetLeft - e.clientX,
        solarSystem.offsetTop - e.clientY
    ];

}, true)

solarSystem.addEventListener('mouseup', function () {
    isDown = false;
}, true);

solarSystem.addEventListener('mousemove', function (event) {
    event.preventDefault();
    if (isDown) {
        mousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        solarSystem.style.left = (mousePosition.x + offset[0]) + 'px';
        solarSystem.style.top = (mousePosition.y + offset[1]) + 'px';
    }
}, true);


// drag with touchscreen

solarSystem.addEventListener('touchstart', (e) => {
    isDown = true;
    offset = [
        solarSystem.offsetLeft - e.targetTouches[0].pageX,
        solarSystem.offsetTop - e.targetTouches[0].pageY
    ];

}, true)

document.addEventListener('touchend', () => {
    isDown = false;
}, true);

document.addEventListener('touchmove', (event) => {
    event.preventDefault();
    if (isDown) {
        mousePosition = {
            x: event.targetTouches[0].pageX,
            y: event.targetTouches[0].pageY
        };
        solarSystem.style.left = (mousePosition.x + offset[0]) + 'px';
        solarSystem.style.top = (mousePosition.y + offset[1]) + 'px';
    }
}, true);


// ! card funtion
const card = document.getElementById("card");
const cardOrbitsLabel = document.querySelector('.planet-orbits-completed');
let orbitsCompleted = 0;
let myInterval;

/**
 * continuously updates the number of completed orbits when a planet card is open
 * @param {Number} i index at wich the planet is located in the array
 */
function updateOrbitsCompleted(i) {

    const orbitsCompleted = (elapsedDays / orbitalPeriodsArray[i]).toFixed(2);

    cardOrbitsLabel.innerText = 'Orbits completed: ' + orbitsCompleted;
}

for (let i = 0; i < planets.length; i++) {

    planets[i].addEventListener('click', function () {

        // change cursor to wait
        document.body.style.cursor = "wait";

        let request = new XMLHttpRequest();
        request.open("GET", "https://planets-info-by-newbapi.p.rapidapi.com/api/v1/planets/" + (i + 1));
        request.setRequestHeader('X-RapidAPI-Key', '06d5a01626mshe26bac4ed36e7b8p10ccd1jsndc1eebff38c1');
        request.setRequestHeader('X-RapidAPI-Host', 'planets-info-by-newbapi.p.rapidapi.com');
        request.send();
        request.onload = () => {
            console.log(request);

            const planetData = JSON.parse(request.response);

            card.querySelector('.planet-name').innerText = planetData.name;
            card.querySelector('.planet-description').innerText = planetData.description;
            card.querySelector('.planet-period').innerText = 'Period: ' + orbitalPeriodsArray[i] + " days";
            card.querySelector('.planet-volume').innerText = 'Volume: ' + planetData.basicDetails.volume;
            card.querySelector('.planet-mass').innerText = 'Mass: ' + planetData.basicDetails.mass;
            card.querySelector('.planet-link').href = planetData.wikiLink;
            card.querySelector('.planet-link').innerText = planetData.wikiLink;
            card.querySelector('.planet-image').src = planetData.imgSrc.img;
            card.querySelector('.planet-image').alt = 'A picture of ' + planetData.name;

            // to update orbits completed when card is open
            clearInterval(myInterval);
            myInterval = setInterval(() => {
                updateOrbitsCompleted(i)
            }, 100);

            // show card
            card.classList.replace('hidden', 'visible');
            // change cursor to default
            document.body.style.cursor = "default";

        }
    }
    )
}



// ! close cards
const cardClose = document.getElementById('card-close');

cardClose.addEventListener('click', () => {
    card.classList.replace('visible', 'hidden');
    //reset card position
    card.style.left = 'calc(100% - 350px)';
    card.style.top = '50%';
})

// ! Drag cards
let isDownCard = false;
let offsetCard = [0, 0];
let mousePositionCard;

card.addEventListener('mousedown', (e) => {
    isDownCard = true;
    offsetCard = [
        card.offsetLeft - e.clientX,
        card.offsetTop - e.clientY
    ];

}, true)

document.addEventListener('mouseup', function () {
    isDownCard = false;
}, true);

document.addEventListener('mousemove', function (event) {
    event.preventDefault();
    if (isDownCard) {
        mousePositionCard = {
            x: event.clientX,
            y: event.clientY
        };
        card.style.left = (mousePositionCard.x + offsetCard[0]) + 'px';
        card.style.top = (mousePositionCard.y + offsetCard[1]) + 'px';
    }
}, true);

//move card with touchscreen

card.addEventListener('touchstart', function (e) {
    isDownCard = true;
    offsetCard = [
        card.offsetLeft - e.targetTouches[0].pageX,
        card.offsetTop - e.targetTouches[0].pageY
    ];

}, true)

document.addEventListener('touchend', function () {
    isDownCard = false;
}, true);

document.addEventListener('touchmove', function (event) {
    event.preventDefault();
    if (isDownCard) {
        mousePositionCard = {
            x: event.targetTouches[0].pageX,
            y: event.targetTouches[0].pageY
        };
        card.style.left = (mousePositionCard.x + offsetCard[0]) + 'px';
        card.style.top = (mousePositionCard.y + offsetCard[1]) + 'px';
    }
}, true);