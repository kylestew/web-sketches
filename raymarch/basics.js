const canvasSketch = require("canvas-sketch");
const createRegl = require("regl");
const createQuad = require("primitive-quad");
const createCamera = require("regl-camera");

const vertShader = require("./shaders/basics.vert");
const fragShader = require("./shaders/basics.frag");

const settings = {
  animate: true,
  context: "webgl2",
  attributes: { antialias: true },
};

const sketch = ({ gl }) => {
  const regl = createRegl({ gl });

  const camera = createCamera(regl, {
    center: [0, 0, 0],
    theta: -Math.PI / 2,
    distance: 5,
    mouse: false,
  });

  let quad = createQuad();

  const drawQuad = regl({
    vert: vertShader,
    frag: fragShader,
    attributes: {
      position: quad.positions,
    },
    uniforms: {
      width: regl.context("viewportWidth"),
      height: regl.context("viewportHeight"),
      time: regl.prop("time"),
    },
    elements: regl.elements(quad.cells),
  });

  return ({ time }) => {
    regl.poll();
    camera((state) => {
      regl.clear({
        color: [0, 0, 0, 1],
      });
      drawQuad({ time: time });
    });
  };
};

canvasSketch(sketch, settings);
