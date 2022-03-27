const interpolatePoints = (a, b, t) => {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
};

const length = (a, b) => {
  const x = b[0] - a[0];
  const y = b[1] - a[1];
  return Math.sqrt(x * x + y * y);
};

const subdivTriPoints = (pts, decisionFn) => {
  // create line from A to midpoint of B-C
  const [a, b, c] = pts;
  // decisionFn decides where on the B-C line to split
  const bc = interpolatePoints(b, c, decisionFn(pts));
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

const recurseSubdiv = (tri, subdivFn) => {
  if (tri.depth == 0) return tri;

  // divide tri into two
  const pts = subdivFn(tri.pts);
  // TODO: better way to express / copy this
  const tris = [
    {
      pts: pts[0],
      depth: tri.depth - 1,
    },
    {
      pts: pts[1],
      depth: tri.depth - 1,
    },
  ];

  const a = recurseSubdiv(tris[0], subdivFn);
  const b = recurseSubdiv(tris[1], subdivFn);
  return [a, b].flat();
};

module.exports = {
  recurseSubdiv,
  subdivTriPoints,
  balancedSubdivTriPoints,
};
