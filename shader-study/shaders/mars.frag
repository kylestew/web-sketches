/* https://github.com/winkerVSbecks/sketchbook/blob/master/mars.js */

#extension GL_OES_standard_derivatives : enable

precision highp float;

uniform float time;
uniform float density;

varying vec2 vUv;

#define PI 3.141592653589793
// clang-format off
#pragma glslify: noise = require(glsl-noise/simplex/3d);
// clang-format on

float patternZebra(float v) {
    float d = 1.0 / density;
    float s = -cos(v / d * PI * 2.);
    float bob = fwidth(s);
    return smoothstep(.0, .1 * d, .1 * s / fwidth(s));
}

void main() {
    // generate noise data
    float amplitude = 1.0;
    float frequency = 1.5;
    float noiseValue = noise(vec3(vUv * frequency, time)) * amplitude;

    // convert noise data to rings
    float t = patternZebra(noiseValue);
    vec3 color = mix(vec3(1., 0.4, 0.369), vec3(0.824, 0.318, 0.369), t);

    // clip to circle
    float dist = length(vUv - vec2(0.5, 0.5));
    float alpha = smoothstep(0.250, 0.2482, dist);

    gl_FragColor = vec4(color, alpha);
}