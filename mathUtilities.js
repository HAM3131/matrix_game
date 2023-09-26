export class RowOp {
  constructor(operation, row1, row2 = null, scalar = null) {
    this.operation = operation; // "scale", "swap", "replace"
    this.row1 = row1;
    this.row2 = row2;
    this.scalar = scalar; // Should be a Rational object
  }

  static fromMatrix(matrix) {
    const rows = matrix.length;
    const cols = matrix[0].length;

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let entry = matrix[i][j];
        if (entry.numerator !== 0) {
        if (!(entry.numerator === 1 && entry.denominator === 1)) {
            return new RowOp("scale", i, null, new Rational(1, entry.numerator));
        }

        for (let k = i + 1; k < rows; k++) {
            const belowEntry = matrix[k][j];
            if (belowEntry.numerator !== 0) {
            return new RowOp("replace", i, k, belowEntry);
            }
        }
        break;
        }
      }
    }

    for (let i = 0; i < cols; i++) {
      if(matrix[i][i].numerator !== 1){
        for (let j = i + 1; j < rows; j++){
          if(matrix[j][i].numerator === 1){
              return new RowOp("swap", i, j);
          }
        }
      }
    }
    
    return new RowOp("none", null);
  }

  toString() {
    if (this.operation === "scale") {
      return `Scale row ${this.row1 + 1} by ${this.scalar}`;
    } else if (this.operation === "swap") {
      return `Swap row ${this.row1 + 1} and row ${this.row2 + 1}`;
    } else if (this.operation === "replace") {
      return `Replace row ${this.row2 + 1} with row ${this.row2 + 1} - (${this.scalar} * row ${this.row1 + 1})`;
    } else {
      return "Unknown operation";
    }
  }

  toLaTeX() {
    if (this.operation === "scale") {
      return `\\xrightarrow{R_{${this.row1 + 1}} \\leftarrow ${this.scalar.toLaTeX()} R_{${this.row1 + 1}}}`;
    } else if (this.operation === "swap") {
      return `\\xrightarrow{R_{${this.row1 + 1}} \\leftrightarrow R_{${this.row2 + 1}}}`;
    } else if (this.operation === "replace") {
      if (this.scalar.toFloat() < 0){
        let temp = new Rational(-this.scalar.numerator, this.scalar.denominator);
        return `\\xrightarrow{R_{${this.row1 + 1}} \\leftarrow R_{${this.row1 + 1}} + ${temp.toLaTeX()} R_{${this.row2 + 1}}}`;
      } else {
        return `\\xrightarrow{R_{${this.row1 + 1}} \\leftarrow R_{${this.row1 + 1}} - ${this.scalar.toLaTeX()} R_{${this.row2 + 1}}}`;
      }
    } else if (this.operation === "none") {
      return "";
    } else {
      return "\\text{Unknown operation}";
    }
  }

  static random(rows) {
    let operation = Math.floor(Math.random() * 3);
    let row1 = Math.floor(Math.random() * rows);
    let row2 = null;
    do {
      row2 = Math.floor(Math.random() * rows);
    } while (row1 === row2)

    switch (operation){
      case 0:
        return new RowOp("scale", row1, null, Rational.randomFraction(1, 3));
      case 1:
        return new RowOp("replace", row1, row2, Rational.randomInt(1, 50));
      case 2:
        return new RowOp("swap", row1, row2);
    }
  }

  static randomReplace(rows) {
    let row1 = Math.floor(Math.random() * rows);
    let row2 = null;
    do {
      row2 = Math.floor(Math.random() * rows);
    } while (row1 === row2)
    return new RowOp("replace", row1, row2, Rational.randomInt(1, 4));
  }
}

export class Rational {
    constructor(numerator, denominator = 1) {
      if (!Number.isInteger(numerator) || !Number.isInteger(denominator)) {
        throw new Error("Non integer input.")
      }
  
      if (denominator === 0) {
        throw new Error("Denominator cannot be zero.");
      }
  
      const commonGCD = this.gcd(numerator, denominator);
      this.numerator = numerator / commonGCD;
      this.denominator = denominator / commonGCD;

      if (this.denominator < 0) {
        this.denominator = -this.denominator;
        this.numerator = -this.numerator;
      }
    }

