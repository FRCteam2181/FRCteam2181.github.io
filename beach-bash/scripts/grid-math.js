/**
 * line equation form:
 * y = mx + b
 * m is slope
 * b is y-intercept
 */
namespace("2181robotics.beach-bash.GridMath", {
  "2181robotics.beach-bash.Constants": "Constants"
}, ({ Constants }) => {
  const deg2rad = (degrees) => degrees * Math.PI / 180;
  const rad2deg = (radians) => radians * 180 / Math.PI;
  const pythagorean = (a,b) => Math.sqrt(a * a + b * b);
  const distance = (x1,y1,x2,y2) => pythagorean(Math.abs(x2-x1),Math.abs(y2-y1));
  const slope = (x1,y1,x2,y2) => (y2 - y1)/(x2 - x1);
  const yIntercept = (x, y, slope) => y - slope * x;
  const line2coeff = (x1,y1,x2,y2) => {
    const m = slope(x1,y1,x2,y2);
    const b = yIntercept(x1,y1,m);
    return { m, b };
  };
  const lineCoeffIntersection = ({ m: m1, b: b1 }, { m: m2, b: b2 }) => {
    const x = (b1 - b2) / (m2 - m1);
    const y1 = m1 * x + b1;
    const y2 = m2 * x + b2;
    if (y1 !== y2) {
      throw { m1, b1, m2, b2, x, y1, y2, errorMessage: "line coefficient intersection miscalculated" };
    }
    return { x, y: y1 };
  };
  const perpendicularSlope = (slope) => -1/slope;
  const withinRangeOfEdge = ( x1, y1, x2, y2, cx, cy, range ) => {
    const edge = line2coeff(x1, y1, x2, y2);
    const m2 = perpendicularSlope(edge.m);
    const b2 = yIntercept(cx, cy, m2);
    const { x, y } = lineCoeffIntersection(edge, {m: m2, b: b2});
    const d = distance(cx, cy, x, y);
    return d <= range;
  };
  const mappedPointsToMappedEdges = (pointMap) => {
    const points = Object.entries(pointMap).map(([label,[x,y]],order) => {
      return { label, x, y, order };
    });
    points.sort((a,b) => a.order - b.order);
    const edges = {};
    const applyEdge = (i1, i2) => {
      const { label: label1, x: x1, y: y1 } = points[i1];
      const { label: label2, x: x2, y: y2 } = points[i2];
      edges[label1 + label2] = { x1, y1, x2, y2 };
    }
    for(let i = 0; i < points.length - 1; i++) {
      applyEdge(i, i + 1);
    }
    applyEdge(points.length - 1, 0);
    return edges;
  }
  const minMaxXY = function(points, fx, fy) {
    const xs = points.map(fx);
    const ys = points.map(fy);
    const minX = Math.min.apply(null,xs);
    const maxX = Math.max.apply(null,xs);
    const minY = Math.min.apply(null,ys);
    const maxY = Math.max.apply(null,ys);
    return { minX, maxX, minY, maxY };
  }
  const minMaxXYObj = (points) => minMaxXY(points, (p) => p.x, (p) => p.y);
  const minMaxXYArray = (points) => minMaxXY(points, (p) => p[0], (p) => p[1]);
  const insiders = {
    minX: (x1, y1, x2, y2, [x,y]) => x >= Math.min(x1, x2),
    minY: (x1, y1, x2, y2, [x,y]) => y >= Math.min(y1, y2),
    maxX: (x1, y1, x2, y2, [x,y]) => x <= Math.max(x1, x2),
    maxY: (x1, y1, x2, y2, [x,y]) => y <= Math.max(y1, y2),
    minXminY: (x1, y1, x2, y2, [x,y]) => x >= Math.min(x1, x2) && y >= Math.min(y1, y2),
    minXmaxY: (x1, y1, x2, y2, [x,y]) => x >= Math.min(x1, x2) && y <= Math.max(y1, y2),
    maxXminY: (x1, y1, x2, y2, [x,y]) => x <= Math.max(x1, x2) && y >= Math.min(y1, y2),
    maxXmaxY: (x1, y1, x2, y2, [x,y]) => x <= Math.max(x1, x2) && y <= Math.max(y1, y2),
  }
  const getInsiderType = function(x1, y1, x2, y2, minX, maxX, minY, maxY ) {
    let insiderTypeX = "";
    if (x1 === minX || x2 === minX) {
      insiderTypeX = "minX"
    } else if (x1 === maxX || x2 === maxX) {
      insiderTypeX = "maxX"
    }
    let insiderTypeY = "";
    if (y1 === minY || y2 === minY) {
      insiderTypeY = "minY"
    } else if (y1 === maxY || y2 === maxY) {
      insiderTypeY = "maxY"
    }
    return insiderTypeX + insiderTypeY;
  }
  const isBallWithinBoundsOfRobot = function(robotMappedPoints, ballXYZ) {
    const ballRadius = Constants.beachBallRadius();
    const { minX, maxX, minY, maxY } = minMaxXYArray(Object.values(robotMappedPoints));
    if (ballXYZ.x < minX - ballRadius || ballXYZ.x > maxX + ballRadius || ballXYZ.y < minY - ballRadius || ballXYZ.y > maxY + ballRadius || ballXYZ.z > Constants.robotHeight() + ballRadius) {
      return false;
    }
    return Object.values(mappedPointsToMappedEdges(robotMappedPoints)).reduce((outVal, edge) => {
      const { x1, y1, x2, y2 } = edge;
      const insiderType = getInsiderType(x1, y1, x2, y2, minX, maxX, minY, maxY);
      const isInside = insiders[insiderType];
      return outVal && (withinRangeOfEdge(x1, y1, x2, y2, ballXYZ.x, ballXYZ.y, ballRadius) || isInside(x1, y1, x2, y2, [ballXYZ.x, ballXYZ.y]));
    }, true);
  }
  return { 
    deg2rad, rad2deg, pythagorean, distance, slope, yIntercept, 
    line2coeff, lineCoeffIntersection, perpendicularSlope, 
    mappedPointsToMappedEdges, isBallWithinBoundsOfRobot,
    minMaxXYArray, minMaxXYObj
  };
});