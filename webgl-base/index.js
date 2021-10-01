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
  // define positions buffer
  const positions = [
    // Front face
    -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0,

    // Back face
    -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0, -1.0,

    // Top face
    -1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0,

    // Bottom face
    -1.0, -1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, -1.0, -1.0, 1.0,

    // Right face
    1.0, -1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0,

    // Left face
    -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, -1.0,
  ];

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const faceColors = [
    [1.0, 1.0, 1.0, 1.0], // Front face: white
    [1.0, 0.0, 0.0, 1.0], // Back face: red
    [0.0, 1.0, 0.0, 1.0], // Top face: green
    [0.0, 0.0, 1.0, 1.0], // Bottom face: blue
    [1.0, 1.0, 0.0, 1.0], // Right face: yellow
    [1.0, 0.0, 1.0, 1.0], // Left face: purple
  ];

  // Convert the array of colors into a table for all the vertices.
  var colors = [];
  for (var j = 0; j < faceColors.length; ++j) {
    const c = faceColors[j];

    // Repeat each color four times for the four vertices of the face
    colors = colors.concat(c, c, c, c);
  }

  const colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

  // This array defines each face as two triangles, using the
  // indices into the vertex array to specify each triangle's
  // position.
  const indices = [
    0,
    1,
    2,
    0,
    2,
    3, // front
    4,
    5,
    6,
    4,
    6,
    7, // back
    8,
    9,
    10,
    8,
    10,
    11, // top
    12,
    13,
    14,
    12,
    14,
    15, // bottom
    16,
    17,
    18,
    16,
    18,
    19, // right
    20,
    21,
    22,
    20,
    22,
    23, // left
  ];
  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  return {
    position: positionBuffer,
    color: colorBuffer,
    indices: indexBuffer,
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

var prevTime = 0.0;
var cubeRotation = 0.0;

function update(deltaTime) {
  // perspective projection
  var aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
  var fieldOfView = Math.PI / 4.0;
  var near = 0.01;
  var far = 1000.0;
  mat4.perspective(projectionMatrix, fieldOfView, aspectRatio, near, far);

  // camera drawing position
  cubeRotation += deltaTime;
  mat4.translate(modelViewMatrix, mat4.create(), [0.0, 0.0, -6.0]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation, [0, 0, 1]);
  mat4.rotate(modelViewMatrix, modelViewMatrix, cubeRotation * 0.7, [0, 1, 0]);
}

/* === RENDER LOOP === */

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

  // bind buffer and pass positions
  const offset = 0;
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
  gl.vertexAttribPointer(
    shader.attributes.a_position.location,
    3, // num components
    gl.FLOAT,
    false, // normalize
    0, // stride
    offset
  );
  gl.enableVertexAttribArray(shader.attributes.a_position.location);
  // pass colors
  gl.bindBuffer(gl.ARRAY_BUFFER, buffers.color);
  gl.vertexAttribPointer(
    shader.attributes.a_color.location,
    4, // num components
    gl.FLOAT,
    false, // normalize
    0, // stride
    offset
  );
  gl.enableVertexAttribArray(shader.attributes.a_color.location);
  // pass indices
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.indices);

  // bind shader and pass uniforms
  gl.useProgram(shader.program);
  shader.uniforms.u_projectionMatrix = projectionMatrix;
  shader.uniforms.u_modelViewMatrix = modelViewMatrix;

  // draw geometry
  const vertexCount = 36;
  gl.drawElements(gl.TRIANGLES, vertexCount, gl.UNSIGNED_SHORT, 0);

  // render loop
  requestAnimationFrame(render);
}

/* === START === */
setup();
if (gl) requestAnimationFrame(render);
