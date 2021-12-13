precision highp float;

#pragma glslify: noise = require(glsl-noise/simplex/3d)

varying vec4 screenPos;

uniform float time;

void main() {
  float brightness = noise(vec3(screenPos.xy, time));

  gl_FragColor = vec4(vec3(brightness), 1.);
}