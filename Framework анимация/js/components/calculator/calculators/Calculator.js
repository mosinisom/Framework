class Calculator extends RealCalculator {
        // проверка на тип
    toValue(str) {
        if (str.includes('*x^')) { return this.toPolynomial(str); }
        if (str.includes('\n')) { return this.toMatrix(str); }
        if (str.includes('(')) { return this.toVector(str); }
        if (str.includes('i')) { return this.toComplex(str); }
        return str - 0;
    }

        // переводы в типы
    toPolynomial(str) {
        if (str instanceof Array) {
            return new Polynomial(str)
        }
        if (typeof str == 'string' && str) {
            const members = [];
            const arrStr = str.replace(/\s+/g, '').replace(/-/g, ' -').split(/[+ ]/g);
            for (let i = 0; i < arrStr.length; i++) {
                members.push(this.toMember(arrStr[i]));
            }
            return new Polynomial(members);
        }
    }

    toMember(str) {
        if (typeof str == 'number') {
            return new Member(str);
        }
        if (typeof str == 'string' && str) {
            const arrStr = str.split('*x^');
            return new Member(this.toValue(arrStr[0]), arrStr[1] - 0);
        }
    }

    toComplex(str) {
        if (typeof str == 'number') {
            return new Complex(str);
        }
        if (str && typeof str == 'string') {
            const arrStr = str.split('i*');
            if (arrStr.length == 2) {
                if (arrStr[0].includes('+')) {
                    const arrRe = arrStr[0].split('+');
                    return new Complex(arrRe[0] - 0, arrStr[1] - 0);
                }
                if (arrStr[0].includes('-')) {
                    const arrRe = arrStr[0].split('-');
                    return new Complex(arrRe[0] - 0, -arrStr[1] - 0);
                }
                return null;
            }
            if (arrStr.length == 1) {
                if (isNaN(arrStr - 0)) { return null }
                return new Complex(arrStr[0] - 0)
            }
        }
        return null;
    }

    toVector(str) {
        if (str instanceof Array) {
            return new Vector(str);
        }
        if (str && typeof str == 'string') {
            const arr = str.replace('(', '').replace(')', '').split(' ').map(el => this.toValue(el));
            return new Vector(arr);
        }
        return null
    }

    toMatrix(str) {
        if (str instanceof Array) {
            return new Matrix(str);
        }
        if (str && typeof str === 'string') {
            const arr = str.split('\n');
            const values = [];
            for (let i = 0; i < arr.length; i++) {
                values.push(arr[i].split(', ').map(el => this.toValue(el)));
            }
            if (values[0] instanceof Array) {
                return new Matrix(values);
            }
        }
        return null;
    }


    member(value, power) {
        return new Member(value, power)
    }

    polynomial(members) {
        return new Polynomial(members);
    }

    complex(re, im) {
        return new Complex(re, im);
    }

    vector(values) {
        return new Vector(values);
    }

    matrix(values) {
        return new Matrix(values);
    }

    add(a, b) {
        return this.get(a).add(a, b);
    }

    sub(a, b) {
        return this.get(a).sub(a, b);
    }

    mult(a, b) {
        return this.get(a).mult(a, b);
    }

    div(a, b) {
        return this.get(a).div(a, b)
    }

    zero(type, elem) {
        type = type ? type : elem ? elem.constructor.name : null;
        switch (type) {
            case 'Complex': return (new ComplexCalculator).zero();
            case 'Vector': return (new VectorCalculator).zero(elem.values.length, elem.values[0]);
            case 'Matrix': return (new MatrixCalculator).zero(elem.values.length, elem.values[0][0]);
        }
        return super.zero();
    }

    one(type, elem) {
        type = type ? type : elem ? elem.constructor.name : null;
        switch (type) {
            case 'Complex': return (new ComplexCalculator).one();
            case 'Vector': return (new VectorCalculator).one(elem.values.length, elem.values[0]);
            case 'Matrix': return (new MatrixCalculator).one(elem.values.length, elem.values[0][0]);
        }
        return super.one();
    }

    prod(a, p) {
        if (typeof p == 'number') {
            return this.get(a).prod(a, p);
        }
        return null;
    }

    pow(a, n) {
        if (typeof n == 'number') {
            return this.get(a).pow(a, n);
        }
    }
}