global.THREE = require("three");

require("three/examples/js/controls/OrbitControls");

const Random = require("canvas-sketch-util/random");
const glslify = require("glslify");
const canvasSketch = require("canvas-sketch");
const packSpheres = require("pack-spheres");
const risoColors = require("riso-colors").map((h) => h.hex);
const paperColors = require("paper-colors").map((h) => h.hex);

const settings = {
  animate: true,
  fps: 60,
  duration: 10,

  scaleToView: true,
  dimensions: [1440 * 2, 900 * 2],
  context: "webgl",
  attributes: {
    antialias: true,
  },
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  const palette = Random.shuffle(risoColors).slice(0, 2);
  const backgroundHex = Random.pick(paperColors);
  const background = new THREE.Color(backgroundHex);

  console.log(backgroundHex, background);

  renderer.setClearColor(background, 1);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(2, 2, -4);
  camera.lookAt(new THREE.Vector3());
  const controls = new THREE.OrbitControls(camera, context.canvas);

  const scene = new THREE.Scene();

  // Geometry
  const geometry = new THREE.IcosahedronBufferGeometry(1, 5);
  const baseGeometry = new THREE.IcosahedronGeometry(1, 1);

  // For each face, provide the 3 neighbouring points to that face
  const neighbourCount = 3;
  addNeighbourAttributes(geometry, baseGeometry.vertices, neighbourCount);

  const bounds = 1.5;
  const spheres = packSpheres({
    sample: () => Random.insideSphere(),
    outside: (position, radius) => {
      new THREE.Vector3().fromArray(position).length() + radius >= bounds;
    },
    minRadius: () =>
      Math.max(0.05, 0.05 + Math.min(1.0, Math.abs(Random.gaussian(0, 0.1)))),
    maxCount: 20,
    packAttempts: 8000,
    bounds,
    maxRadius: 1.0,
    // minRadius: 0.35,
  });

  const meshes = spheres.map((sphere) => {
    const color0 = Random.pick(palette);
    console.log(color0);

    const material = new THREE.ShaderMaterial({
      extensions: {
        derivatives: true,
      },
      uniforms: {
        background: { value: new THREE.Color(background) },
        color: { value: new THREE.Color(color0) },
        pointColor: { value: new THREE.Color("black") },
        time: { value: 0 },
      },
      // wireframe: true,
      vertexShader: glslify("./shader.vert"),
      fragmentShader: glslify("./shader.frag"),
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.fromArray(sphere.position);
    mesh.scale.setScalar(sphere.radius);
    mesh.quaternion.fromArray(Random.quaternion());
    mesh.rotationSpeed = Random.gaussian() * 0.1;
    scene.add(mesh);
    return mesh;
  });

  // draw each frame
  return {
    // Handle resize events here
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    // Update & render your scene here
    render({ time, deltaTime }) {
      meshes.forEach((mesh) => {
        mesh.rotateOnWorldAxis(
          new THREE.Vector3(0, 1, 0),
          deltaTime * mesh.rotationSpeed
        );
        mesh.material.uniforms.time.value = time;
      });
      scene.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), 0.05 * deltaTime);
      controls.update();
      renderer.render(scene, camera);
    },
    // Dispose of events & renderer for cleaner hot-reloading
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);

function addNeighbourAttributes(
  bufferGeometry,
  baseVertices,
  neighbourCount = 3
) {
  if (bufferGeometry.getIndex()) {
    throw new Error(
      "This is only supported on un-indexed geometries right now."
    );
  }

  // We will give each triangle in the geometry N nearest neighbours
  const positionAttr = bufferGeometry.getAttribute("position");
  const vertexCount = positionAttr.count;

  // First let's build a little list of attribute names + vertex data
  const neighbourAttribs = [];
  for (let i = 0; i < neighbourCount; i++) {
    neighbourAttribs.push({
      name: `neighbour${i}`,
      data: [],
    });
  }

  // For each triangle
  for (let i = 0; i < vertexCount / 3; i++) {
    // Get the triangle centroid, we will use that for comparison
    const centroid = new THREE.Vector3();
    for (let c = 0; c < 3; c++) {
      const x = positionAttr.getX(i * 3 + c);
      const y = positionAttr.getY(i * 3 + c);
      const z = positionAttr.getZ(i * 3 + c);
      const vert = new THREE.Vector3(x, y, z);
      centroid.add(vert);
    }
    centroid.divideScalar(3);

    // Get the N nearest neighbours to the centroid
    const neighbours = getNearestNeighbours(
      centroid,
      baseVertices,
      neighbourCount
    );

    // Go through each neighbour and add its XYZ data in
    neighbours.forEach((n, i) => {
      // Repeat this 3 times so that we do it for each vertex
      // in the triangle
      for (let c = 0; c < 3; c++) {
        neighbourAttribs[i].data.push(...n.toArray());
      }
    });
  }

  // Now that we have flat arrays for each neighbour,
  // we add it into the buffer geometry
  neighbourAttribs.forEach((attrib) => {
    const array = new Float32Array(attrib.data);
    const buf = new THREE.BufferAttribute(array, 3);
    bufferGeometry.addAttribute(attrib.name, buf);
  });
}

// a simple but inefficient method to extract N
// nearest neighbours from a point with a given vertex list
function getNearestNeighbours(point, list, count) {
  // get distance squared from this point to all others
  const data = list
    // Avoid any that match the input point
    .filter((p) => p.point !== point)
    // Get an object with distance
    .map((other) => {
      return {
        distance: point.distanceToSquared(other),
        point: other,
      };
    });
  // sort by distance
  data.sort((a, b) => a.distance - b.distance);
  // return only N neighbours
  return data.slice(0, count).map((p) => p.point);
}
