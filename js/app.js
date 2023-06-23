// DOM ELEMENTS
const timeCounter = document.getElementById('time-counter');

//checkboxes
const planetNamesCheckbox = document.getElementById("planet-names");
const orbitsCheckbox = document.getElementById("orbits")
const backgroundCheckbox = document.getElementById("background")

//sliders (range)
const zoomSlider = document.getElementById("zoom-slider");
const speedSlider = document.getElementById("speed-slider");
const zoomLabel = document.getElementById('zoom-label');
const speedLabel = document.getElementById('speed-label');

//buttons
const restartButton = document.getElementById('restart-button');
const centerButton = document.getElementById('center-button');

const solarSystem = document.getElementById('solar-system')
const html = document.querySelector('html');

// crating planets objects
const planetNamesNodes = document.querySelectorAll(".planet-name");
const orbitsNodes = document.querySelectorAll(".orbit");
const planetsNodes = document.querySelectorAll(".planet");
const orbitalPeriodsArray = [88, 225, 365, 687, 4333, 10759, 30687, 60190];

const planets = [];

for (let i = 0; i < 8; i++) {
    planets.push({
        id: i + 1,
        name: planetNamesNodes[i],
        orbit: orbitsNodes[i],
        planet: planetsNodes[i],
        orbitalPeriod: orbitalPeriodsArray[i]
    });
}
console.table(planets);

let elapsedDays = 0;
let speedValue = speedSlider.value;
let zoomValue = zoomSlider.value;


// Restart function
restartButton.addEventListener('click', () => {
    elapsedDays = 0;
    startPlanetsRotation();
});

// Center function
centerButton.addEventListener('click', () => {
    solarSystem.style.left = "50%";
    solarSystem.style.top = "50%";
});

// Zoom function
zoomSlider.addEventListener('change', () => {
    let zoomValue = zoomSlider.value;
    zoomLabel.innerText = `Zoom: 1AU: ${zoomValue}px`;
    html.style.fontSize = zoomValue + 'px';
});

// Update planets rotation speed
speedSlider.addEventListener('change', () => {
    speedValue = speedSlider.value;
    speedLabel.innerText = `Speed: 1sec = ${speedValue} Earth days`;
    updatePlanetsRotation();
});

// Hide or show planets
planetNamesCheckbox.addEventListener('change', () => {
    planets.forEach(({ name }) => {
        name.classList.toggle('hidden');
    });
});

// Hide or show orbits
orbitsCheckbox.addEventListener('change', () => {
    planets.forEach(({ orbit }) => {
        orbit.classList.toggle('hidden');
    });
})

// Toggle galaxy background
backgroundCheckbox.addEventListener('change', () => {
    solarSystem.classList.toggle('galaxy-background');
})


// ! scroll functions
const wheelEvent = new Event('change');

window.addEventListener('wheel', e => {

    if (e.deltaY < 0) {
        zoomSlider.stepUp()
    } else {
        zoomSlider.stepDown();
    }

    zoomSlider.dispatchEvent(wheelEvent);
})

speedSlider.addEventListener("wheel", function (e) {
    if (e.deltaY < 0) {
        speedSlider.stepUp()
    } else {
        speedSlider.stepDown();
    }
    e.preventDefault();
    e.stopPropagation();

    speedSlider.dispatchEvent(wheelEvent);
})

// ! STARTS THE PROGRAM

// every 10ms updates the elapsed time counter
setInterval(updateElapsedTime, 10);

// start planets rotation on page load
startPlanetsRotation();