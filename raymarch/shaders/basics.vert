#version 300 es

in vec3 position;

uniform float width;
uniform float height;

out vec2 uv;

void main() {
    // normalize coordinates so smaller side is [-1, 1]
    float aspect = width / height;
    if (aspect > 1.0)
        uv = vec2(position.x * aspect, position.y);
    else
        uv = vec2(position.x, position.y / aspect);
    gl_Position = vec4(position, 1.0);
}