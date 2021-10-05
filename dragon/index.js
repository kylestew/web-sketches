import { downloadMeshes, initMeshBuffers } from "webgl-obj-loader";
import createShader from "gl-shader";
import { mat4, vec3 } from "gl-matrix";
import isMobile from "is-mobile";
import canvasFit from "canvas-fit";

import vertShader from "./shaders/vert.glsl";
import fragShader from "./shaders/frag.glsl";

var gl, shader;
var dragonObject;
var camera = {
  verticalAngle: 0.4,
  horizontalAngle: 0.7,
  distance: 2.0,
  view: mat4.create(),
  projection: mat4.create(),
};

/* === SETUP === */

function initObject(mesh) {
  var object = {};
  object.model = mat4.create();

  initMeshBuffers(gl, mesh);
  object.vertexBuffer = mesh.vertexBuffer;
  // object.UVBuffer = mesh.textureBuffer;
  object.indexBuffer = mesh.indexBuffer;
  // object.normalBuffer = mesh.normalBuffer;

  return object;
}

function init(meshes) {
  // get a WebGL context
  const canvas = document.body.appendChild(document.createElement("canvas"));
  gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  // set canvas size to fill window and pixel density
  var mobile = isMobile(navigator.userAgent);
  var dpr = mobile ? 1 : window.devicePixelRatio || 1;
  window.addEventListener("resize", canvasFit(canvas, null, dpr), false);

  // camera setup
  var fieldOfView = 1.22;
  var aspectRatio = canvas.clientWidth / canvas.clientHeight;
  var near = 0.01;
  var far = 100.0;
  mat4.perspective(camera.projection, fieldOfView, aspectRatio, near, far);

  // setup shaders
  shader = createShader(gl, vertShader, fragShader);

  // initialize objects
  dragonObject = initObject(meshes.dragon);

  if (gl) requestAnimationFrame(render);
}

/* === UPDATE === */

function update(time) {
  // camera drawing position
  // truck the camera back
  // mat4.translate(camera.view, camera.view, vec3.fromValues(0, 1, -4));
  mat4.lookAt(
    camera.view,
    vec3.fromValues(-camera.distance, camera.distance, camera.distance),
    vec3.fromValues(0, 0, 0),
    vec3.fromValues(0, 1, 0)
  );

  // TODO: keep it looking at the center of the scene

  // cubeRotation += deltaTime;
  // mat4.translate(modelViewMatrix, mat4.create(), [0.0, 0.0, -6.0]);
  // mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 0, 1]);
  // mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.7, [0, 1, 0]);
}

/* === RENDER LOOP === */

function printMatrix(mat) {
  console.log(mat[0], mat[4], mat[8], mat[12]);
  console.log(mat[1], mat[5], mat[9], mat[13]);
  console.log(mat[2], mat[6], mat[10], mat[14]);
  console.log(mat[3], mat[7], mat[11], mat[15]);
}

function renderObject(object) {
  // prepare the model view matrix by combining camera view and model position
  var modelView = mat4.create();
  mat4.multiply(modelView, camera.view, object.model);

  // bind shader and pass uniforms
  gl.useProgram(shader.program);
  shader.uniforms.u_projection = camera.projection;
  shader.uniforms.u_modelView = modelView;

  // attributes
  gl.bindBuffer(gl.ARRAY_BUFFER, object.vertexBuffer);
  gl.vertexAttribPointer(object.vertexAttribLocation, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(object.vertexAttribLocation);

  // draw
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, object.indexBuffer);
  gl.drawElements(
    gl.TRIANGLES,
    object.indexBuffer.numItems,
    gl.UNSIGNED_SHORT,
    0
  );

  gl.useProgram(null);
}

function render(time) {
  update(time);

  gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

  // clear
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clearDepth(1.0); // Clear everything
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL); // Near things obscure far things
  gl.cullFace(gl.BACK);
  gl.frontFace(gl.CCW);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  renderObject(dragonObject);

  // render loop
  // requestAnimationFrame(render);
}

/* === START === */
window.onload = function () {
  downloadMeshes({ dragon: "models/cube.obj" }, init);
};
