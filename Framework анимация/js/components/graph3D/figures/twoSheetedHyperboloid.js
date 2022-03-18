Figure.prototype.twoSheetedHyperboloid = (count = 20, a = 7, b = 6, c = 5) => {
    const points = [];
    const edges = [];
    const polygons = [];

    //точки
    const dt = Math.PI * 2 / count;
    for (let i = 0; i <= Math.PI; i += dt) {
        for (let j = 0; j < 2 * Math.PI; j += dt) {
            points.push(new Point(
                a * Math.sinh(i) * Math.cos(j),
                c * Math.cosh(i),
                b * Math.cosh(i) * Math.sin(j)
            ));
        }
    }
    for (let i = 0; i <= Math.PI; i += dt) {
        for (let j = 0; j < 2 * Math.PI; j += dt) {
            points.push(new Point(-a * Math.sinh(i) * Math.cos(j), -c * Math.cosh(i), -b * Math.cosh(i) * Math.sin(j)));
        }
    }

    //ребра
    for (let i = 0; i < points.length; i++) {
        //вдоль
        if (i + 1 < points.length && (i + 1) % count !== 0) {
            edges.push(new Edge(
                i,
                i + 1
            ));
        } else if (i + 1 >= count && (i + 1) % count === 0) {
            edges.push(new Edge(
                i,
                i + 1 - count
            ));
        }
    }

    //полигоны
    for (let i = 0; i < points.length / 2 - count; i++) {
        if (i + 1 + count < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count]));
        } else if (i + count < points.length && (i + 1) % count === 0) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count]))
        }
    }
    for (let i = points.length / 2; i < points.length; i++) {
        if (i + 1 + count < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count]));
        } else if (i + count < points.length && (i + 1) % count === 0) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count]))
        }
    }

    return new Subject(points, edges, polygons);
}