Template.prototype.calculatorTemplate = () => `
    <div>
        <div class="getValueInputs">
            <textarea placeholder="0" class="number" id="areaA"></textarea>
            <textarea placeholder="0" class="number" id="areaB"></textarea>
        </div>

        <div class="results">
            <textarea  class="resultNumber" id="areaC" disabled></textarea>
        </div>
    </div>
    <div>
        <button class="operands btn operand" data-operand="add"> Add </button>
        <button class="operands btn operand" data-operand="sub"> Sub </button>
        <button class="operands btn operand" data-operand="mult"> Mult </button>
    </div>
    <div>
        <button class="operands btn operand" data-operand="divide"> Div </button>
        <button class="operands btn operand" data-operand="prod"> Prod </button>
        <button class="operands btn operand" data-operand="zero"> Zero </button>
        </div>
    <div>
        <button class="operands btn operand" data-operand="one"> One </button>
        <button class="operands btn operand" data-operand="pow"> Pow </button>
    </div>
`;