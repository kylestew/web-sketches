const canvasSketch = require("canvas-sketch");
// const load = require("load-asset");
// const random = require("canvas-sketch-util/random");

const startGeo = require("./lib/start_geo");
const subdivs = require("./lib/subdivs");
const decisions = require("./lib/decisions");
const drawing = require("./lib/drawing");

const settings = {
  dimensions: [2048, 2048],
};

const recurseSubdiv = (tri, subdivFn) => {
  if (tri.depth == 0) return tri;

  // divide tri into two
  const pts = subdivFn(tri.pts);
  // TODO: better way to express / copy this
  const tris = [
    {
      pts: pts[0],
      depth: tri.depth - 1,
      strokeStyle: tri.strokeStyle,
    },
    {
      pts: pts[1],
      depth: tri.depth - 1,
      strokeStyle: tri.strokeStyle,
    },
  ];

  const a = recurseSubdiv(tris[0]);
  const b = recurseSubdiv(tris[1]);
  return [a, b].flat();
};

const sketch = async () => {
  // const image = await load("assets/baboon.jpeg");
  // console.log(image);

  return ({ context: ctx, width, height }) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    const padding = 100;
    const size = width - padding * 2;
    const startTriangles = startGeo.triQuadPoints(size);

    // round 1: break up into sections
    const decisionFn = (tri) => decisions.gaussianSplit(tri, 0.15);
    const subdivFn = (tri) => subdivs.subdivTriPoints(tri, decisionFn);
    const recursiveSubdivFn = (tri) => recurseSubdiv(tri, subdivFn);
    let subdivTriangles = startTriangles.flatMap(recursiveSubdivFn);

    console.log(startTriangles);
    console.log(subdivTriangles);

    // TODO:...

    // debug drawing
    ctx.lineJoin = "bevel";
    ctx.lineWidth = 3;
    ctx.translate(padding, padding);
    const drawPoly = (poly) => drawing.drawPoly(ctx, poly);
    subdivTriangles.map(drawPoly);

    // CLIPPING EXAMPLE
    /*
    ctx.fillRect(0, 0, width, height);

    // create a circlular clip path
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2, true);
    ctx.clip();

    // draw background
    var lingrad = ctx.createLinearGradient(0, 0, 0, height);
    lingrad.addColorStop(0, "#232256");
    lingrad.addColorStop(1, "#143778");

    ctx.fillStyle = lingrad;
    ctx.fillRect(0, 0, width, height);

    // draw stars
    for (let j = 1; j < 50; j++) {
      ctx.save();
      let x = Math.floor(Math.random() * width);
      let y = Math.floor(Math.random() * height);

      clipPath(ctx, x, y, Math.floor(Math.random() * 96) + 32);

      ctx.drawImage(image, 0, 0, width, height);

      ctx.restore();
    }
    */

    // function clipPath(ctx, x, y, r) {
    //   console.log(x, y, r);
    //   ctx.save();
    //   ctx.beginPath();
    //   ctx.arc(x, y, r, 0, Math.PI * 2);
    //   ctx.clip();
    // }
  };
};

canvasSketch(sketch, settings);
