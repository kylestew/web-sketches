const canvasSketch = require("canvas-sketch");
const { CubeTexture } = require("three");

const settings = {
  dimensions: [2048, 2048],
};

// TODO: breaks on different RAD sizes
const RAD = 32;

const hexGridPoints = (rad, width, height) => {
  var pts = [];
  let a = (2 * Math.PI) / 6;
  let r = rad;
  for (let y = r; y + r * Math.sin(a) < height; y += r * Math.sin(a)) {
    for (
      let x = r, j = 0;
      x + r * (1 + Math.cos(a)) < width;
      x += r * (1 + Math.cos(a)), y += (-1) ** j++ * r * Math.sin(a)
    ) {
      pts.push([x, y]);
    }
  }
  return pts;
};

const distance = (p0, p1) => {
  const x = p1[0] - p0[0];
  const y = p1[1] - p0[1];
  return Math.sqrt(x * x + y * y);
};

const findNeighborsForPoint = (idx, pts, dist) => {
  let idxs = [];
  let p = pts[idx];
  for (let i = 0; i < pts.length; ++i) {
    if (i == idx) continue;
    if (distance(p, pts[i]) < dist) {
      idxs.push(i);
    }
  }
  return idxs;
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    let pts = hexGridPoints(RAD, width, height);
    console.log("Grid points:", pts.length);

    // set initial conditions for water field
    let cells = [];
    for (let i = 0; i < pts.length; ++i) {
      let neighbors = findNeighborsForPoint(i, pts, RAD * 2.0);
      cells.push({
        pt: pts[i],
        neighbors: neighbors,
        val: 0.4, // amount of water
      });
    }

    // create seed point(s)

    let a = (2 * Math.PI) / 6;
    const drawHex = (x, y) => {
      context.beginPath();
      for (let i = 0; i < 6; i++) {
        context.lineTo(x + RAD * Math.cos(a * i), y + RAD * Math.sin(a * i));
      }
      context.closePath();
      context.stroke();
    };

    context.fillStyle = "red";
    context.lineWidth = 2;
    pts.map((pt) => {
      drawHex(pt[0], pt[1]);
      // context.fillRect(pt[0], pt[1], 8, 8);
    });
  };
};

canvasSketch(sketch, settings);