    static random(min=-999999999, max=999999999) {
      const denominator = Math.floor(Math.random() * (max + 1));
      const numerator = (Math.floor(Math.random() * (max - min + 1)) + min) * denominator + Math.floor(Math.random() * (max - min + 1)) + min;
      return new Rational(numerator, denominator);
    }

    static randomInt(min=-999999999, max=999999999){
      const numerator = Math.floor(Math.random() * (max - min + 1)) + min;
      return new Rational(numerator);
    }

    static randomFraction(min=-100, max=100, denominator=null){
      if(!denominator){
        denominator = Math.floor(Math.random() * (max + 1));
        if(denominator === 0 || denominator === 1){
          denominator = 2;
        }
      }
      const numerator = (Math.floor(Math.random() * (max - min + 1)) + min) * denominator + Math.floor(Math.random() * (max - min + 1)) + min;
      return new Rational(numerator, denominator)
    }
  
    gcd(a, b) {
      return b === 0 ? a : this.gcd(b, a % b);
    }

    multiply(num) {
      const numerator = this.numerator * num.numerator;
      const denominator = this.denominator * num.denominator;
      return new Rational(numerator, denominator);
    }

    add(num) {
      const commonDenominator = this.denominator * num.denominator;
      const newNumerator = (this.numerator * num.denominator) + (num.numerator * this.denominator);
      return new Rational(newNumerator, commonDenominator);
    }

    subtract(num){
      num = new Rational(-num.numerator, num.denominator);
      return this.add(num);
    }
  
    toString() {
      return this.denominator !== 1 ? `${this.numerator}/${this.denominator}` : `${this.numerator}`;
    }

    toLaTeX() {
        return this.denominator !== 1 ? `\\frac{${this.numerator}}{${this.denominator}}` : `${this.numerator}`;
    }
  
    toFloat() {
      return this.numerator / this.denominator;
    }
}

export class Matrix {
  constructor(matrix, augment = []) {
    this.matrix = [];
    this.augment = [];
    let rows = matrix.length
    let cols = matrix[0].length
    for (let i = 0; i < rows; i++){
      this.matrix.push([]);
      for (let j = 0; j < cols; j++){
        let element = matrix[i][j];
        if (element instanceof Rational){
          this.matrix[i].push(element);
        } else if (!isNaN(element)) {
          this.matrix[i].push(new Rational(element));
        } else {
          throw new Error(`Invalid element passed at row: ${i}, column: ${j}`);
        }
      }
    }
    if (augment.length > 0){
      if (augment.length !== rows){
        throw new Error("Augment has more/fewer rows than matrix")
      }
      for (let i = 0; i < rows; i++){
        this.augment.push([]);
        for (let j = 0; j < augment[0].length; j++){
          let element = augment[i][j];
          if (element instanceof Rational){
            this.augment[i].push(element);
          } else if (!isNaN(element)) {
            this.augment[i].push(new Rational(element));
          } else {
            throw new Error(`Invalid element passed at row: ${i}, column: ${j}`);
          }
        }
      }
    }
  }

  static random(rows, cols=null, numberSet="smallIntegers") {
    let matrix = [];

    if (!cols){
      cols = rows;
    }

    for (let i = 0; i < rows; i++){
      let row = [];
      for (let j = 0; j < cols; j++){
        let element = null;
        switch (numberSet){
          case "smallIntegers":
            element = Rational.randomInt(0, 10);
            break;
          case "smallFractions":
            element = Rational.randomFraction();
            break;
          case "integers":
            element = Rational.randomInt();
            break;
          case "fractions":
            element = Rational.random();
            break;
          default:
            throw new Error("Tried to generate a random matrix with an invalid number set.")
        }
        row.push(element);
      }
      matrix.push(row);
    }
    return new Matrix(matrix, []);
  }

  static randomWithUniqueSolution(size, operations=10, numberSet="smallIntegers") {
    let matrix = Matrix.identity(size)
    matrix.augmentWith(Matrix.random(size, 1, numberSet));
    let rowOpsSet = new Set();
    while(rowOpsSet.size < operations){
      let rowOp = RowOp.random(size);
      if (!rowOpsSet.has(rowOp.toLaTeX())){
        rowOpsSet.add(rowOp.toLaTeX());
        matrix.performRowOp(rowOp);
      }
    }
    return matrix;
  }

