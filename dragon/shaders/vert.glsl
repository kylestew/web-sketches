#version 300 es

in vec3 a_position;
// in vec4 a_color;

uniform mat4 u_modelView;
uniform mat4 u_projection;

out vec4 v_color;

void main() {
    gl_Position = u_projection * u_modelView * vec4(a_position, 1.0);
    // v_color = a_color;
    v_color = vec4(1, 0, 1, 1);
}