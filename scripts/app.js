//checkboxes
const planetNamesCheckbox = document.getElementById("planet-names");
const orbitCheckbox = document.getElementById("orbits")
const backgroundCheckbox = document.getElementById("background")

//sliders (range)
const zoomSlider = document.getElementById("zoom-slider");
const speedSlider = document.getElementById("speed-slider");

//buttons
const restartButton = document.getElementById('restart-button')
const centerButton = document.getElementById('center-button')

//arrays
const planetName = document.querySelectorAll(".planet-name");
const orbits = document.querySelectorAll(".orbit");
const planets = document.querySelectorAll(".planet");

const solarSystem = document.getElementById('solar-system')

let zoomValue = zoomSlider.value;        
document.getElementById('zoom-value').innerText = zoomValue + "px";                        

// ! Restart function
restartButton.addEventListener('click', function(){
    daysPassed = 0;
    startPlanetsRotation();
})

// ! Center function
centerButton.addEventListener('click', function(){
    solarSystem.style.left = "50%";
    solarSystem.style.top = "50%";
})

// ! zoom function
zoomSlider.onchange = function() {
    let zoomValue = zoomSlider.value;
    document.getElementById('zoom-value').innerText = zoomValue + "px";
    let zoomPixels = zoomValue + "px";
    document.querySelector("html").style.fontSize = zoomPixels;                    
}


// ! speed function
let speedValue = speedSlider.value;
document.getElementById('speed-value').innerText = speedValue + " Earth days"

const orbitalPeriodsArray = [ 88, 225, 365, 687, 4333, 10759, 30687, 60190];


// ! rotation
// gets planets position everytime speed is changed; without it planets would reset position everytime speed is update
function getCurrentRotation(element){

    var st = window.getComputedStyle(element, null);
    var tm = st.getPropertyValue("transform");

    var values = tm.split('(')[1].split(')')[0].split(',');

    var angle = Math.atan2(values[1],values[0]) * (180/Math.PI);
    return angle;
}

// this function starts planets rotation, it is called when page is first loaded
function startPlanetsRotation(){
    
    for (var i = 0; i < orbits.length; i++){

        rotations = (orbitalPeriodsArray[i] / speedValue * 1000);

        orbits[i].animate([
            {transform: 'rotate(0)'},
            {transform: 'rotate(360deg)'}
        ],
        {
            duration: rotations,
            iterations: Infinity
        })

        planetName[i].animate([
            {transform: 'rotate(0)'},
            {transform: 'rotate(-360deg)'}
        ],
        {
            duration: rotations,
            iterations: Infinity
        })

    }
}

//this function starts timer
setInterval(incrementSeconds, 10);
startPlanetsRotation();

//this functions update orbits speed, it also set planets position to where they were when speed was changed
function updateSpeed(orbit, angle, orbitalPeriod, planetName, nameAngle){
    rotateFrom = 'rotate(' + (angle) + 'deg)';
    rotateTo = 'rotate(' + (angle + 360) + 'deg)';
    planetFrom = 'rotate(' + (nameAngle) + 'deg)';
    planetTo = 'rotate(' + (nameAngle - 360) + 'deg)';
    
    rotations = (orbitalPeriod / speedValue) * 1000;
    
    orbit.animate([
        {transform: rotateFrom},
        {transform: rotateTo}
    ],
    {
        duration: rotations,
        iterations: Infinity
    })
    
    planetName.animate([
        {transform: planetFrom},
        {transform: planetTo}
    ],
    {
        duration: rotations,
        iterations: Infinity
    })
}

// counts seconds and update timer
let daysPassed = 0;
const days = document.getElementById('days');        

function incrementSeconds() {

    daysPerHundredSecond = speedValue / 100;
    daysPassed += daysPerHundredSecond;
    daysPassed;    

    let years = daysPassed / 365; 

    days.innerText = "Time elapsed: " + Math.floor(years) + " years and " + Math.floor(daysPassed % 365) + " days"
    
}

// ! update planets rotation speed
// when speed slide speed is changed it saves planets position, and updates their speed
speedSlider.onchange = function () {

    speedValue = speedSlider.value;

    document.getElementById('speed-value').innerText = speedValue + " Earth days";

    for (var i = 0; i < orbits.length; i++){
        angle = getCurrentRotation(orbits[i]);
        nameAngle = getCurrentRotation(planetName[i]);
        updateSpeed(orbits[i], angle, orbitalPeriodsArray[i], planetName[i], nameAngle);
    }            
}