  static identity(size){
    let matrix = [];
    for (let i = 0; i < size; i++){
      matrix.push([]);
      for (let j = 0; j < size; j++){
        let element = new Rational(0);
        if(i === j){
          element.numerator = 1;
        }
        matrix[i].push(element);
      }
    }
    return new Matrix(matrix)
  }

  toLaTeX(){
    let columnFormat = [];
    for (let j = 0; j < this.matrix[0].length; j++) {
      columnFormat.push("c");
    }

    // Add vertical line for augmented matrix if it exists
    if (this.augment.length > 0) {
      columnFormat.push("|");
      for (let j = 0; j < this.augment[0].length; j++) {
          columnFormat.push("c");
      }
    }

    // Initialize an empty LaTeX string
    let latexString = "\\left[\\begin{array}{" + columnFormat.join("") + "}";

    // Loop through each row of the main matrix
    for (let i = 0; i < this.matrix.length; i++) {
      let row = [];
      this.matrix[i].forEach(element => {
          row.push(element.toLaTeX());
      });
      latexString += row.join(" & ");

      // If an augmented matrix exists, add the augmenting elements
      if (this.augment.length > 0) {
          let augmentRow = [];
          this.augment[i].forEach(element => {
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

  nextRowOp() {
    const rows = this.matrix.length;
    const cols = this.matrix[0].length;
    
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        let entry = this.matrix[i][j];
        if (entry.numerator !== 0) {
          if (!(entry.numerator === 1 && entry.denominator === 1)) {
            return new RowOp("scale", i, null, new Rational(entry.denominator, entry.numerator));
          }
          for (let k = i + 1; k < rows; k++) {
            const belowEntry = this.matrix[k][j];
            if (belowEntry.numerator !== 0) {
              return new RowOp("replace", k, i, belowEntry);
            }
          }
          for (let k = 0; k < i; k++) {
            const aboveEntry = this.matrix[k][j];
            if (aboveEntry.numerator !== 0) {
              return new RowOp("replace", k, i, aboveEntry);
            }
          }
          break;
        }
      }
    }

    for (let i = 0; i < cols; i++) {
      if(this.matrix[i][i].numerator !== 1){
        for (let j = i + 1; j < rows; j++){
          if(this.matrix[j][i].numerator === 1){
            return new RowOp("swap", i, j);
          }
        }
      }
    }
    
    return new RowOp("none", null);
  }

  augmentWith(augment){
    if (this.matrix.length !== augment.matrix.length){
      throw new Error(`Tried to augment ${this.matrix.length} row matrix with a ${augment.matrix.length} row matrix`);
    }
    else {
      this.augment = augment.matrix;
    }
  }

  performRowOp(rowOp) {
    const { operation, row1, row2, scalar } = rowOp;
    const numRows = this.matrix.length;
    if (row1 >= numRows || (row2 !== null && row2 >= numRows)) {
      throw new Error("Row index out of bounds");
    }

    switch (operation) {
      case "scale":
        if (!scalar) throw new Error("Scalar value required for scaling");
        for (let j = 0; j < this.matrix[row1].length; j++) {
          this.matrix[row1][j] = this.matrix[row1][j].multiply(scalar);
        }
        if (this.augment.length > 0){
          for (let j = 0; j < this.augment[row1].length; j++) {
            this.augment[row1][j] = this.augment[row1][j].multiply(scalar);
          }
        }
        break;
      case "swap":
        [this.matrix[row1], this.matrix[row2]] = [this.matrix[row2], this.matrix[row1]];
        if (this.augment.length > 0){
          [this.augment[row1], this.augment[row2]] = [this.augment[row2], this.augment[row1]];
        }
        break;
      case "replace":
        if (!scalar) throw new Error("Scalar value required for replacement");
        for (let j = 0; j < this.matrix[row1].length; j++) {
          this.matrix[row1][j] = this.matrix[row1][j].subtract(this.matrix[row2][j].multiply(scalar));
        }
        if (this.augment.length > 0){
          for (let j = 0; j < this.augment[row1].length; j++) {
            this.augment[row1][j] = this.augment[row1][j].subtract(this.augment[row2][j].multiply(scalar));
          }
        }
        break;
      default:
        throw new Error("Invalid row operation");
    }
  }
}