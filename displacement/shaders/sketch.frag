varying vec2 vUv;
varying vec3 vNormal;
varying float vNoise;

void main() {

  vec3 color = vNormal * 0.5 + 0.5;
  gl_FragColor = vec4(color * (1.0 - 2.0 * vNoise), 1.0);

  // gl_FragColor = vec4( vNormal * 0.5 + 0.5, 1.0);
  // gl_FragColor = vec4( vec3( vUv, 0. ), 1. );

}