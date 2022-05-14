class ComplexCalculator extends RealCalculator {

    add(a, b) {
        return new Complex(a.re + b.re, a.im + b.im);
    }

    sub(a, b) {
        return new Complex(a.re - b.re, a.im - b.im);
    }
    
    mult(a, b) {
        return new Complex((a.re * b.re - a.im * b.im), (a.re * b.im + a.im * b.re));
    }

    div(a, b) {
        return new Complex(
            (a.re * b.re + a.im * b.im) / (b.re * b.re + b.im * b.im), 
            (b.re * a.im - a.re * b.im) / (b.re * b.re + b.im * b.im)
        );
    }

    prod(a, p) {
        return new Complex(p * a.re, p * a.im);
    }

    zero() { return new Complex(); }

    one() { return new Complex(super.one()); }

    pow (a, n) {
        let c = this.one();
        for(let i = 0; i < n; i++) {
            c = this.mult(a, c);
        }
        return c;
    } 
}