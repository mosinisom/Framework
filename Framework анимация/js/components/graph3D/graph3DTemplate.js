Template.prototype.graph3DTemplate = () => `
    <canvas id="canvas3D"></canvas>
    <div class="checkbox">
        <input id="drawPoints" type="checkbox"><label for="drawPoints"> точки </label></input> 
        <br><input id="drawEdges" type="checkbox"><label for="drawEdges"> ребра </label></input>
        <br><input id="drawPolygons" type="checkbox" checked><label for="drawPolygons"> полигоны</label></input>   
        <br><input id="animation" type="checkbox" checked><label for="animation"> анимация</label></input>   
    </div>
    <div>
        <select id="figures" class="figures">
            <option value="nothing">Фигуры</option>
            <option value="cube">Куб</option>
            <option value="cone">Конус</option>
            <option value="cylinder">Цилиндр</option>
            <option value="sphera">Сфера</option>
            <option value="tor">Тор</option>
            <option value="ellipsoid">Эллипсоид</option>
            <option value="oneSheetedHyperboloid">Однополостный гиперболоид</option>
            <option value="twoSheetedHyperboloid">Двухполостный гиперболоид</option>
            <option value="hyperbolicParaboloid">Гиперболический параболоид</option>
            <option value="ellipticalParaboloid">Эллиптический параболоид</option>
            <option value="ellipticalCylinder">Эллиптический цилиндр</option>
            <option value="hyperbolicCylinder">Гиперболический цилиндр</option>
            <option value="parabolicCylinder">Параболический цилиндр</option>
            <option value="solarSystem">Солнечная система</option>
        </select>
    </div>
    <div>
        <button id="delate" class="del">удалить</button>
    </div>
    <div>
        <input class="powerlight" type="range" min="25000" max="50000" value="powerlight" id="powerlight">
    </div>
    <div>
        <input type="color" id="color" placeholder="color" class="color">
    </div>
`;