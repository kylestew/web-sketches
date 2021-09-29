import createShader from "gl-shader";
import glGeometry from "gl-geometry";
import { mat4 } from "gl-matrix";
import isMobile from "is-mobile";
import canvasFit from "canvas-fit";

const canvas = document.body.appendChild(document.createElement("canvas"));
const gl = canvas.getContext("webgl");

// set canvas size to fill window and pixel density
var mobile = isMobile(navigator.userAgent);
var dpr = mobile ? 1 : window.devicePixelRatio || 1;
window.addEventListener("resize", canvasFit(canvas, null, dpr), false);

// setup matrices
var projection = mat4.create();
var model = mat4.create();
var view = mat4.create();

// setup shaders
import vertShader from "./shaders/vert.glsl";
import fragShader from "./shaders/frag.glsl";
var shader = createShader(gl, vertShader, fragShader);

// geometry
import ycam from "ycam";
var outline = glGeometry(gl);
outline.attr("aPosition", ycam.positions, { size: 2 });

// camera
import nscCamera from "nsc";
var cam = nscCamera(canvas, { position: [0, 0, -2] });

/* === UPDATE === */

function update() {
  // perspective projection
  var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
  var fieldOfView = Math.PI / 4.0;
  var near = 0.01;
  var far = 1000.0;
  mat4.perspective(projection, fieldOfView, aspectRatio, near, far);
  cam.update();
  cam.view(view);
}

/* === RENDER LOOP === */

function render(time) {
  update();

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  // clear
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // set blending
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  // bind shader program
  outline.bind(shader);
  if (isMobile) {
    shader.uniforms.dpr = dpr * 2.0;
  } else {
    shader.uniforms.dpr;
  }
  shader.uniforms.uPointSize = 1.0;
  shader.uniforms.uProjection = projection;
  shader.uniforms.uView = view;
  shader.uniforms.uModel = model;
  shader.uniforms.uColor = [0, 1, 1, 1];

  // draw geometry
  outline.draw(gl.LINE_LOOP);
  outline.unbind();

  // keep going
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
