class Graph3DComponent extends Component {
    constructor(options) {
        super(options);
        this.WIN = {
            LEFT: -10,
            BOTTOM: -10,
            WIDTH: 20,
            HEIGHT: 20,
            CAMERA: new Point(0, 0, -50),
            DISPLAY: new Point(0, 0, -30),
        };

        this.canvas = new Canvas({
            WIN: this.WIN,
            id: 'canvas3D',
            callbacks: {
                wheel: (event) => this.wheel(event),
                mouseMove: (event) => this.mouseMove(event),
                mouseUp: () => this.mouseUp(),
                mouseDown: () => this.mouseDown()
            }
        });

        this.graph3D = new Graph3D({
            WIN: this.WIN,
        });

        //флажки
        this.canMove = false;
        this.drawPoints = false;
        this.drawEdges = false;
        this.drawPolygons = true;
        this.animation = false;
        this.dark = false;
        this.light = false;

        //источник света
        this.LIGHT = new Light(-40, -2, 0, 25000);

        //массив фигур
        this.figures = [];

        //переменные для порнографии
        this.R = 20;
        this.count = 3;
        this.dt = Math.PI * 2 / this.count;
        this.t = 0;
        this.k = 0;

        //переменные для FPS
        let FPS = 0;
        this.FPS = 0;
        let lastTimestamp = Date.now();

        const animLoop = () => {
            //calc fps
            FPS++;
            const timestamp = Date.now();
            if (timestamp - lastTimestamp >= 1000) {
                this.FPS = FPS;
                FPS = 0;
                lastTimestamp = timestamp;
            }
            //print scene
            this.goAnimation();
            this.render();
            requestAnimFrame(animLoop);
        }
        animLoop();
    }

    _addEventListeners() {
        document.addEventListener('keydown', event => this.keyDownHandler(event));
        document.getElementById('figures').addEventListener('change', () => {
            let value = document.getElementById('figures').value;
            this.changeFigures(value);
        });
        const powerLight = document.getElementById('powerlight');
        powerLight.addEventListener(
            'click',
            () => {
                this.LIGHT.lumen = powerLight.value - 0;
            }
        );
        document.getElementById('color').addEventListener(
            'change',
            () => {
                const color = document.getElementById('color').value;
                for (let i = 0; i < this.figures.length; i++) {
                    this.figures[i].polygons.forEach(poly => {
                        poly.color = poly.hexToRgb(color);
                    });
                }
            });
        document.getElementById('delate').addEventListener(
            'click',
            () => this.figures.pop()
        );
        document.getElementById('drawPoints').addEventListener(
            'click',
            () => this.drawPoints = !this.drawPoints
        );
        document.getElementById('drawEdges').addEventListener(
            'click',
            () => this.drawEdges = !this.drawEdges
        );
        document.getElementById('drawPolygons').addEventListener(
            'click',
            () => this.drawPolygons = !this.drawPolygons
        );
        document.getElementById('animation').addEventListener(
            'click',
            () => this.animation = !this.animation
        );
        document.getElementById('dark').addEventListener(
            'click',
            () => this.dark = !this.dark
        );
        document.getElementById('light').addEventListener(
            'click',
            () => this.light = !this.light
        );
    }

