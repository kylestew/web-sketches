#version 300 es

in vec3 position;

out vec2 pos;

void main() {
    // TODO: fix aspect ratio
    pos = position.xy;
    // vUV = vec2((position.x + 1.0) / 2.0, (position.y + 1.0) / 2.0);

    gl_Position = vec4(position, 1.0);
}