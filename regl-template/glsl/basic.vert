precision highp float;

attribute vec3 position;

uniform float angle;

void main() {
    gl_Position = vec4(position.xyz, 1);

    // vec2 pos = vec2(cos(angle) * position.x + sin(angle) * position.y,
    //                 -sin(angle) * position.x + cos(angle) * position.y);
    // gl_Position = vec4(pos, 0, 1);
}