const random = require("canvas-sketch-util/random");

const gaussianSplit = (tri, dist) => {
  return Math.min(Math.max(random.gaussian(0.5, dist), 0), 1);
};

exports.gaussianSplit = gaussianSplit;
