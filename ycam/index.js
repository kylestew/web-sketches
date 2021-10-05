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
var outline, outlineExpanded, convexHull;
var triangles;
var projection = mat4.create();
var model = mat4.create();
var view = mat4.create();

/* === SETUP === */

function createGeometry(gl) {
  outline = glGeometry(gl);
  outline.attr("a_position", ycam.positions, { size: 2 });

  outlineExpanded = glGeometry(gl);
  var ycamExpanded = cga.expandPolygon2(ycam.positions, 0.05);
  outlineExpanded.attr("a_position", ycamExpanded, { size: 2 });

  convexHull = glGeometry(gl);
  convexHull.attr("aPosition", ycamExpanded, { size: 2 });
  convexHull.faces(cga.convexHull2(ycamExpanded));

  triangles = glGeometry(gl);
  triangles.attr("aPosition", ycam.positions, { size: 2 });
  triangles.faces(cga.triangulatePolygon2(ycam.positions));
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

function drawGeo(geo, mode, color) {
  geo.bind(shader);
  shader.uniforms.u_projectionMatrix = projection;
  shader.uniforms.u_viewMatrix = view;
  shader.uniforms.u_modelMatrix = model;
  shader.uniforms.u_color = color;
  geo.draw(mode);
  geo.unbind();
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

  drawGeo(outline, gl.LINE_LOOP, [0, 1, 1, 1]);
  drawGeo(outlineExpanded, gl.LINE_LOOP, [1, 0, 0, 1]);
  drawGeo(convexHull, gl.LINE_LOOP, [1, 1, 0, 1]);
  drawGeo(convexHull, gl.LINE_LOOP, [1, 1, 0, 1]);
  drawGeo(triangles, gl.LINE_LOOP, [1, 0, 1, 1]);

  // render loop
  requestAnimationFrame(render);
}

/* === START === */
setup();
if (gl) requestAnimationFrame(render);
