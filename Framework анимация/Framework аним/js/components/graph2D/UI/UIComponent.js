class UIComponent extends Component {
    constructor(options) {
        super(options);
        this.num = 0;
    }

    _addEventListeners() {
        document.getElementById('addFunction').addEventListener('click', () => this.addFunction());
    }


    addFunction() {
        let button = document.createElement('button');
        button.setAttribute('id', 'delete')
        button.setAttribute('class', 'del')
        button.innerHTML = 'Удалить';
        button.addEventListener('click', () => {
            this.callbacks.delFunction(input.dataset.num);
            div.removeChild(input);
            div.removeChild(button);
            div.removeChild(width);
            div.removeChild(color);
            div.removeChild(startLine);
            div.removeChild(endLine);
            div.removeChild(checkbox);

            div.removeChild(dotX);
            div.removeChild(dotY);

        });

        let startLine = document.createElement('input');
        startLine.setAttribute('placeholder', 'a=');
        startLine.setAttribute('class', 'params');
        startLine.setAttribute('id', 'startLine' + this.num)
        startLine.dataset.num = this.num;
        startLine.addEventListener('keyup', () => this.getValue(startLine))

        let endLine = document.createElement('input');
        endLine.setAttribute('placeholder', 'b=');
        endLine.setAttribute('class', 'params');
        endLine.setAttribute('id', 'endLine'+ this.num)
        endLine.dataset.num = this.num;
        endLine.addEventListener('keyup', () => this.getValue(endLine))

        let width = document.createElement('input');
        width.setAttribute('placeholder', 'ширина');
        width.setAttribute('id', 'width' + this.num);
        width.setAttribute('class', 'params');
        width.dataset.num = this.num;
        width.addEventListener('keyup', () => this.getValue(width));

        let color = document.createElement('input');
        color.setAttribute('placeholder', 'цвет');
        color.setAttribute('id', 'color' + this.num);
        color.setAttribute('class', 'params');
        color.dataset.num = this.num;
        color.addEventListener('keyup', () => this.getValue(color));


        let dotX = document.createElement('input');
        dotX.setAttribute('placeholder', 'dotX');
        dotX.setAttribute('id', 'dotX' + this.num);
        dotX.setAttribute('class', 'params');
        dotX.dataset.num = this.num;
        dotX.addEventListener('keyup', () => this.getValue(dotX));

        let dotY = document.createElement('input');
        dotY.setAttribute('placeholder', 'dotY');
        dotY.setAttribute('id', 'dotY' + this.num);
        dotY.setAttribute('class', 'params');
        dotY.dataset.num = this.num;
        dotY.addEventListener('keyup', () => this.getValue(dotY));


        let input = document.createElement('input');
        input.setAttribute('placeholder', `функция`);
        input.setAttribute('id', 'inp' + this.num);
        input.setAttribute('class', 'params');
        input.dataset.num = this.num;
        input.addEventListener('keyup', () => this.keyup(input));
        
        let checkbox = document.createElement('input');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.setAttribute('id', 'checkbox' + this.num);
        checkbox.setAttribute('class', 'round');
        checkbox.dataset.num = this.num;
        checkbox.addEventListener('click', () => {
            if(checkbox.hasAttribute('cheked')) {
                checkbox.removeAttribute('cheked');
            }else checkbox.setAttribute('cheked', '');
            this.getValue(checkbox);
        });
        

        let div = document.createElement('div');

        let funcsInputs = document.getElementById('funcsInputs');
        funcsInputs.appendChild(div);
        div.appendChild(input);
        div.appendChild(width);
        div.appendChild(color);
        div.appendChild(startLine);
        div.appendChild(endLine);

        div.appendChild(dotX);
        div.appendChild(dotY);

        div.appendChild(button);
        div.appendChild(checkbox);

        this.num++;
    };

    keyup (elem) {
        try{
            let f;
            eval(`f = function (x) {return ${elem.value}}`);
            let width = document.getElementById(`width${elem.dataset.num}`);
            let color = document.getElementById(`color${elem.dataset.num}`);

            let startLine = document.getElementById(`startLine${elem.dataset.num}`);
            let endLine = document.getElementById(`endLine${elem.dataset.num}`);

            let check = document.getElementById(`checkbox${elem.dataset.num}`);
            const flag = !!check.hasAttribute('cheked');

            let dotX = document.getElementById(`dotX${elem.dataset.num}`);
            let dotY = document.getElementById(`dotY${elem.dataset.num}`);
            
            this.callbacks.addFunction(f, elem.dataset.num, width.value, color.value, startLine.value, endLine.value, flag, dotX.value, dotY.value);
        } catch (e) {
            console.log(e);
        }
    }

    getValue (elem) {
        let f;

        let flag
        let check = document.getElementById(`checkbox${elem.dataset.num}`);
        if(check.hasAttribute('cheked')) {
            flag = true
        }else flag = false

        let graph = document.getElementById(`inp${elem.dataset.num}`);
        let width = document.getElementById(`width${elem.dataset.num}`);
        let color = document.getElementById(`color${elem.dataset.num}`);

        let startLine = document.getElementById(`startLine${elem.dataset.num}`);
        let endLine = document.getElementById(`endLine${elem.dataset.num}`);

        let dotX = document.getElementById(`dotX${elem.dataset.num}`);
        let dotY = document.getElementById(`dotY${elem.dataset.num}`);

        eval(`f = function (x) {return ${graph.value};}`);
        this.callbacks.addFunction(f, elem.dataset.num, width.value-0, color.value, startLine.value-0, endLine.value-0, flag, dotX.value-0, dotY.value-0);
    }
}
