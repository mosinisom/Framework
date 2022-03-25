class Polynomial {
    constructor(poly = []) {
        this.poly = poly;
        this.poly.sort((a, b) => b.power - a.power);
    }

    getValue(a) {
        const calc = new Calculator;
        return this.poly.reduce((s, elem) =>
            calc.add(
                s,
                calc.prod(calc.pow(a, elem.power), elem.value)
            ),
            calc.zero(null, a)
        );
    }

    toStr(k) {
        return this.poly.map(
            (el, i) => el.value > 0 ? `${i == 0 ? '' : '+'}${el[k]()}` : el[k]()).join('');
    }

    toString() {
        return this.toStr('toString');
    }

}