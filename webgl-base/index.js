import createShader from "gl-shader";
import { mat4 } from "gl-matrix";
import isMobile from "is-mobile";
import canvasFit from "canvas-fit";

import vertShader from "./shaders/vert.glsl";
import fragShader from "./shaders/frag.glsl";

var gl, shader, buffers;
var projectionMatrix = mat4.create();
var modelViewMatrix = mat4.create();

/* === SETUP === */

function initBuffers(gl) {
  // create plane geometry
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // define positions
  const positions = [-1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, -1.0];

  // pass positions to WebGL
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  return {
    position: positionBuffer,
  };
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
  buffers = initBuffers(gl);

  // set canvas size to fill window and pixel density
  var mobile = isMobile(navigator.userAgent);
  var dpr = mobile ? 1 : window.devicePixelRatio || 1;
  window.addEventListener("resize", canvasFit(canvas, null, dpr), false);
}

/* === UPDATE === */

function update() {
  // perspective projection
  var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
  var fieldOfView = Math.PI / 4.0;
  var near = 0.01;
  var far = 1000.0;
  mat4.perspective(projectionMatrix, fieldOfView, aspectRatio, near, far);

  // camera drawing position
  mat4.translate(modelViewMatrix, modelViewMatrix, [0.0, 0.0, -6.0]);
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

  // bind buffer and pass positions
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    shader.attributes.a_Position.location,
    2, // num components
    gl.FLOAT,
    false, // normalize
    0, // stride
    offset
  );
  gl.enableVertexAttribArray(shader.attributes.a_Position.location);

  // bind shader and pass uniforms
  gl.useProgram(shader.program);
  shader.uniforms.u_ProjectionMatrix = projectionMatrix;
  shader.uniforms.u_ModelViewMatrix = modelViewMatrix;

  // draw geometry
  const vertexCount = 4;
  gl.drawArrays(gl.TRIANGLE_STRIP, offset, vertexCount);

  // render loop
  // requestAnimationFrame(render);
}

/* === START === */
setup();
if (gl) requestAnimationFrame(render);
