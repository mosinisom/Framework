class Graph3D {
    constructor({ WIN }) {
        this.WIN = WIN;
    }

    xs(point) {
        return point.x * (this.WIN.CAMERA.z - this.WIN.DISPLAY.z) / (this.WIN.CAMERA.z - point.z);
    }
    ys(point) {
        return point.y * (this.WIN.CAMERA.z - this.WIN.DISPLAY.z) / (this.WIN.CAMERA.z - point.z);
    }

    //перемножение матриц
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

    /*              вращения              */
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

    /**************************************/

    //преобразования матрицы
    transform(matrix, point) {
        const array = this.multMatrix(matrix, [point.x, point.y, point.z, 1]);
        point.x = array[0];
        point.y = array[1];
        point.z = array[2];
    }

    /**************полигоны**************/
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

    //сортировка
    sortByArtistAlgoritm(polygons) {
        polygons.sort((a, b) => b.distance - a.distance);
    }

    /************************************/

    //свет
    calcIllumination(distance, lumen) {
        const res = distance ? lumen / Math.pow(distance, 3) : 1;
        return res > 1 ? 1 : res;
    }

    //скалярное произведение векторов
    scalProd(a, b) {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    //вычисление вектора
    calcVector(a, b) {
        return {
            x: b.x - a.x,
            y: b.y - a.y,
            z: b.z - a.z
        }
    }
    vectorProd(a, b) {
        return {
            x: a.y * b.z - a.z * b.y,
            y: a.z * b.x - a.x * b.z,
            z: a.x * b.y - a.y * b.x
        }
    }
}