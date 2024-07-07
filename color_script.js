const originalColors = [
    "#FF0000", "#FF7F00", "#FFFF00", "#7FFF00",
    "#00FF00", "#00FF7F", "#00FFFF", "#007FFF",
    "#0000FF", "#7F00FF", "#FF00FF", "#FF007F"
];

let colors = [...originalColors];
let selectedColors = [];
const grid = document.getElementById('grid');
const paletteBoxes = [
    document.getElementById('palette-box-1'),
    document.getElementById('palette-box-2'),
    document.getElementById('palette-box-3'),
    document.getElementById('palette-box-4'),
    document.getElementById('palette-box-5')
];

function createGrid() {
    grid.innerHTML = '';
    colors.forEach((color, index) => {
        const colorBox = document.createElement('div');
        colorBox.className = 'color-box';
        colorBox.style.backgroundColor = color;
        colorBox.dataset.color = color;
        colorBox.addEventListener('click', () => selectColor(colorBox, index));
        grid.appendChild(colorBox);
    });
}

function selectColor(box, index) {
    if (selectedColors.length < 2 && !box.classList.contains('selected')) {
        box.classList.add('selected');
        selectedColors.push(box.dataset.color);
    } else if (box.classList.contains('selected')) {
        box.classList.remove('selected');
        selectedColors = selectedColors.filter(color => color !== box.dataset.color);
    }
}

function generateColors() {
    if (selectedColors.length === 2) {
        const [color1, color2] = selectedColors;
        const gradientColors = generateGradient(color1, color2, 12);
        colors.splice(0, 12, ...gradientColors);
        selectedColors = [];
        createGrid();
    } else {
        alert('Please select exactly 2 colors.');
    }
}

function randomizeColors() {
    colors = generateRandomColors(12);
    selectedColors = [];
    createGrid();
}

function addToPalette() {
    if (selectedColors.length > 0) {
        let addedCount = 0; // Track how many colors have been added
        selectedColors.forEach(color => {
            const emptyPaletteBox = paletteBoxes.find(box => box.style.backgroundColor === 'white');
            if (emptyPaletteBox) {
                emptyPaletteBox.style.backgroundColor = color;
                addedCount++;
            }
        });

        // If no empty boxes were found and not all selected colors were added, show alert
        if (addedCount !== selectedColors.length) {
            alert('Palette is full. Clear some boxes or reset the palette.');
        }
    } else {
        alert('Please select at least one color to add to the palette.');
    }

    updateColors(); // Update colors after adding to palette
}

function resetPalette() {
    paletteBoxes.forEach(box => {
        box.style.backgroundColor = 'white'; // Reset palette box colors to white
    });
}

function resetGrid() {
    colors = [...originalColors];
    selectedColors = [];
    createGrid();
}

function generateGradient(color1, color2, steps) {
    const start = hexToRgb(color1);
    const end = hexToRgb(color2);
    const gradient = [];

    for (let i = 0; i < steps; i++) {
        const r = interpolate(start.r, end.r, i / (steps - 1));
        const g = interpolate(start.g, end.g, i / (steps - 1));
        const b = interpolate(start.b, end.b, i / (steps - 1));
        gradient.push(rgbToHex(r, g, b));
    }

    return gradient;
}

function interpolate(start, end, factor) {
    return Math.round(start + (end - start) * factor);
}

function hexToRgb(hex) {
    const bigint = parseInt(hex.slice(1), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    return { r, g, b };
}

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
}

function generateRandomColors(count) {
    const randomColors = [];
    for (let i = 0; i < count; i++) {
        const randomColor = '#' + Math.floor(Math.random() * 16777215).toString(16);
        randomColors.push(randomColor);
    }
    return randomColors;
}

function updateColors() {
    const paletteBoxes = document.querySelectorAll('.palette-box');

    // Check if enough palette boxes are available
    if (paletteBoxes.length >= 5) {
        const headerColor = paletteBoxes[0].style.backgroundColor || '#336699';
        const headerTextColor = paletteBoxes[1].style.backgroundColor || '#ffffff';
        const menuColor = paletteBoxes[2].style.backgroundColor || '#999999';
        const bodyBgColor = paletteBoxes[3].style.backgroundColor || '#ffffff';
        const bodyTextColor = paletteBoxes[4].style.backgroundColor || '#000000';

        // Update header styles
        const header = document.querySelector('.header');
        header.style.backgroundColor = headerColor;
        header.style.color = headerTextColor;

        // Update menu styles
        const menu = document.querySelector('.menu');
        menu.style.backgroundColor = menuColor;

        // Update body styles
        const body = document.querySelector('.body');
        body.style.backgroundColor = bodyBgColor;
        body.style.color = bodyTextColor;
    } else {
        console.error('Not enough palette boxes defined.');
    }
}

// Drag and drop functionality for palette boxes
let dragged;

document.querySelectorAll('.palette-box').forEach(box => {
    box.addEventListener('dragstart', dragStart);
    box.addEventListener('dragover', dragOver);
    box.addEventListener('drop', drop);
});

function dragStart(event) {
    dragged = event.target;
    event.dataTransfer.setData('text/plain', dragged.id);
}

function dragOver(event) {
    event.preventDefault();
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData('text/plain');
    const target = event.target;

    if (target.classList.contains('palette-box')) {
        const tempColor = target.style.backgroundColor;
        target.style.backgroundColor = dragged.style.backgroundColor;
        dragged.style.backgroundColor = tempColor;

        updateColors(); // Update colors after swapping
    }


    let draggedColor = null;
    let hoveredColor = null;
    
    document.querySelectorAll('.palette-box').forEach(box => {
        box.addEventListener('dragstart', dragStart);
        box.addEventListener('dragover', dragOver);
        box.addEventListener('dragenter', dragEnter);
        box.addEventListener('dragleave', dragLeave);
        box.addEventListener('drop', drop);
        box.addEventListener('dragend', dragEnd);
    });
    
    function dragStart(event) {
        draggedColor = event.target.style.backgroundColor;
        event.dataTransfer.setData('text/plain', draggedColor);
    }
    
    function dragOver(event) {
        event.preventDefault();
    }
    
    function dragEnter(event) {
        if (event.target.classList.contains('palette-box')) {
            hoveredColor = event.target.style.backgroundColor;
        }
    }
    
    function dragLeave(event) {
        if (event.target.classList.contains('palette-box')) {
            hoveredColor = null;
        }
    }
    
    function drop(event) {
        event.preventDefault();
        if (event.target.classList.contains('palette-box')) {
            const tempColor = event.target.style.backgroundColor;
            event.target.style.backgroundColor = draggedColor;
            document.querySelector(`[style*="background-color: ${draggedColor}"]`).style.backgroundColor = tempColor;
            updateColors(); // Update colors after swapping
        }
    }
    
    function dragEnd() {
        draggedColor = null;
        hoveredColor = null;
    }
    
}

createGrid();
