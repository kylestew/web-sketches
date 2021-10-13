import { downloadMeshes, initMeshBuffers } from "webgl-obj-loader";
import createShader from "gl-shader";
import { mat4, vec3 } from "gl-matrix";

import vertShader from "./shaders/vert.glsl";
import fragShader from "./shaders/frag.glsl";

var gl, canvas, shader;
var sphereObject;
var dragonObject;
var camera = {
  fieldOfView: 1.22,
  near: 0.01,
  far: 100.0,
  // verticalAngle: 0.4,
  // horizontalAngle: 0.7,
  distance: 3.0,
  view: mat4.create(),
  projection: mat4.create(),
  updatePerspective: function (aspectRatio) {
    this.projection = mat4.perspective(
      this.projection,
      this.fieldOfView,
      aspectRatio,
      this.near,
      this.far
    );
  },
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

function createSphere() {
  var object = {};
  object.model = mat4.create();

  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  var vertices = [(0, 0), (0, 0)];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

  var indexBuffer = gl.createBuffer();

  return object;
}

function init(meshes) {
  // get a WebGL context
  canvas = document.getElementById("gl-canvas");
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  // camera setup
  var aspectRatio = canvas.clientWidth / canvas.clientHeight;
  camera.updatePerspective(aspectRatio);

  // setup shaders
  shader = createShader(gl, vertShader, fragShader);

  // initialize objects
  // dragonObject = initObject(meshes.dragon);
  sphereObject = createSphere();

  if (gl) requestAnimationFrame(render);
}

/* === UPDATE === */

function update(time) {
  // resize the canvas and the proj matrix if needed
  if (
    canvas.width != canvas.clientWidth ||
    canvas.height != canvas.clientHeight
  ) {
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    var aspectRatio = canvas.clientWidth / canvas.clientHeight;
    camera.updatePerspective(aspectRatio);
  }

  // camera view matrix (position and direction)
  // TODO: put in camera model
  mat4.lookAt(
    camera.view,
    vec3.fromValues(-camera.distance, camera.distance, camera.distance),
    vec3.fromValues(0, 0, 0),
    vec3.fromValues(0, 1, 0)
  );

  // // rotate model
  // mat4.rotate(
  //   dragonObject.model,
  //   mat4.create(),
  //   time * 0.0001,
  //   vec3.fromValues(-0.333, 1, 0.333)
  // );
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

  // renderObject(dragonObject);

  // render loop
  requestAnimationFrame(render);
}

/* === START === */
window.onload = function () {
  init({});
  // downloadMeshes({ dragon: "models/cube.obj" }, init);
  // downloadMeshes({ dragon: "models/dragon.obj" }, init);
};
