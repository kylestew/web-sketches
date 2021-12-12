import createREGL from "regl";
import createQuad from "primitive-quad";
import vert from "./glsl/topomap.vert";
import frag from "./glsl/topomap.frag";

const regl = createREGL();
const quad = createQuad();
const draw = regl({
  frag,
  vert,

  // pass props
  uniforms: {
    time: regl.prop("time"),
    aspect: regl.prop("aspect"),
  },

  // draw geometry
  attributes: {
    position: quad.positions,
  },
  elements: regl.elements(quad.cells),
});

regl.frame(({ time, viewportWidth, viewportHeight }) => {
  regl.clear({
    color: [0, 0, 0, 1],
    depth: 1,
    stencil: 0,
  });

  draw({
    time,
    aspect: viewportWidth / viewportHeight,
  });
});
