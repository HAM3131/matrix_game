import { RowOp, Rational, Matrix } from "./mathUtilities.js";

let loadingBars = {
    'RowOpBarOne': {DOM: '', value: 0, period: 5000, func: actionOne}
};

let matrices = {
    'MatrixOne': {DOM: null, matrix: Matrix.random(3, 3), reward: 1}
};

// matrices['MatrixOne'].matrix = new Matrix(
//     [
//         [1, 1, 0],
//         [0, 0, new Rational(1, 5)],
//         [0, 1, 0]
//     ],
//     [
//         [10],
//         [new Rational(3, 2)],
//         [-4]
//     ]
// )

document.addEventListener("DOMContentLoaded", () => {
    const getMatrices = document.getElementsByClassName('matrix-wrapper');
    [...getMatrices].forEach(matrix => {
        let name = matrix.getAttribute("data");
        matrices[name].DOM = matrix;
        setMatrix(matrices[name].DOM, matrices[name].matrix);
    });
    
    const getLoadingBars = document.getElementsByClassName('loading-bar');
    [...getLoadingBars].forEach(bar => {
        let name = bar.getAttribute("data");
        loadingBars[name].DOM = bar;
    });

    setInterval(() => {
        gameTick(10)
    }, 10);
});

function gameTick(timePassed) {
    tickBars(timePassed);
}

function setMatrix(matrixWrapper, matrix) {
    // Get child elements from the matrix wrapper
    const oldMatrix = matrixWrapper.querySelector('.matrix-container');
    const newMatrix = document.createElement("div");
    let LaTeXString = matrix.toLaTeX();
    let next = matrix.nextRowOp();
    LaTeXString += next.toLaTeX();
    
    newMatrix.classList.add("matrix-container");
    newMatrix.innerHTML = "\\[" + LaTeXString + "\\]";
    MathJax.typeset([newMatrix]);

    replaceFade(oldMatrix, newMatrix);
}

function tickBars(timePassed) {
    Object.keys(loadingBars).forEach(key => {
        tickBar(key, timePassed);
    });
}

function tickBar(loadingBar, timePassed) {
    let value = loadingBars[loadingBar].value + timePassed;
    let period = loadingBars[loadingBar].period;
    let percentage = value / period * 100;
    loadingBars[loadingBar].value = value;
    if (percentage >= 100) {
        loadingBars[loadingBar].DOM.style.width = `0%`;
        loadingBars[loadingBar].value = loadingBars[loadingBar].value % 5;
        loadingBars[loadingBar].func();
    } else {
        loadingBars[loadingBar].DOM.style.width = `${percentage}%`;
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

function actionOne() {
    let rowOp = matrices["MatrixOne"].matrix.nextRowOp();
    if (rowOp.operation === "none"){
        // Handle the case where there isn't another row op to get to RREF
    } else {
        matrices["MatrixOne"].matrix.performRowOp(rowOp);
        setMatrix(matrices["MatrixOne"].DOM, matrices["MatrixOne"].matrix);
    }
}