    //выбор фигуры
    changeFigures(value) {
        let f = 0;
        switch (value) {
            case "nothing":
                f = 1;
                break;
            case "cone":
                this.figures.push((new Figure).cone());
                break;
            case "cube":
                this.figures.push((new Figure).cube());
                break;
            case "twoSheetedHyperboloid":
                this.figures.push((new Figure).twoSheetedHyperboloid());
                break;
            case "oneSheetedHyperboloid":
                this.figures.push((new Figure).oneSheetedHyperboloid());
                break;
            case "ellipsoid":
                this.figures.push((new Figure).ellipsoid());
                break;
            case "tor":
                this.figures.push((new Figure).tor());
                break;
            case "sphera":
                this.figures.push((new Figure).sphera());
                break;
            case "cylinder":
                this.figures.push((new Figure).cylinder());
                break;
            case "parabolicCylinder":
                this.figures.push((new Figure).parabolicCylinder());
                break;
            case "hyperbolicCylinder":
                this.figures.push((new Figure).hyperbolicCylinder());
                break;
            case "hyperbolicParaboloid":
                this.figures.push((new Figure).hyperbolicParaboloid());
                break;
            case "ellipticalCylinder":
                this.figures.push((new Figure).ellipticalCylinder());
                break;
            case "ellipticalParaboloid":
                this.figures.push((new Figure).ellipticalParaboloid());
                break;
            case "solarSystem":
                this.figures.push(
                    //солнце 
                    (new Figure).solarSystem(
                        20, 15, new Point(0, 0, 0), "#ffff00", [{
                            method: 'rotateOz',
                            value: -Math.PI / 360
                        }]),
                    //меркурий
                    (new Figure).solarSystem(
                        20, 2, new Point(10, 0, 18), "#faebd7", [{
                            method: 'rotateOz',
                            value: Math.PI / 600
                        }]),
                    //венера
                    (new Figure).solarSystem(
                        20, 3, new Point(-20, 0, -20), "#ffa07a", [{
                            method: 'rotateOz',
                            value: Math.PI / 720
                        }]),
                    //земля 
                    (new Figure).solarSystem(
                        20, 0, new Point(-30, 0, 40), "#00bfff", [{
                            method: 'rotateOz',
                            value: -Math.PI / 720
                        }]),
                    //луна
                    (new Figure).solarSystem(
                        20, 1.5, new Point(-50, 0, 40), "#ffff00", [{
                            method: 'rotateOz',
                            value: Math.PI / 20
                        }]),
                    //земля 2
                    (new Figure).solarSystem(
                        20, 5, new Point(-40, 0, 30), "#00bfff", [{
                            method: 'rotateOz',
                            value: Math.PI / 720
                        }]),
                    //марс
                    (new Figure).solarSystem(
                        20, 4, new Point(55, 0, -32), "#cd853f", [{
                            method: 'rotateOz',
                            value: Math.PI / 720
                        }]),
                    //юпитер 
                    (new Figure).solarSystem(
                        20, 10, new Point(58, 0, 70), "#ffdab9", [{
                            method: 'rotateOz',
                            value: Math.PI / 720
                        }]),
                    //сатурн 
                    (new Figure).solarSystem(
                        20, 8, new Point(-80, 0, -70), "#eee8aa", [{
                            method: 'rotateOz',
                            value: Math.PI / 720
                        }]),
                    //кольцо сатурна
                    (new Figure).ringForSaturn(
                        40, 16, new Point(-80, 0, -70), "#a39f72", [{
                            method: 'rotateOz',
                            value: Math.PI / 720
                        }]),
                    //уран  
                    (new Figure).solarSystem(
                        20, 5.5, new Point(20, 0, -90), "#9acd32", [{
                            method: 'rotateOz',
                            value: Math.PI / 720
                        }]),
                    //нептун
                    (new Figure).solarSystem(
                        20, 5.3, new Point(-100, 0, 90), "#4169e1", [{
                            method: 'rotateOz',
                            value: Math.PI / 720
                        }]),
                );
                break;
        }

        //рисует массив фигур по цилиндру, а не друг на друге
        if (f === 0) {
            const matrix = this.graph3D.move(
                this.R * Math.cos(this.t),
                this.R * Math.sin(this.t),
                this.k
            );
            if (this.t < Math.PI * 2) {
                this.figures[this.figures.length - 1].points.forEach(point => {
                    this.graph3D.transform(matrix, point);
                });
                this.t += this.dt;
            }
            if (this.t >= Math.PI * 2) {
                this.t = 0;
                this.k += 80;
            }
        }
    }

    //вынос общего из метода переноса фигур
    moveScene(dx, dy, dz) {
        const matrix = this.graph3D.move(dx, dy, dz);
        this.figures.forEach(figure => {
            figure.points.forEach(point => {
                this.graph3D.transform(matrix, point);
            });
        });
    }

    //вынос общего из метода переноса света
    moveLight(dx, dy, dz) {
        this.LIGHT = new Light(this.LIGHT.x + dx, this.LIGHT.y + dy, this.LIGHT.z + dz, 25000);
    }

    //перенос фигур и света
    keyDownHandler(event) {
        for (let i = 0; i < this.figures.length; i++) {
            switch (event.keyCode) {
                case 65: //a влево
                    return this.moveScene(-1, 0, 0);
                case 68: //d вправо
                    return this.moveScene(1, 0, 0);
                case 87: //w вверх
                    return this.moveScene(0, 1, 0);
                case 83: //s вниз
                    return this.moveScene(0, -1, 0);
                case 76: //l влево
                    return this.moveLight(-1, 0, 0);
                case 222: //' вправо
                    return this.moveLight(1, 0, 0);
                case 80: //p вверх
                    return this.moveLight(0, 1, 0);
                case 186: //; вниз
                    return this.moveLight(0, -1, 0);
            }
        }
    }

