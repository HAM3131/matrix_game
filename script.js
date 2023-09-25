import { RowOp, Rational } from "./mathUtilities.js";

document.addEventListener("DOMContentLoaded", () => {
    
    const one = new Rational(1);
    const zero = new Rational(0);
    const matrix = {
        mainMatrix: [
            [one, zero, zero],
            [zero, zero, one],
            [zero, one, zero]
        ],
        augmentMatrix: [
            [new Rational(10, 1)],
            [new Rational(3, 2)],
            [new Rational(-4, 1)]
        ]
    }   
    
    const matrixWrapper = document.getElementById('matrix-wrapper');
    setMatrix(document, matrixWrapper, matrix);
    
    const loadingBars = document.getElementsByClassName('loading-bar');
    setInterval(() => tickBars(loadingBars), 10);

    setTimeout(() => {
        setMatrix(document, matrixWrapper, matrix)
    }, 5000);
});

function setMatrix(document, matrixWrapper, {mainMatrix, augmentMatrix}) {
    // Get child elements from the matrix wrapper
    const oldMatrix = matrixWrapper.querySelector('.matrix-container');
    const newMatrix = document.createElement("div");
    let LaTeXString = matrixToLaTeX({mainMatrix, augmentMatrix});
    let next = RowOp.fromMatrix(mainMatrix);
    LaTeXString += next.toLaTeX();
    
    newMatrix.classList.add("matrix-container");
    newMatrix.innerHTML = "\\[" + LaTeXString + "\\]";
    MathJax.typeset([newMatrix]);

    replaceFade(oldMatrix, newMatrix);
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

function replaceFade(element, replacement) {
    // Apply initial styles to the element and its replacement
    element.style.opacity = "1";
    element.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    element.style.position = "absolute";

    replacement.style.opacity = "0";
    replacement.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    replacement.style.transform = "translateX(100px)";
    replacement.style.position = "absolute";
    replacement.style.display = "";

    
    // Append replacement to the same parent as the element
    element.parentNode.appendChild(replacement);

  
    // Perform the animation
    setTimeout(() => {
      element.style.opacity = "0";
      element.style.transform = "translateX(-100px)";
      replacement.style.opacity = "1";
      replacement.style.transform = "translateX(0)";
    }, 0);
  
    // Remove the original element after the animation is complete
    setTimeout(() => {
      element.parentNode.removeChild(element);
    }, 500);
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
    let latexString = "\\left[\\begin{array}{" + columnFormat.join("") + "}";

    // Loop through each row of the main matrix
    for (let i = 0; i < mainMatrix.length; i++) {
    let row = [];
    mainMatrix[i].forEach(element => {
        row.push(element.toLaTeX());
    });
    latexString += row.join(" & ");

    // If an augmented matrix exists, add the augmenting elements
    if (augmentMatrix.length > 0) {
        let augmentRow = [];
        augmentMatrix[i].forEach(element => {
            augmentRow.push(element.toLaTeX());
        });
        latexString += " & " + augmentRow.join(" & ");
    }

    // Add new row indicator
    latexString += "\\\\";
    }

    // Close the LaTeX string
    latexString += "\\end{array}\\right]";

    return latexString;
}