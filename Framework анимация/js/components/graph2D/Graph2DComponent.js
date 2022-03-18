class Graph2DComponent extends Component {
  constructor(options) {
    super(options);
    this.WIN = {
      LEFT: -10,
      BOTTOM: -10,
      WIDTH: 20,
      HEIGHT: 20
    };

    this.canvas = new Canvas({
      WIN: this.WIN,
      id: 'canvas',
      width: 600,
      height: 600,
      callbacks: {
        wheel: (event) => this.wheel(event),
        mouseMove: (event) => this.mouseMove(event),
        mouseUp: () => this.mouseUp(),
        mouseDown: () => this.mouseDown(),
        mouseLeave: () => this.mouseLeave()
      }
    });

    this.ui = new UIComponent({
      id: 'ui',
      parent: this.id,
      template: template.uiTemplate,
      callbacks: {
        delFunction: (num) => this.delFunction(num),
        addFunction: (f, num, width, color, sLine, eLine, flag, dotX, dotY) => this.addFunction(f, num, width, color, sLine, eLine, flag, dotX, dotY)
      },
    });

    this.funcs = [];
    this.canMove = false;
    this.derivativeX = 0;
    this.render();
  }

  addFunction(f, num, width = 2, color = 'red', sLine, eLine, printDer, dotX, dotY) {
    this.funcs[num] = { f, color, width, sLine, eLine, printDer, dotX, dotY };
    this.render();
  }

  delFunction(num) {
    this.funcs[num] = null;
    this.render();
  }

  setDerivative(setDer, num) {
    if (this.funcs[num]) {
      this.funcs[num].setDer = setDer;
      this.render();
    }
  }

  // sLine(value, num) {
  //   if (this.funcs[num]) {
  //     this.funcs[num].sLine = value;
  //     this.render();
  //   }
  // }
  // eLine(value, num) {
  //   if (this.funcs[num]) {
  //     this.funcs[num].eLine = value;
  //     this.render();
  //   }
  // }



  //движения мышкой
  mouseMove(event) {
    if (this.canMove) {
      this.WIN.LEFT -= this.canvas.sx(event.movementX);
      this.WIN.BOTTOM -= this.canvas.sy(event.movementY);
    }
    this.derivativeX = this.WIN.LEFT +
      this.canvas.sx(event.offsetX);
    this.render();
  }
  mouseUp() {
    this.canMove = false;
  }
  mouseDown() {
    this.canMove = true;
  }
  mouseLeave() {
    this.canMove = false;
  }

  //зум
  wheel(event) {
    var delta = (event.wheelDelta > 0) ? -0.2 : 0.2;
    if (this.WIN.WIDTH + delta > 0) {
      this.WIN.WIDTH += delta,
        this.WIN.HEIGHT += delta,
        this.WIN.LEFT -= delta / 2,
        this.WIN.BOTTOM -= delta / 2
    }
    this.render();
  }

  printOXY() {
    const { LEFT, BOTTOM, HEIGHT, WIDTH } = this.WIN;
    //разметка 
    for (var i = 0; i < LEFT + WIDTH; i += 1) {
      this.canvas.line(i, BOTTOM, i, BOTTOM + HEIGHT, '#ddd');
      this.canvas.line(i, -0.1, i, 0.1, 'black');
    }
    for (var i = 0; i > LEFT; i -= 1) {
      this.canvas.line(i, BOTTOM, i, BOTTOM + HEIGHT, '#ddd');
      this.canvas.line(i, -0.1, i, 0.1, 'black');
    }
    for (var i = 0; i < BOTTOM + HEIGHT; i += 1) {
      this.canvas.line(LEFT, i, LEFT + WIDTH, i, '#ddd');
      this.canvas.line(-0.1, i, 0.1, i, 'black');
    }
    for (var i = 0; i > BOTTOM; i -= 1) {
      this.canvas.line(LEFT, i, LEFT + WIDTH, i, '#ddd');
      this.canvas.line(-0.1, i, 0.1, i, 'black');
    }
    //стрелки
    this.canvas.line(LEFT + WIDTH, 0, LEFT + WIDTH - 0.7, 0.3, 'black', 1);
    this.canvas.line(LEFT + WIDTH, 0, LEFT + WIDTH - 0.7, -0.3, 'black', 1);
    this.canvas.line(0, BOTTOM + HEIGHT, 0.3, BOTTOM + HEIGHT - 0.7, 'black', 1);
    this.canvas.line(0, BOTTOM + HEIGHT, -0.3, BOTTOM + HEIGHT - 0.7, 'black', 1);
    // 0X
    this.canvas.line(LEFT, 0, LEFT + WIDTH, 0, 'black', 2);
    // 0Y
    this.canvas.line(0, BOTTOM, 0, BOTTOM + HEIGHT, 'black', 2);
  }

  printFunction(f, color, width) {
    let x = this.WIN.LEFT;
    const dx = this.WIN.WIDTH / 200;
    while (x < this.WIN.LEFT + this.WIN.WIDTH) {
      this.canvas.line(x, f(x), x + dx, f(x + dx), color, width);
      x += dx;
    }
  }

  getDerivative(f, x0, dx = 0.0001) {
    return (f(x0 + dx) - f(x0)) / dx;
  }
  printDerivative(f, x0, dx) {
    const k = this.getDerivative(f, x0, dx);
    let b = f(x0) - k * x0;
    let x1 = this.WIN.LEFT;
    let x2 = this.WIN.LEFT + this.WIN.WIDTH;
    let y = k * x1 + b;
    let y2 = k * x2 + b;
    this.canvas.line(x1, y, x2, y2, 'black', 1, (9, 5));
  }

  getIntegral(f, a, b, n = 500) {
    const dx = (b - a) / n;
    let x = a;
    let s = 0;
    while (x <= b) {
      s += (f(x) + f(x = dx)) / 2 * dx;
    }
    return s;
  }

  printIntegral(f, a, b, n = 500) {
    if (a !== b) {
      const dx = (b - a) / n;
      let x = a;
      const points = [];
      points.push({ x, y: 0 });
      while (x <= b) {
        points.push({ x, y: f(x) });
        x += dx;
      }
      points.push({ x: b, y: 0 });
      this.canvas.polygon(points);
    }
  }

  //текст
  printText() {
    this.canvas.text('0', 0.2, -0.6);
    this.canvas.text('1', 0.2, 0.8);
    this.canvas.text('-1', -0.7, -1.2);
    this.canvas.text('x', this.WIN.WIDTH + this.WIN.LEFT - 0.45, -0.6);
    this.canvas.text('y', 0.4, this.WIN.HEIGHT + this.WIN.BOTTOM - 0.5);
  }

  //нули функций
  getZero(f, a, b, eps) {
    if (f(a) * f(b) > 0) {
      return null;
    }
    if (Math.abs(f(a) - f(b)) <= eps) {
      return (a + b) / 2;
    }
    var half = (a + b) / 2
    if (f(a) * f(half) <= 0) {
      return this.getZero(f, a, half, eps);
    }
    if ((f(half) * f(b)) <= 0) {
      return this.getZero(f, half, b, eps);
    }
  }


  getCross(f, g, a, b, eps) {
    if ((f(a) - g(a)) * (f(b) - g(b)) > 0) {
      return null;
    }
    if (Math.abs(f(a) - g(a)) <= eps) {
      return a
    }
    var half = (a + b) / 2
    if ((f(a) - g(a)) * (f(half) - g(half)) <= 0) {
      return this.getCross(f, g, a, half, eps);
    }
    if ((f(half) - g(half)) * (f(b) - g(b)) <= 0) {
      return this.getCross(f, g, half, b, eps);
    }
  }



  render() {
    this.canvas.clear();
    this.printOXY();

    //Function
    this.funcs.forEach(element => {
      if (element) {
        this.printFunction(element.f, element.color, element.width);
      }
    });

    //Derivative
    this.funcs.forEach(element => {
      if (element?.printDer) {
        this.printDerivative(element.f, this.derivativeX)
      }
    })

    //Integral
    this.funcs.forEach(element => {
      if (element) {
        //console.log(element);
        this.printIntegral(element.f, element.sLine, element.eLine)
      }
    })


    //Dot
    this.funcs.forEach(f => {
      if (f) {
        this.canvas.point(f.dotX, f.dotY); 
      }
    });
  }

}