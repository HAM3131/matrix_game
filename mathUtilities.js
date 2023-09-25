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
          return `\\xrightarrow{R_{${this.row2 + 1}} \\leftarrow R_{${this.row2 + 1}} - ${this.scalar.toLaTeX()} R_{${this.row1 + 1}}}`;
        } else if (this.operation === "none") {
          return "\\text{Matrix is in row-echelon form}";
        } else {
          return "\\text{Unknown operation}";
        }
    }
}

class Rational {
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
    }
  
    gcd(a, b) {
      return b === 0 ? a : this.gcd(b, a % b);
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