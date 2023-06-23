// ! Drag cards
let isDown = false;
let offset = [0, 0];
let position;


// FUNCTIONS 

const dragElement = element => {
    element.style.left = (position.x + offset[0]) + 'px';
    element.style.top = (position.y + offset[1]) + 'px';
}

function handleMove(e) {
    e.preventDefault();

    if (isDown) {
        const x = e.clientX ? e.clientX : e.touches[0].clientX;
        const y = e.clientY ? e.clientY : e.touches[0].clientY;
        position = {
            x,
            y
        };
        dragElement(this);
    }
}

function handleStart(e) {
    const x = e.clientX ? e.clientX : e.touches[0].clientX;
    const y = e.clientY ? e.clientY : e.touches[0].clientY;

    isDown = true;
    offset = [
        this.offsetLeft - x,
        this.offsetTop - y
    ]
}

const handleEnd = () => {
    isDown = false;
}

// DOCUMENT EVENT LISTENERS


document.addEventListener('mouseup', handleEnd);
document.addEventListener('touchend', handleEnd);

// SOLAR SYSTEM
solarSystem.addEventListener('touchstart', handleStart);
solarSystem.addEventListener('mousedown', handleStart);

solarSystem.addEventListener('touchmove', handleMove);
solarSystem.addEventListener('mousemove', handleMove);

// CARD
card.addEventListener('touchstart', handleStart);
card.addEventListener('mousedown', handleStart);

card.addEventListener('touchmove', handleMove);
card.addEventListener('mousemove', handleMove);
