
varying vec3 vPosition;

attribute vec3 neighbour0;
attribute vec3 neighbour1;
attribute vec3 neighbour2;
varying vec3 vNeighbour0;
varying vec3 vNeighbour1;
varying vec3 vNeighbour2;

void main() {
    vPosition = position;

    vNeighbour0 = neighbour0 - vPosition;
    vNeighbour1 = neighbour1 - vPosition;
    vNeighbour2 = neighbour2 - vPosition;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}