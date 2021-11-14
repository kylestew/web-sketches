const canvasSketch = require("canvas-sketch");
const createRegl = require("regl");
const createQuad = require("primitive-quad");

const vertShader = require("./shaders/basics.vert");
const fragShader = require("./shaders/basics.frag");

const settings = {
  animate: true,
  context: "webgl2",
  attributes: { antialias: true },
};

const sketch = ({ gl }) => {
  const regl = createRegl({ gl });
  let quad = createQuad();

  const drawQuad = regl({
    vert: vertShader,
    frag: fragShader,
    attributes: {
      position: quad.positions,
    },
    elements: regl.elements(quad.cells),
  });

  return ({ time }) => {
    regl.poll();
    regl.clear({
      color: [0, 0, 0, 1],
    });

    drawQuad({});
  };
};

canvasSketch(sketch, settings);
