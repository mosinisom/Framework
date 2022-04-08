class Planets {

    /**************переменные для солнечной системы**************/
    Sun = (new Figure).solarSystem(20, 15, new Point, "#ffff00", [{
        // вращение вокруг себя любимого
        method: 'rotateOz',
        value: Math.PI / 220,
        text: "Солнце"
    }]);

    Mercury = (new Figure).solarSystem(
        20, 2, new Point(10, 0, 18), "#faebd7", [{
                method: 'rotateOz',
                value: Math.PI / 180,
                center: new Point,
                text: "Меркурий",
                check: true
            }
            /*, {
                        //вращение вокруг себя любимого
                        method: 'rotateOz',
                        value: Math.PI / 180,
                        check: true
                    }*/
        ]
    );

    Venus = (new Figure).solarSystem(
        20, 3, new Point(-20, 0, -20), "#ffa07a", [{
                method: 'rotateOz',
                value: Math.PI / 220,
                center: new Point,
                text: "Венера",
                check: true
            }
            /*, {
                        //вращение вокруг себя любимого
                        method: 'rotateOz',
                        value: Math.PI / 180,
                        check: true
                    }*/
        ]
    );

    Earth = (new Figure).solarSystem(
        20, 5, new Point(-45, 0, 0), "#00bfff", [{
                //вращение вокруг солнышка
                method: 'rotateOz',
                value: Math.PI / 360,
                center: new Point,
                text: "Земля",
                check: true
            },
            /*{
                       //вращение вокруг себя любимого
                       method: 'rotateOz',
                       value: Math.PI / 180,
                       check: true
                   }*/
        ]
    );

    Moon = (new Figure).solarSystem(
        20, 1.5, new Point(-55, 0, 0), "#ffff00", [
            /*{
                            method: 'rotateOz',
                            value: Math.PI / 360,
                            center: new Point
                        },*/
            {
                method: 'rotateOz',
                value: Math.PI / 720,
                center: this.Earth.center,
                text: "Луна"
            }
        ]
    );

    Mars = (new Figure).solarSystem(
        20, 4, new Point(55, 0, -32), "#cd853f", [{
            method: 'rotateOz',
            value: Math.PI / 380,
            center: new Point,
            text: "Марс",
            check: true
        }]
    );

    Jupiter = (new Figure).solarSystem(
        20, 10, new Point(75, 0, 50), "#ffdab9", [{
            method: 'rotateOz',
            value: Math.PI / 400,
            center: new Point,
            text: "Юпитер",
            check: true
        }]
    );

    Saturn = (new Figure).solarSystem(
        20, 8, new Point(-105, 0, -75), "#eee8aa", [{
            method: 'rotateOz',
            value: Math.PI / 450,
            center: new Point,
            text: "Сатурн",
            check: true
        }]
    );

    SaturnRing = (new Figure).ringForSaturn(
        20, 16, new Point(-105, 0, -75), "#a39f72", [{
            method: 'rotateOz',
            value: Math.PI / 450,
            center: new Point
        }]
    );

    Uranium = (new Figure).solarSystem(
        20, 5.5, new Point(20, 0, -150), "#9acd32", [{
            method: 'rotateOz',
            value: Math.PI / 480,
            center: new Point,
            text: "Уран",
            check: true
        }]
    );

    Neptune = (new Figure).solarSystem(
        20, 5.3, new Point(-160, 0, 90), "#4169e1", [{
            method: 'rotateOz',
            value: Math.PI / 520,
            center: new Point,
            text: "Нептун",
            check: true
        }]
    );

    //заполнение массива солнечной системы
    figures = [
        this.Sun,
        this.Mercury,
        this.Venus,
        this.Earth,
        this.Moon,
        this.Mars,
        this.Jupiter,
        this.Saturn,
        this.SaturnRing,
        this.Uranium,
        this.Neptune
    ];

    /************************************************************/

    //массив связанных анимаций
    animations = [{
        root: this.Sun,
        nodes: [
            { root: this.Mercury },
            { root: this.Venus },
            { root: this.Earth, nodes: [{ root: this.Moon }] },
            { root: this.Mars },
            { root: this.Jupiter },
            { root: this.Saturn, nodes: [{ root: this.SaturnRing }] },
            { root: this.Uranium },
            { root: this.Neptune }
        ]
    }];
}