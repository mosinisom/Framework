class CalculatorComponent extends Component {
    constructor(options) {
        super(options);

        this.calculator = new Calculator();
    }


    _addEventListeners() {
        const buttons = document.querySelectorAll('.operands');
        buttons.forEach(button => {
            button.addEventListener('click', () => this.calculate(button.dataset.operand));
        });
    }

    calculate(operand) {
        const textA = document.getElementById('areaA');
        const textB = document.getElementById('areaB');
        const textC = document.getElementById('areaC');

        let a = this.calculator.toValue(textA.value);
        let b = this.calculator.toValue(textB.value);
        console.log(a, b);
        if (a && b) {
            let c;
            if (operand == 'zero' || operand == 'one') {
                c = this.calculator[operand](null, a);
            } else {
                c = this.calculator[operand](a, b);
            }
            textC.value = c.toString();
        }
    }
}