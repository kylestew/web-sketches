#version 300 es

precision highp float;

in vec4 v_color;

out vec4 outColor;

void main() {
    float ambientStrength = 0.3;
    vec3 lightColor = vec3(1, 1, 1);
    vec3 ambient = ambientStrength * lightColor;

    vec4 result = vec4(ambient, 1.0) * v_color;

    outColor = result;
}