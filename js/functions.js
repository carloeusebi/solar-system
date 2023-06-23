/**
 * counts seconds and update timer
 */
const updateElapsedTime = () => {

    const daysPerHundredthSecond = speedValue / 100;
    elapsedDays += daysPerHundredthSecond;

    const years = Math.floor(elapsedDays / 365);
    const days = Math.floor(elapsedDays % 365);

    timeCounter.innerText = `Elapsed time: ${years} years and ${days} days`
}


// ! rotation
/**
 * gets planets position every time speed is changed; without it planets would reset position every time speed is updated
 * @param {Node} element the element (orbit, or planet name) of which we want to know the position
 * @returns the current position of the element at the moment the function is called
 */
const getCurrentRotationAngle = element => {

    // gets every css property of the element
    const st = window.getComputedStyle(element, null);

    // of all the css property gets only the transform property
    const tm = st.getPropertyValue("transform");

    // example of string tm:
    // matrix(0.339215, -0.940709, 0.940709, 0.339215, 0, 0)

    // we split multiple times in order to transform the above string in values
    const values = tm.split('(')[1].split(')')[0].split(',');

    // Math.atan2 returns the angle (in radians) between the positive x-axis and the point (values[0], values[1]) in the Cartesian coordinate system. By multiplying the result by (180 / Math.PI), it converts the angle from radians to degrees.
    const angle = Math.atan2(values[1], values[0]) * (180 / Math.PI);

    // angle is a value we can use in the transform: rotate({angle}deg) css property
    return angle;
}

/**
 * Starts planets rotation, it is called when page is first loaded and on simulation reset
 */
const startPlanetsRotation = () => {
    planets.forEach(planet => {
        updateSpeed(planet);
    });
}

/**
 * Updates planets rotation speed, it is called every time planets speed changes
 */
const updatePlanetsRotation = () => {
    planets.forEach(planet => {
        const planetAngle = getCurrentRotationAngle(planet.orbit);
        const nameAngle = getCurrentRotationAngle(planet.name);

        updateSpeed(planet, planetAngle, nameAngle);
    });
}


/**
 * Updates orbits speed, it also set planets position to where they were when speed was changed 
 * @param {object} planet 
 * @param {number} orbitAngle 
 * @param {number} nameAngle 
 */
const updateSpeed = (planet, orbitAngle = 0, nameAngle = 0) => {

    const { orbit, orbitalPeriod, name } = planet;

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

    name.animate([
        { transform: rotateNameFrom },
        { transform: rotateNameTo }
    ],
        {
            duration: rotations,
            iterations: Infinity
        })
}