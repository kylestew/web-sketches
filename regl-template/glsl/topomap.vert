precision highp float;

attribute vec3 position;

varying vec4 screenPos;

void main() {
    gl_Position = vec4(position.xyz, 1.0);
    screenPos = gl_Position.xyzw;
}