const random = require("canvas-sketch-util/random");

const gaussianSplit = (tri, dist) => {
  return random.gaussian(0.5, dist);
};

exports.gaussianSplit = gaussianSplit;
