import { RowOp, Rational, Matrix } from "./mathUtilities.js";

let loadingBars = {
    'RowOpBar': {bar: '', value: 0, period: 5000}
};

document.addEventListener("DOMContentLoaded", () => {
    let matrix = new Matrix(
        [
            [1, 1, 0],
            [0, 0, new Rational(1, 5)],
            [0, 1, 0]
        ],
        [
            [10],
            [new Rational(3, 2)],
            [-4]
        ]
    )   
    
    const matrixWrapper = document.getElementById('matrix-wrapper');
    setMatrix(document, matrixWrapper, matrix);
    
    const getLoadingBars = document.getElementsByClassName('loading-bar');
    [...getLoadingBars].forEach(bar => {
        let name = bar.getAttribute("data");
        loadingBars[name].bar = bar;
    });

    setInterval(() => {
        gameTick(10)
    }, 10);

    function rowOpsToCompletion(){
        let rowOp = matrix.nextRowOp();
        console.log(rowOp);
        matrix.performRowOp(rowOp);
        setTimeout(() => {
            setMatrix(document, matrixWrapper, matrix)
            if (matrix.nextRowOp().operation !== "none"){
                rowOpsToCompletion();
            }
        }, 5000);
    }

    rowOpsToCompletion();
});

function gameTick(timePassed) {
    tickBars(timePassed);
}

function setMatrix(document, matrixWrapper, matrix) {
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
        loadingBars[loadingBar].bar.style.width = `0%`;
        loadingBars[loadingBar].value = loadingBars[loadingBar].value % 5;
    } else {
        loadingBars[loadingBar].bar.style.width = `${percentage}%`;
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