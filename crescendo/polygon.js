namespace("2181robotics.crescendo.Polygon", () => {
  const minmaxXY = function(points) {
    const xs = points.map(([x, _]) => x);
    const ys = points.map(([_, y]) => y);
    const minX = Math.min.apply(null, xs);
    const maxX = Math.max.apply(null, xs);
    const minY = Math.min.apply(null, ys);
    const maxY = Math.max.apply(null, ys);
    return { minX, maxX, minY, maxY };
  }
  const edgesFromPoints = function(points) {
    const edges = [];
    for(let i = 0; i < points.count - 1; i++) {
      edges.push( points[i].concat( points[ i + 1 ] ));
    }
    edges.push( points[points.length - 1].concat(points[0]));
    return edges;
  }
  const pointsFromSquare = function({ cx, cy, side, rotation }) {
    return Array(4).fill("").map((_, i) => {
      const a = (rotation + 90 * i) * Math.PI / 180;
      const x = cx + Math.sin(a) * side / 2;
      const y = cy + Math.cos(a) * side / 2;
      return [ x, y ];
    });
  }
  const Polygon = function(points) {
    this.collidingInside = function(square) {
      const squarePoints = pointsFromSquare(square)
        // TODO - what to do
      };
    this.collidingWith = function(square) {
      const squarePoints = pointsFromSquare(square);
      if (overlaps(points, squarePoints)) {
        // TODO - what to do with overlap
      }
    };
  }
  return Polygon;
});