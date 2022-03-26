const interpolatePoints = (a, b, t) => {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t];
};

exports.subdivTriPoints = (pts, decisionFn) => {
  // create line from A to midpoint of B-C
  const [a, b, c] = pts;
  // decisionFn decides where on the B-C line to split
  const bc = interpolatePoints(b, c, decisionFn(pts));
  return [
    [a, bc, c],
    [a, bc, b],
  ];
};
