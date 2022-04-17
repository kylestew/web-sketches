const canvasSketch = require("canvas-sketch");
const load = require("load-asset");
const random = require("canvas-sketch-util/random");

const startGeo = require("./lib/start_geo");
const subdivs = require("./lib/subdivs");
const decisions = require("./lib/decisions");
const drawing = require("./lib/drawing");
const { gaussian } = require("canvas-sketch-util/random");

const settings = {
  dimensions: [2048, 2048],
};

const sketch = async () => {
  // TODO: replace with riso gradients
  // optionally some are going to be solid fills
  const images = [
    await load("assets/gradients/gradients2.jpg"),
    await load("assets/gradients/gradients3.jpg"),
    //   await load("assets/gradients/gradients4.jpg"),
    await load("assets/gradients/gradients5.jpg"),
    await load("assets/gradients/gradients6.jpg"),
    //   await load("assets/gradients/gradients7.jpg"),
    //   await load("assets/gradients/gradients8.jpg"),
    await load("assets/gradients/gradients11.jpg"),
    //   await load("assets/gradients/gradients12.jpg"),
    //   await load("assets/gradients/gradients13.jpg"),
    await load("assets/gradients/gradients14.jpg"),
    //   await load("assets/gradients/gradients15.jpg"),
    //   await load("assets/gradients/gradients16.jpg"),
    //   await load("assets/gradients/gradients17.jpg"),
    //   await load("assets/gradients/gradients22.jpg"),
  ];

  return ({ context: ctx, width, height }) => {
    const padding = parseInt(width * 0.2);
    const size = width - padding * 2;

    // 1: generate seed triangles for subdiv
    const startTriangles = startGeo.triQuadPoints(size);

    // 2: break up each poly into large sections
    const decisionFn = (tri) => decisions.gaussianSplit(tri, 0.15);
    const subdivFn = (tri) => subdivs.balancedSubdivTriPoints(tri, decisionFn);
    const recursiveSubdivFn = (tri) => subdivs.recurseSubdiv(tri, subdivFn);
    let subdivTriangles = startTriangles.flatMap(recursiveSubdivFn);

    // 3: apply more interesting subdivisions to large sections
    // subdivTriangles = subdivTriangles.flatMap((tri) => {
    //   tri.depth = random.rangeFloor(2, 12);
    //   const variance = random.range(0.05, 0.15);
    //   const decisionFn = (tri) => decisions.gaussianSplit(tri, variance);
    //   const subdivFn = (tri) =>
    //     subdivs.balancedSubdivTriPoints(tri, decisionFn);
    //   const recursiveSubdivFn = (tri) => subdivs.recurseSubdiv(tri, subdivFn);
    //   return recursiveSubdivFn(tri);
    // });

    subdivTriangles.forEach((poly) => {
      const pts = poly.pts.map((pt) => {
        return "(" + pt[0] + ", " + pt[1] + ")";
      });
      console.log(pts);
    });

    // 4: Draw polys
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 8;
    ctx.lineJoin = "bevel";
    ctx.translate(padding, padding);

    const clipFn = (poly) => drawing.clipContextToPoly(ctx, poly);
    const drawImageFn = (poly) => {
      // console.log("rendering image into clipped poly", poly);
      let img = images[Math.floor(Math.random() * images.length)];
      ctx.drawImage(img, 0, 0, width, height);
    };
    // const drawFn = (poly) => {
    //   ctx.save();
    //   clipFn(poly);
    //   drawImageFn(poly);
    //   ctx.stroke();
    //   ctx.restore();
    // };
    const drawFn = (poly) => drawing.drawPoly(ctx, poly);
    subdivTriangles.map(drawFn);
    // startTriangles.map(drawFn);
  };
};

canvasSketch(sketch, settings);
