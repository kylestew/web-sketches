import createShader from "gl-shader";
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

/* === UPDATE === */

function update() {
  // perspective projection
  var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
  var fieldOfView = Math.PI / 4.0;
  var near = 0.01;
  var far = 1000.0;
  mat4.perspective(projection, fieldOfView, aspectRatio, near, far);
}

/* === RENDER LOOP === */

function render(time) {
  update();

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  // clear
  gl.clearColor(0.0, 1.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // set blending
  gl.disable(gl.DEPTH_TEST);
  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

  // TODO: render something!

  // keep going
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
