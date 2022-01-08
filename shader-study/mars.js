const canvasSketch = require("canvas-sketch");
const createShader = require("canvas-sketch-util/shader");
const glsl = require("glslify");

const frag = require("./shaders/mars.frag");

const settings = {
  dimensions: [1080, 1080],
  context: "webgl",
  animate: true,
  duration: 6,
  fps: 50,
};

const sketch = ({ gl }) => {
  gl.getExtension("OES_standard_derivatives");

  return createShader({
    clearColor: "#2B2B2B",
    gl,
    frag,
    uniforms: {
      time: ({ playhead }) => playhead,
      density: 2.0,
    },
  });
};

canvasSketch(sketch, settings);
