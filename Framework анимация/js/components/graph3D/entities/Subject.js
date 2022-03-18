class Subject {
    constructor(points = [], edges = [], polygons = [], animation = null, turn = 1, center = new Point) {
        this.points = points;
        this.edges = edges;
        this.polygons = polygons;
        this.animation = animation;
        this.center = center;
        this.turn = turn;
    }
}