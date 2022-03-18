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
        this.animation = true;

        //источник света
        this.LIGHT = new Light(-40, -2, 0, 25000);

        //массив фигур
        this.figures = [];

        //переменные
        this.R = 20;
        this.count = 3;
        this.dt = Math.PI * 2 / this.count;
        this.t = 0;
        this.k = 0;

        //переменные для fps
        this.FPS = 0;
        this.FPSout = 0;
        this.startTime = Date.now();

        setInterval(() => {
            this.goAnimation();
            this.calcFPS();
            this.render();
        }, 200);
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
                this.render();
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
                this.render();
            });
        document.getElementById('delate').addEventListener(
            'click',
            () => {
                this.figures.pop();
                this.render();
            }
        );
        document.getElementById('drawPoints').addEventListener(
            'click',
            () => {
                this.drawPoints = !this.drawPoints;
                this.render();
            }
        );
        document.getElementById('drawEdges').addEventListener(
            'click',
            () => {
                this.drawEdges = !this.drawEdges;
                this.render();
            }
        );
        document.getElementById('drawPolygons').addEventListener(
            'click',
            () => {
                this.drawPolygons = !this.drawPolygons;
                this.render();
            }
        );
        document.getElementById('animation').addEventListener(
            'click',
            () => {
                this.animation = !this.animation;
                this.render();
            }
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
            case "surprise":
                this.figures.push((new Figure).surprise());
                break;
            case "solarSystem":
                this.figures.push(
                    (new Figure).solarSystem(
                        20, 15, new Point(0, 0, 0), "#ffff00", {}
                    ), //солнце 
                    (new Figure).solarSystem(
                        20, 3, new Point(10, 0, 30), "#faebd7", { rotateOz: new Point }
                    ), //меркурий 
                    (new Figure).solarSystem(
                        20, 4, new Point(-30, 0, 20), "ffa07a", { rotateOz: new Point }
                    ), //венера 
                    (new Figure).solarSystem(
                        20, 4.4, new Point(0, 0, 50), "#00bfff", { rotateOz: new Point }
                    ), //земля
                    (new Figure).solarSystem(
                        20, 2, new Point(-10, 0, 60), "#ffff00", { rotateOz: new Point }, new Point(0, 0, 50), -1
                    ), //луна 
                    (new Figure).solarSystem(
                        20, 3.6, new Point(55, 0, -32), "#cd853f", { rotateOz: new Point }
                    ), //марс 
                    (new Figure).solarSystem(
                        20, 10, new Point(50, 0, 80), "#ffdab9", { rotateOz: new Point }
                    ), //юпитер 
                    (new Figure).solarSystem(
                        20, 7, new Point(-70, 0, -60), "#eee8aa", { rotateOz: new Point }
                    ), //сатурн 
                    (new Figure).solarSystem(
                        20, 5.5, new Point(10, 0, -80), "#9acd32", { rotateOz: new Point }
                    ), //уран 
                    (new Figure).solarSystem(
                        20, 5.3, new Point(50, 0, -100), "#4169e1", { rotateOz: new Point }
                    ), //нептут
                );
                break;
        }

        //порнография, но рабочая (рисует массив фигур по цилиндру, а не друг на друге)
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

        this.render();
    }

    //подсчет кадров
    calcFPS() {
        this.FPS++;
        const nowTime = Date.now();
        if (nowTime - this.startTime >= 1000) {
            this.startTime = nowTime;
            this.FPSout = this.FPS;
            this.FPS = 0;
        }
    }

    //вынос общего из метода переноса
    moveScene(dx, dy, dz) {
        const matrix = this.graph3D.move(dx, dy, dz);
        this.figures.forEach(figure => {
            figure.points.forEach(point => {
                this.graph3D.transform(matrix, point);
            });
        });
        this.render();
    }

    //перенос
    keyDownHandler(event) {
        for (let i = 0; i < this.figures.length; i++) {
            switch (event.keyCode) {
                case 65: //a
                    return this.moveScene(-1, 0, 0);
                case 68: //d
                    return this.moveScene(1, 0, 0);
                case 87: //w
                    return this.moveScene(0, 1, 0);
                case 83: //s
                    return this.moveScene(0, -1, 0);
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
        this.render();
    }

    /**************вращения**************/
    mouseMove(event) {
        const gradus = Math.PI / 180 / 4; {
            const matrix = this.graph3D.rotateOy((this.dx - event.offsetX) * gradus);
            if (this.canMove) {
                this.figures.forEach(figure => {
                    figure.points.forEach(point => {
                        this.graph3D.transform(matrix, point);
                    });
                });
            }
        }
        const matrix = this.graph3D.rotateOx((this.dy - event.offsetY) * gradus);
        if (this.canMove) {
            this.figures.forEach(figure => {
                figure.points.forEach(point => {
                    this.graph3D.transform(matrix, point);
                });
            });
        }
        this.dx = event.offsetX;
        this.dy = event.offsetY;
        this.render();
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
            this.figures.forEach(figure => {
                if (figure.animation) {
                    for (let key in figure.animation) {
                        const { x, y, z } = figure.animation[key];
                        const turn = figure.turn;
                        const dx = this.WIN.DISPLAY.x - x;
                        const dy = this.WIN.DISPLAY.y - y;
                        const dz = this.WIN.DISPLAY.z - z;
                        const alpha = turn * Math.PI / 300;
                        const matrix = this.graph3D.animateMatrix(dx, dy, dz, alpha);
                        figure.points.forEach(point => this.graph3D.transform(matrix, point));
                    }
                }
            });
        }
    }

    /******************************************************/

    render() {
        this.canvas.clear();

        //вывод FPS
        this.figures.forEach(figure => {
            if (figure.animation) {
                this.canvas.text("FPS: " + this.FPSout, -9, 9, 'white');
            } else this.canvas.text("FPS: " + this.FPSout, -9, 9);
        });

        //print polygons
        if (this.drawPolygons) {
            const polygons = [];
            this.figures.forEach((figure, index) => {
                this.graph3D.calcDistance(figure, this.WIN.CAMERA, 'distance');
                this.graph3D.calcDistance(figure, this.LIGHT, 'lumen');

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
                    const { isShadow, dark } = this.graph3D.calcShadow(polygon, this.figures, this.LIGHT);
                    const lumen = (isShadow) ? dark : this.graph3D.calcIllumination(polygon.lumen, this.LIGHT.lumen);
                    r = Math.round(r * lumen);
                    g = Math.round(g * lumen);
                    b = Math.round(b * lumen);
                    this.canvas.polygon(points, polygon.rgbToHex(r, g, b));
                }
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

    }
}