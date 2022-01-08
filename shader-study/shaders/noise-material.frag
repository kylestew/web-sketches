precision highp float;

uniform sampler2D u_matCapMap;

varying vec3 vEye;
varying vec3 vNormal;

void main(void) {
    // calc matcap coords
    vec3 r = reflect(vEye, vNormal);
    float m = 2.0 * sqrt(pow(r.x, 2.0) + pow(r.y, 2.0) + pow(r.z + 1.2, 2.0));
    vec2 vN = r.xy / m + 0.5;

    // lookup matcap
    vec3 mat = texture2D(u_matCapMap, vN).rgb;
    gl_FragColor = vec4(mat, 1.0);
}