precision highp float;

in vec3 vOrigin;
in vec3 vDirection;

out vec4 color;

void main(){
    // raymarching ALGO?
    https://github.com/mrdoob/three.js/blob/master/examples/webgl2_volume_perlin.html

    vec3 rayDir = normalize(vDirection);

    color = vec4(rayDir, 1);
}