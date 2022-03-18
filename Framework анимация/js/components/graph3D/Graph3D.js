class Graph3D {
    constructor({ WIN }) {
        this.WIN = WIN;
    }

    xs(point) {
        return point.x * (this.WIN.CAMERA.z - this.WIN.DISPLAY.z) /
            (this.WIN.CAMERA.z - point.z);
    }

    ys(point) {
        return point.y * (this.WIN.CAMERA.z - this.WIN.DISPLAY.z) /
            (this.WIN.CAMERA.z - point.z);
    }

    //зум
    zoom(delta) {
        return [
            [delta, 0, 0, 0],
            [0, delta, 0, 0],
            [0, 0, delta, 0],
            [0, 0, 0, 1]
        ];
    }

    //перенос
    move(dx, dy, dz) {
        return [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [dx, dy, dz, 1]
        ];
    }

    /**************вращения**************/
    rotateOx(alpha) {
        return [
            [1, 0, 0, 0],
            [0, Math.cos(alpha), Math.sin(alpha), 0],
            [0, -Math.sin(alpha), Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
    }

    rotateOy(alpha) {
        return [
            [Math.cos(alpha), 0, -Math.sin(alpha), 0],
            [0, 1, 0, 0],
            [Math.sin(alpha), 0, Math.cos(alpha), 0],
            [0, 0, 0, 1]
        ];
    }

    rotateOz(alpha) {
        return [
            [Math.cos(alpha), Math.sin(alpha), 0, 0],
            [-Math.sin(alpha), Math.cos(alpha), 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
    }

    /*________________*/

    //анимация солнечной системы
    animateMatrix(dx, dy, dz, alpha) {
        return this.transformMatrix([
            this.move(dx, dy, dz),
            this.rotateOz(alpha),
            this.move(-dx, -dy, -dz)
        ]);
    }

    /*           перемножение матриц          */
    multMatrix(T, m) {
        const a = [0, 0, 0, 0];
        for (let i = 0; i < T.length; i++) {
            let b = 0;
            for (let j = 0; j < m.length; j++) {
                b += T[j][i] * m[j];
            }
            a[i] = b;
        }
        return a;
    }

    multMatrixes(a, b) {
        const c = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let s = 0;
                for (let k = 0; k < 4; k++) {
                    s += a[i][k] * b[k][j];
                }
                c[i][j] = s;
            }
        }
        return c;
    }

    /*________________*/

    /*          преобразования матриц          */
    transform(matrix, point) {
        const array = this.multMatrix(matrix, [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    transformMatrix(matrixes) {
        let m = [
            [1, 0, 0, 0],
            [0, 1, 0, 0],
            [0, 0, 1, 0],
            [0, 0, 0, 1]
        ];
        matrixes.forEach(matrix => {
            m = this.multMatrixes(m, matrix);
        });
        return m;
    }

    /*________________*/

    /*         полигоны              */
    calcDistance(figure, endPoint, name) {
        figure.polygons.forEach(polygon => {
            const points = polygon.points;
            let x = 0,
                y = 0,
                z = 0;
            for (let i = 0; i < points.length; i++) {
                x += figure.points[points[i]].x;
                y += figure.points[points[i]].y;
                z += figure.points[points[i]].z;
            }
            x /= points.length;
            y /= points.length;
            z /= points.length;
            polygon[name] = Math.sqrt(
                Math.pow(endPoint.x - x, 2) +
                Math.pow(endPoint.y - y, 2) +
                Math.pow(endPoint.z - z, 2));
        });
    }

    sortByArtistAlgoritm(polygons) {
        polygons.sort((a, b) => b.distance - a.distance);
    }

    /*________________*/

    /*             тени                */
    //вычисляет центр полигона
    calcCenters(figure) {
        figure.polygons.forEach(polygon => {
            const points = polygon.points;
            let x = 0,
                y = 0,
                z = 0;
            for (let j = 0; j < points.length; j++) {
                x += figure.points[points[j]].x;
                y += figure.points[points[j]].y;
                z += figure.points[points[j]].z;
            };
            polygon.center.x = x / points.length;
            polygon.center.y = y / points.length;
            polygon.center.z = z / points.length;
        });
    }

    calcShadow(polygon, figures, LIGHT) {
        const M1 = polygon.center;
        const s = this.calcVector(M1, LIGHT);
        for (let i = 0; i < figures.length; i++) {
            for (let j = 0; j < figures[i].polygons.length; j++) {
                const poly = figures[i].polygons[j];
                const M0 = poly.center;
                if (M1.x === M0.x &&
                    M1.y === M0.y &&
                    M1.z === M0.z
                ) {
                    continue;
                }
                if (poly.lumen > polygon.lumen) {
                    continue;
                }
                const dark = this.calcVectorModule(this.vectorProd(this.calcVector(M0, M1), s)) / this.calcVectorModule(s);
                if (dark < 0.1) {
                    return {
                        isShadow: true,
                        dark: dark / 10
                    }
                }
            }
        }
        return {
            isShadow: false,
            //dark: 0.1
        }
    }

    //вычисление модуля
    calcVectorModule(a) {
        return Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2) + Math.pow(a.z, 2));
    }

    /*________________*/

    //свет и тени
    calcIllumination(distance, lumen) {
        const res = distance ? lumen / Math.pow(distance, 3) : 1;
        return res > 1 ? 1 : res;
    }

    /*           отсечение невидимых граней           */
    //скалярное произведение векторов
    scalProd(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    /*                вычисление вектора                    */
    calcVector(a, b) {
        return {
            x: b.x - a.x,
            y: b.y - a.y,
            z: b.z - a.z
        }
    }

    //векторное произведение
    vectorProd(a, b) {
        return {
            x: a.y * b.z - a.z * b.y,
            y: -a.x * b.z + a.z * b.x,
            z: a.x * b.y - a.y * b.x
        }
    }

    /*________________*/

    //проверка на нулевой вектор
    isVectorZero(vector) {
        return !vector.x && !vector.y && !vector.z;
    }

    //отсечение невидимых граней
    calcVisibility(figure, camera) {
        const vec = this.calcVector(camera, new Point(0, 0, 0));
        figure.polygons.forEach(polygon => {
            const points = polygon.points;
            let vector1 = this.calcVector(
                figure.points[points[0]],
                figure.points[points[1]]
            );
            if (this.isVectorZero(vector1)) {
                vector1 = this.calcVector(
                    figure.points[points[3]],
                    figure.points[points[2]]
                );
            }
            let vector2 = this.calcVector(
                figure.points[points[0]],
                figure.points[points[2]]
            );
            if (this.isVectorZero(vector2)) {
                vector2 = this.calcVector(
                    figure.points[points[3]],
                    figure.points[points[2]]
                );
            }
            const vector = this.vectorProd(vector1, vector2);
            const c = this.calcCorner(vec, vector);
            polygon.visibility = c < Math.cos(Math.PI / 2.4);
        });
    }

    //угол между 2 векторами
    calcCorner(a, b) {
        return this.scalProd(a, b) /
            (Math.sqrt(this.scalProd(a, a)) * (Math.sqrt(this.scalProd(b, b))));
    }

    /*________________*/
}