// ! hide or show planets and orbits
addEventListener("change", (event) => {
    if (planetNamesCheckbox.checked){
        for (var i = 0; i < planetName.length; i++){
            planetName[i].classList.replace('hidden', 'visible');
        }
    } else {               
        for (var i = 0; i < planetName.length; i++){
            planetName[i].classList.replace('visible', 'hidden');
        }
    }

    // hide or show orbits
    if (orbitCheckbox.checked){
        for (var i = 0; i < orbits.length; i++){
            orbits[i].classList.replace('hidden', 'visible');
        }
    } else {               
        for (var i = 0; i < orbits.length; i++){
            orbits[i].classList.replace('visible', 'hidden');
        }
    }
    if (backgroundCheckbox.checked){
        solarSystem.classList.replace('no-background', 'galaxy-background')
    } else{
        solarSystem.classList.replace('galaxy-background', 'no-background')                
    }

})


// ! scroll functions
var event = new Event('change');

window.addEventListener('wheel', function(e) {
    if (e.deltaY < 0){
        zoomSlider.stepUp()
    }else{
        zoomSlider.stepDown();
    }
    e.stopPropagation();
    
    zoomSlider.dispatchEvent(event);
})

speedSlider.addEventListener("wheel", function(e){
    if (e.deltaY < 0){
        speedSlider.stepUp()
    }else{
        speedSlider.stepDown();
    }
    e.preventDefault();
    e.stopPropagation();
    
    speedSlider.dispatchEvent(event);
})


// ! Drag function
var isDown = false;
var offset = [0,0];
var mousePosition;

document.body.appendChild(solarSystem);

solarSystem.addEventListener('mousedown', function(e) {
    isDown = true;
    offset = [
        solarSystem.offsetLeft - e.clientX,
        solarSystem.offsetTop - e.clientY
    ];
    
}, true)

document.addEventListener('mouseup', function(){
    isDown = false;
}, true);

document.addEventListener('mousemove', function(event){
    event.preventDefault();
    if (isDown){
        mousePosition = {
            x : event.clientX,
            y : event.clientY
        };
        solarSystem.style.left = (mousePosition.x + offset[0]) + 'px';
        solarSystem.style.top = (mousePosition.y + offset[1]) + 'px';
    }
}, true);

// ! card funtion
const card = document.getElementById("card");
let orbitsCompleted;
let myInterval;

function updateOrbitsCompleted(card, i){
    orbitsCompleted = (daysPassed / orbitalPeriodsArray[i]).toFixed(2);   
    card.querySelector('.planet-orbits-completed').innerText = 'Orbits completed: ' + orbitsCompleted;
}

for (let i = 0; i < planets.length; i++){
    planets[i].addEventListener('click', function(){
        
        let request = new XMLHttpRequest();
        request.open("GET", "https://planets-info-by-newbapi.p.rapidapi.com/api/v1/planets/" + (i + 1));
        request.setRequestHeader('X-RapidAPI-Key', '06d5a01626mshe26bac4ed36e7b8p10ccd1jsndc1eebff38c1');
        request.setRequestHeader('X-RapidAPI-Host', 'planets-info-by-newbapi.p.rapidapi.com');
        request.send();
        request.onload = () => {
            console.log(request);
            
            const data = JSON.parse(request.response);
            
            card.querySelector('.planet-name').innerText = data.name;
            card.querySelector('.planet-description').innerText = data.description;
            card.querySelector('.planet-period').innerText ='Period: ' + orbitalPeriodsArray[i] + " days";
            card.querySelector('.planet-volume').innerText = 'Volume: ' + data.basicDetails.volume;
            card.querySelector('.planet-mass').innerText = 'Mass: ' + data.basicDetails.mass;
            card.querySelector('.planet-link').href = data.wikiLink;
            card.querySelector('.planet-link').innerText = data.wikiLink;
            card.querySelector('.planet-image').src = data.imgSrc.img;
            card.querySelector('.planet-image').alt = 'A picture of ' + data.name;

            clearInterval(myInterval);
            myInterval = setInterval(function(){
                updateOrbitsCompleted(card, i)
            }, 100);
            
            card.classList.replace('hidden', 'visible');
        }
    }   
)}


// card.addEventListener('click', function (){
    // })
    
    const cardClose = document.getElementById('card-close');
    console.log(cardClose);
    
    cardClose.addEventListener('click', function(){
        card.classList.replace('visible', 'hidden');
    })