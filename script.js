document.addEventListener("DOMContentLoaded", () => {
    
    const matrix = {
        mainMatrix: [
            ['11', '12', '13'],
            ['21', '22', '23'],
            ['31', '32', '33']
        ],
        augmentMatrix: [
            ['14'],
            ['24'],
            ['34']
        ]
    }
    
    
    const matrixWrapper = document.getElementById('matrix-wrapper');
    setMatrix(document, matrixWrapper, matrix, isAugmented=true);
    
    const loadingBars = document.getElementsByClassName('loading-bar');
    setInterval(() => tickBars(loadingBars), 10);
});

function setMatrix(document, matrixWrapper, {mainMatrix, augmentMatrix}) {
    // Get child elements from the matrix wrapper
    const matrixContainer = matrixWrapper.querySelector('#matrix-container');
    const matrixOpenParen = matrixWrapper.querySelector('#matrix-open-paren');
    const matrixCloseParen = matrixWrapper.querySelector('#matrix-close-paren');

    // Clear existing matrix content
    matrixContainer.innerHTML = '';

    // Create matrix based on the input 2D array
    for (let i = 0; i < mainMatrix.length; i++) {
        const row = document.createElement('div');
        row.classList.add('matrix-row');
        
        for (let j = 0; j < mainMatrix[i].length; j++) {
            const cell = document.createElement('div');
            cell.classList.add('matrix-cell');
            cell.innerText = mainMatrix[i][j];
            row.appendChild(cell);
        }

        // If an augmenting matrix is provided, add a separator and the augmenting values
        if (augmentMatrix.length > 0) {
            const separator = document.createElement('div');
            separator.classList.add('matrix-separator');
            separator.innerText = '|';
            row.appendChild(separator);

            for (let j = 0; j < augmentMatrix[i].length; j++) {
                const cell = document.createElement('div');
                cell.classList.add('matrix-cell');
                cell.innerText = augmentMatrix[i][j];
                row.appendChild(cell);
            }
        }
        
        matrixContainer.appendChild(row);
    }

    // Scale parentheses based on the matrix container's height
    const matrixHeight = matrixContainer.offsetHeight;
    matrixOpenParen.style.fontSize = `${matrixHeight}px`;
    matrixCloseParen.style.fontSize = `${matrixHeight}px`;
}

function resetBar(loadingBar) {
    loadingBar.classList.add('highlight');
    loadingBar.style.width = '100%';
    loadingBar.setAttribute('data-value', parseFloat(loadingBar.getAttribute('data-value')) - 5);
    setTimeout(() => {
        loadingBar.classList.remove('highlight');
    }, 500);  // Keep the highlight for 1 second
}

function tickBars(loadingBars) {
    for (let i = 0; i < loadingBars.length; i++) {
        fillBar(loadingBars[i]);
    }
}

function fillBar(loadingBar) {
    let timeWaited = parseFloat(loadingBar.getAttribute('data-value')) + 0.01;
    let period = parseFloat(loadingBar.getAttribute('data-period'));
    let percentage = timeWaited / period * 100;
    loadingBar.setAttribute('data-value', timeWaited.toString());
    if (percentage >= 100) {
        resetBar(loadingBar);
    } else {
        if(!loadingBar.classList.contains('highlight')){
            loadingBar.style.width = `${percentage}%`;
        }
    }
}
