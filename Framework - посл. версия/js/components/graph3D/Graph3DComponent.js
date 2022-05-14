class Graph3DComponent extends Component {
    constructor(options) {
        super(options);
        this.WIN = {
            LEFT: -10,
            BOTTOM: -10,
            WIDTH: 20,
            HEIGHT: 20,
            CAMERA: new Point(0, 0, -50),
            DISPLAY: new Point(0, 0, -30)
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
        
        //массив фигур
        this.figures = [];

        //чекбокс вращения
        this.canMove = false;
        //чекбоксы вывода
        this.drawPoints = false;
        this.drawEdges = false;
        this.drawPolygons = true;

        //свет
        this.LIGHT = new Light(-40, -2, 0, 25000);

        //FPS
        let FPS = 0;
        this.FPS = 0;
        let lastTimestamp = Date.now();

        const animLoop = () => {
            FPS++;
            const timestamp = Date.now();
            if (timestamp - lastTimestamp >= 1000) {
                this.FPS = FPS;
                FPS = 0;
                lastTimestamp = timestamp;
            }
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
    }

    //выбор фигуры
    changeFigures(value) {
        switch (value) {
            case "nothing":
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
        }
    }

    //вынос общего из переноса
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

    /*            вращения            */
    mouseUp() {
        this.canMove = false;
    }

    mouseDown() {
        this.canMove = true;
    }
    
    mouseMove(event) {
        const gradus = Math.PI / 180 / 4;
        {
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

    /*********************************/

    //вывод
    render() {
        this.canvas.clear();

        //полигоны 
        if (this.drawPolygons) {
            const polygons = [];
            this.figures.forEach((figure, index) => {
                this.graph3D.calcDistance(figure, this.WIN.CAMERA, 'distance');
                this.graph3D.calcDistance(figure, this.LIGHT, 'lumen');
                figure.polygons.forEach(polygon => {
                    polygon.figureIndex = index;
                    polygons.push(polygon);
                });
            });
            this.graph3D.sortByArtistAlgoritm(polygons);
            polygons.forEach(polygon => {
                const figure = this.figures[polygon.figureIndex];
                const points = polygon.points.map(point => {
                    return {
                        x: this.graph3D.xs(figure.points[point]),
                        y: this.graph3D.ys(figure.points[point])
                    }
                });
                const lumen = this.graph3D.calcIllumination(polygon.lumen, this.LIGHT.lumen);
                let { r, g, b } = polygon.color;
                r = Math.round(r * lumen);
                g = Math.round(g * lumen);
                b = Math.round(b * lumen);
                this.canvas.polygon(points, polygon.rgbToHex(r, g, b));
            });
        }

        //ребра
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

        //точки
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

        //FPS
        this.canvas.text(`FPS: ${this.FPS}`, -9.6, 9, '#000000');
    }
}