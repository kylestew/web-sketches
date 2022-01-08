precision highp float;

// clang-format off
#pragma glslify: snoise4 = require(glsl-noise/simplex/4d);
// clang-format on

uniform float u_time;
uniform float u_amplitude;
uniform float u_frequency;

varying vec3 vEye;
varying vec3 vNormal;

void main() {
    float distortion = snoise4(vec4(normal * u_frequency, u_time)) * u_amplitude;
    vec3 newPosition = position + (normal * distortion);

    vec4 mvp = modelViewMatrix * vec4(newPosition, 1.0);

    vEye = normalize(mvp.xyz);
    vNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * mvp;
}