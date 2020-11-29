#pragma glslify: aastep = require('glsl-aastep');
#pragma glslify: noise = require('glsl-noise/simplex/4d.glsl');

uniform vec3 color;
uniform vec3 pointColor;
uniform vec3 background;
uniform float time;

uniform mat4 modelMatrix;

varying vec3 vPosition;
varying vec3 vNeighbour0;
varying vec3 vNeighbour1;
varying vec3 vNeighbour2;

float sphereRim(vec3 spherePosition) {
    vec3 normal = normalize(spherePosition.xyz);
    vec3 worldNormal = normalize(mat3(modelMatrix) * normal.xyz);
    vec3 worldPosition = (modelMatrix * vec4(spherePosition, 1.0)).xyz;
    vec3 V = normalize(cameraPosition - worldPosition);
    float rim = 1.0 - max(dot(V, worldNormal), 0.0);
    return pow(smoothstep(0.0, 1.0, rim), 0.5);
}

void main() {
    // Find the smallest distance of the 3 neighbours
    float d0 = dot(vNeighbour0, vNeighbour0);
    float d1 = dot(vNeighbour1, vNeighbour1);
    float d2 = dot(vNeighbour2, vNeighbour2);
    float dist = sqrt(min(d0, min(d1, d2)));

    // use the first (closest) neighbour to create the noise offset
    vec3 curNeighbour = vNeighbour0;

    float pointOff = noise(vec4(vPosition + vNeighbour0.xyz, time * 0.5));
    float pointSize = max(0.0, 0.05 + 0.2 * pointOff);
    float inside = 1.0 - aastep(pointSize, dist);

    vec3 fragColor = mix(color, pointColor, inside);

    float rim = sphereRim(vPosition);
    fragColor += (1.0 - rim) * color * 0.25;

    float stroke = aastep(0.9, rim);
    fragColor = mix(fragColor, background, stroke);

    gl_FragColor = vec4(fragColor, 1.0);
}