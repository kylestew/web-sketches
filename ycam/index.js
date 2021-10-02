import createShader from "gl-shader";
import glGeometry from "gl-geometry";
import { mat4 } from "gl-matrix";
import isMobile from "is-mobile";
import canvasFit from "canvas-fit";

import ycam from "ycam";
import nsc from "nsc";
import cga from "cga";

import vertShader from "./shaders/vert.glsl";
import fragShader from "./shaders/frag.glsl";

var gl, shader;
var camera;
var outline;
var projection = mat4.create();
var model = mat4.create();
var view = mat4.create();

/* === SETUP === */

function createGeometry(gl) {
  outline = glGeometry(gl);
  outline.attr("a_position", ycam.positions, { size: 2 });
}

function setup() {
  // get a WebGL context
  const canvas = document.body.appendChild(document.createElement("canvas"));
  gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  // setup shaders
  shader = createShader(gl, vertShader, fragShader);

  // create geometry
  createGeometry(gl);

  // set canvas size to fill window and pixel density
  var mobile = isMobile(navigator.userAgent);
  var dpr = mobile ? 1 : window.devicePixelRatio || 1;
  window.addEventListener("resize", canvasFit(canvas, null, dpr), false);

  // camera
  camera = nsc(canvas, { position: [0, 0, -2] });
}

/* === UPDATE === */

var prevTime = 0.0;

function update(deltaTime) {
  // perspective projection
  var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
  var fieldOfView = Math.PI / 4.0;
  var near = 0.01;
  var far = 1000.0;
  mat4.perspective(projection, fieldOfView, aspectRatio, near, far);

  // camera drawing position
  camera.update();
  camera.view(view);
}

/* === RENDER LOOP === */

function draw() {
  outline.bind(shader);
  shader.uniforms.u_projectionMatrix = projection;
  shader.uniforms.u_viewMatrix = view;
  shader.uniforms.u_modelMatrix = model;
  outline.draw(gl.LINE_LOOP);
  outline.unbind();
}

function render(time) {
  time *= 0.001; // convert to seconds
  const deltaTime = time - prevTime;
  prevTime = time;

  update(deltaTime);

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  // clear
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  draw();

  // render loop
  requestAnimationFrame(render);
}

/* === START === */
setup();
if (gl) requestAnimationFrame(render);