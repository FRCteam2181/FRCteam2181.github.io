namespace("2181robotics.beach-bash.BounceTest", {
  "2181robotics.beach-bash.Bounce": "Bounce",
  "2181robotics.beach-bash.Constants": "Constants",
  "2181robotics.beach-bash.GridMath": "GridMath"
}, ({ Bounce, GridMath }) => {
  const frameRate = Constants.frameRate();
  const heading = 78;
  const launchAngle = 65;
  const launchVelocity = 20;
  const initHeight = 1.5;
  const wrapSVG = function(margin, minMaxXY, content) {
    const { minX, maxX, minY, maxY } = minMaxXY;
    const x = minX - margin;
    const y = minY - margin;
    const width = maxX - minX + 2 * margin;
    const height = maxY - minY + 2 * margin;
    return `<svg width="100%" height="100%" viewBox="${x} ${y} ${width} ${height}">
      <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none" stroke="black" stroke-width="1"/>
      ${content}
    </svg>`;
  }
  const circle = function(x,y,r) {
    return `<circle cx="${x}" cy="${y}" r="${r}" fill="url(#redBallGrad)"/>`
  }

  const path2d = Bounce.calcPath2d(launchAngle, launchVelocity, initHeight);
  const minMaxXY2d = GridMath.minMaxXYObj(path2d);
  const svg2d = wrapSVG(1, minMaxXY2d, path2d.map(({x,y}) => circle(x,y,0.5)).join(""));
  
  const path3d = Bounce.calcPath3d(heading, launchAngle, launchVelocity, initHeight);
  const minMaxXY3d = GridMath.minMaxXYObj(path3d);
  const svg3d = wrapSVG(1, minMaxXY3d, path3d.map(({x,y,z}) => circle(x,y,0.5+z/10)).join(""));
  
  console.log({ minMaxXY2d, minMaxXY3d })

  return function() {
    this.draw = function() {
      document.getElementById("bounceTest2d").innerHTML = svg2d;
      document.getElementById("bounceTest3d").innerHTML = svg3d;
      let index2d = 0;
      let index3d = 0;
      setInterval(() => {
        const { x, y } = path2d[index2d];
        document.getElementById("animate2d").innerHTML = wrapSVG(1, minMaxXY2d, circle(x, y, 0.5));
        index2d = (index2d + 1) % path2d.length;
      }, 1000 / frameRate);
      setInterval(() => {
        const { x, y, z } = path3d[index3d];
        document.getElementById("animate3d").innerHTML = wrapSVG(1, minMaxXY3d, circle(x, y, 0.5 + z / 12));
        index3d = (index3d + 1) % path3d.length;
      }, 1000 / frameRate);
    }
  }
});