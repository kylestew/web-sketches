#version 300 es

precision highp float;

in vec2 uv;

uniform vec3 eye;
uniform vec3 center;
uniform vec3 up;

uniform float time;

out vec4 outColor;

const int MAX_STEPS = 255;
const float SURFACE_DIST = 0.001;
const float MAX_DIST = 1000.0;

float distToSurf(vec3 p) {
    // float displacement = sin(5.0 * p.x) * sin(5.0 * p.y) * sin(5.0 * p.z) * 0.25;

    vec4 sphere = vec4(0, 0, 0, 1);  // w = rad
    float dS = length(p - sphere.xyz) - sphere.w;
    float dP = p.y + 1.0;
    float d = min(dS, dP);
    return d;
}

vec3 calcNormal(vec3 p) {
    const vec2 e = vec2(0.001, 0.0);
    vec3 n = vec3(distToSurf(p + e.xyy) - distToSurf(p - e.xyy),
                  distToSurf(p + e.yxy) - distToSurf(p - e.yxy),
                  distToSurf(p + e.yyx) - distToSurf(p - e.yyx));
    return normalize(n);
}

float ray_march(vec3 ro, vec3 rd) {
    float dO = 0.0;  // distance from origin
    for (int i = 0; i < MAX_STEPS; ++i) {
        vec3 p = ro + dO * rd;
        float dS = distToSurf(p);
        dO += dS;
        if (dS < SURFACE_DIST || dO > MAX_DIST) break;
    }
    return dO;
}

float shadePoint(vec3 p) {
    vec3 lightPos = vec3(0, 5, 0);
    lightPos.xz = vec2(sin(time), cos(time)) * 2.0;

    vec3 l = normalize(lightPos - p);
    vec3 n = calcNormal(p);
    float dif = clamp(dot(n, l), 0.0, 1.0);

    // shadows
    // TODO: don't understand this
    // hitPoint -> light
    float d = ray_march(p + n * SURFACE_DIST * 2.0, l);
    // is there something blocking the light?
    if (d < length(lightPos - p)) dif *= 0.1;

    return dif;
}

void main() {
    vec3 dir = normalize(vec3(uv, 1.0));

    // calc distance to surface
    float dO = ray_march(eye, dir);

    // convert to point where we hit the surface
    vec3 hitP = eye + dir * dO;

    // find diffuse shading at point
    float diffuse = shadePoint(hitP);
    vec3 col = vec3(diffuse);

    outColor = vec4(col, 1.0);
}