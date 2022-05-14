Figure.prototype.tor = (R = 18, r = 6, count = 20) => {
    const points = [];
    const edges = [];
    const polygons = [];

    //точки 
    const dt = Math.PI * 2 / count;
    for (let i = 0; i < Math.PI * 2; i += dt) {
        for (let j = 0; j < Math.PI * 2; j += dt) {
            points.push(new Point(
                (R + r * Math.cos(i)) * Math.cos(j),
                r * Math.sin(i),
                (R + r * Math.cos(i)) * Math.sin(j)
            ));
        }
    }

    //ребра 
    for (let i = 0; i < points.length; i++) {
        if ((i + 1) % count === 0) {
            edges.push(new Edge(
                i,
                i + 1 - count
            ));
        } else {
            edges.push(new Edge(
                i,
                i + 1
            ));
        }
        if (points[i + count]) {
            edges.push(new Edge(
                i,
                i + count
            ));
        } else {
            edges.push(new Edge(
                i,
                count - (points.length - i)
            ));
        }
    }

    //полигоны
    for (let i = 0; i < points.length; i++) {
        if (i + 1 + count < points.length && (i + 1) % count !== 0) {
            polygons.push(new Polygon([i, i + 1, i + 1 + count, i + count]));
        }
        if (i + count < points.length && (i + 1) % count === 0) {
            polygons.push(new Polygon([i, i + 1 - count, i + 1, i + count]));
        }
        if (!points[i + count] && i + 1 < points.length) {
            polygons.push(new Polygon([i, i + 1, count - (points.length - i) + 1, count - (points.length - i)]));
        }
        polygons.push(new Polygon([19, 0, 380, 399]));
    }

    return new Subject(points, edges, polygons);
}