    //зум
    wheel(event) {
        const delta = (event.wheelDelta > 0) ? 1.1 : 0.9;
        const matrix = this.graph3D.zoom(delta);
        this.figures.forEach(figure => {
            figure.points.forEach(point => {
                this.graph3D.transform(matrix, point);
            });
        });
    }

    /**************вращения**************/
    mouseMove(event) {
        const gradus = Math.PI / 180 / 4; {
            const matrix = this.graph3D.rotateOy((this.dx - event.offsetX) * gradus);
            if (this.canMove) {
                if (this.light) {
                    this.graph3D.transform(matrix, this.LIGHT);
                } else {
                    this.figures.forEach(figure => {
                        figure.points.forEach(point => {
                            this.graph3D.transform(matrix, point);
                        });
                    });
                }
            }
        }
        const matrix = this.graph3D.rotateOx((this.dy - event.offsetY) * gradus);
        if (this.canMove) {
            if (this.light) {
                this.graph3D.transform(matrix, this.LIGHT);
            } else {
                this.figures.forEach(figure => {
                    figure.points.forEach(point => {
                        this.graph3D.transform(matrix, point);
                    });
                });
            }
        }
        this.dx = event.offsetX;
        this.dy = event.offsetY;
    }

    mouseUp() {
        this.canMove = false;
    }

    mouseDown() {
        this.canMove = true;
    }

    /************************************/

    /**************анимация солнечной системы**************/
    goAnimation() {
        if (this.animation) {
            for (let i = 0; i < this.figures.length; i++) {
                const figure = this.figures[i]
                const matrix = figure.animations.reduce((S, animation) => {
                        let x = 0,
                            y = 0,
                            z = 0;
                        const { method, value } = animation;
                        if (i === 4) {
                            this.graph3D.calcCentersFigure(this.figures[i - 1]);
                            x = this.figures[i - 1].center.y;
                            y = this.figures[i - 1].center.x;
                            //console.log(x, y)
                        }
                        return this.graph3D.multMatrixes(
                            S,
                            this.graph3D.animateMatrix(x, y, z, method, value)
                        );
                    },
                    this.graph3D.one()
                );
                figure.points.forEach(point => this.graph3D.transform(matrix, point));
            }
        }
    }

    /******************************************************/

    render() {
        this.canvas.clear();

        //print polygons
        if (this.drawPolygons) {
            const polygons = [];
            this.figures.forEach((figure, index) => {
                this.graph3D.calcDistance(figure, this.WIN.CAMERA, 'distance');
                this.graph3D.calcDistance(figure, this.LIGHT, 'lumen');
                //this.graph3D.calcVisibility(figure, this.WIN.CAMERA);
                this.graph3D.calcCenters(figure);
                figure.polygons.forEach(polygon => {
                    polygon.figureIndex = index;
                    polygons.push(polygon);
                });
            });
            this.graph3D.sortByArtistAlgoritm(polygons);
            polygons.forEach(polygon => {
                if (polygon.visibility) {
                    const figure = this.figures[polygon.figureIndex];
                    const points = polygon.points.map(point => {
                        return {
                            x: this.graph3D.xs(figure.points[point]),
                            y: this.graph3D.ys(figure.points[point])
                        }
                    });
                    let { r, g, b } = polygon.color;
                    let lumen = polygon.lumen;
                    if (this.dark) {
                        const { isShadow, dark } = this.graph3D.calcShadow(polygon, this.figures, this.LIGHT);
                        lumen = (isShadow) ? dark : this.graph3D.calcIllumination(polygon.lumen, this.LIGHT.lumen);
                    } else lumen = this.graph3D.calcIllumination(polygon.lumen, this.LIGHT.lumen);
                    r = Math.round(r * lumen);
                    g = Math.round(g * lumen);
                    b = Math.round(b * lumen);
                    this.canvas.polygon(points, polygon.rgbToHex(r, g, b));
                }
            });
        }

        //print edges
        if (this.drawEdges) {
            this.figures.forEach(figure => {
                figure.edges.forEach(edge => {
                    const point1 = figure.points[edge.p1];
                    const point2 = figure.points[edge.p2];
                    this.canvas.line(
                        this.graph3D.xs(point1),
                        this.graph3D.ys(point1),
                        this.graph3D.xs(point2),
                        this.graph3D.ys(point2)
                    );
                });
            });
        }

        //print points
        if (this.drawPoints) {
            this.figures.forEach(figure => {
                figure.points.forEach(point => {
                    this.canvas.arc(
                        this.graph3D.xs(point),
                        this.graph3D.ys(point),
                    );
                });
            });
        }

        //вывод FPS
        this.canvas.text(`FPS: ${this.FPS}`, -9.6, 9, '#50fc01');
    }
}