const canvasSketch = require("canvas-sketch");
const random = require("canvas-sketch-util/random");

/*
https://tylerxhobbs.com/essays/2017/aesthetically-pleasing-triangle-subdivision
*/

const settings = {
  // duration: 4,
  // animate: true,
  dimensions: [2048, 2048],
};

const triQuadPoints = (size, top) => {
  return [
    {
      pts: [
        [0, 0], // top left
        [size, 0], // top right
        [0, size], // bottom left
      ],
      strokeStyle: `#000000`,
      depth: 2,
    },
    {
      pts: [
        [size, size], // bottom right
        [0, size], // bottom left
        [size, 0], // top right
      ],
      strokeStyle: `#000000`,
      depth: 2,
    },
  ];
};

const interpolatePoints = (a, b, t) => {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
};

const length = (a, b) => {
  const x = b[0] - a[0];
  const y = b[1] - a[1];
  return Math.sqrt(x * x + y * y);
};

const subdivTriPoints = (pts, splitFn) => {
  // create line from A to midpoint of B-C
  const [a, b, c] = pts;
  const bc = interpolatePoints(b, c, splitFn(pts));
  return [
    [a, bc, c],
    [a, bc, b],
  ];
};

const balancedSubdivTriPoints = (pts, splitFn) => {
  // split the longest side by finding it and rotating into place
  const [a, b, c] = pts;
  const s0 = length(a, b);
  const s1 = length(b, c);
  const s2 = length(c, a);
  if (s0 > s1 && s0 > s2) {
    // s0 largest
    pts = [c, a, b];
  } else if (s2 > s1 && s2 > s1) {
    // s2 largest
    pts = [b, c, a];
  }
  return subdivTriPoints(pts, splitFn);
};

const gaussianSplit = (tri, dist) => {
  return random.gaussian(0.5, dist);
};

const recursiveSubdiv = (tri, splitFn) => {
  if (tri.depth == 0) return tri;

  // divide into two
  const pts = balancedSubdivTriPoints(tri.pts, splitFn);
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

  // recurse both sub-triangles
  const a = recursiveSubdiv(tris[0], splitFn);
  const b = recursiveSubdiv(tris[1], splitFn);
  return [a, b].flat();
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.clearRect(0, 0, width, height);
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    const drawPoly = (poly) => {
      context.strokeStyle = poly.strokeStyle;
      context.beginPath();
      const pn = poly.pts.slice(-1)[0];
      context.moveTo(pn[0], pn[1]);
      for (var i = 0; i < poly.pts.length; ++i) {
        const pt = poly.pts[i];
        context.lineTo(pt[0], pt[1]);
      }
      context.stroke();
    };

    const padding = 100;
    const size = width - padding * 2;
    const startTriangles = triQuadPoints(size);

    // round 1: break up into sections
    const splitFn = (tri) => gaussianSplit(tri, 0.15);
    const recursiveSubdivFn = (tri) => recursiveSubdiv(tri, splitFn);
    var subdivTriangles = startTriangles.flatMap(recursiveSubdivFn);

    // round 2: apply more interesting subdivisions
    subdivTriangles = subdivTriangles.flatMap((tri) => {
      tri.depth = random.rangeFloor(5, 14);
      const variance = random.range(0.05, 0.25);
      const splitFn = (tri) => gaussianSplit(tri, variance);
      const recursiveSubdivFn = (tri) => recursiveSubdiv(tri, splitFn);
      return recursiveSubdivFn(tri);
    });

    context.lineJoin = "bevel";
    context.lineWidth = 3;
    context.translate(padding, padding);
    subdivTriangles.map(drawPoly);
  };
};

canvasSketch(sketch, settings);
