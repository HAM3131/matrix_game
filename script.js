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

    let LaTeXString = matrixToLaTeX({mainMatrix, augmentMatrix});

    matrixContainer.innerHTML = LaTeXString;
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

function matrixToLaTeX({mainMatrix, augmentMatrix}) {
    let columnFormat = [];
    for (let j = 0; j < mainMatrix[0].length; j++) {
    columnFormat.push("c");
    }

    // Add vertical line for augmented matrix if it exists
    if (augmentMatrix.length > 0) {
    columnFormat.push("|");
    for (let j = 0; j < augmentMatrix[0].length; j++) {
        columnFormat.push("c");
    }
    }

    // Initialize an empty LaTeX string
    let latexString = "\\[\\left[\\begin{array}{" + columnFormat.join("") + "}";

    // Loop through each row of the main matrix
    for (let i = 0; i < mainMatrix.length; i++) {
    let row = mainMatrix[i];
    latexString += row.join(" & ");

    // If an augmented matrix exists, add the augmenting elements
    if (augmentMatrix.length > 0) {
        let augmentRow = augmentMatrix[i];
        latexString += " & " + augmentRow.join(" & ");
    }

    // Add new row indicator
    latexString += "\\\\";
    }

    // Close the LaTeX string
    latexString += "\\end{array}\\right]\\]";

    return latexString;
}