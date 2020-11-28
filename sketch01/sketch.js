global.THREE = require("three");

require("three/examples/js/controls/OrbitControls");

const Random = require("canvas-sketch-util/random");
// const glslify = require("glslify");
const canvasSketch = require("canvas-sketch");
const packSpheres = require("pack-spheres");
const risoColors = require("riso-colors");
const paperColors = require("paper-colors");

const settings = {
  animate: true,
  scaleToView: true,
  dimensions: [1440, 900],
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

  renderer.setClearColor(background, 1);

  const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 100);
  camera.position.set(2, 2, -4);
  camera.lookAt(new THREE.Vector3());
  const controls = new THREE.OrbitControls(camera, context.canvas);

  const scene = new THREE.Scene();

  // Geometry
  const geometry = new THREE.IcosahedronBufferGeometry(1, 3);
  const baseGeometry = new THREE.IcosahedronGeometry(1, 1);

  // For each face, provide the 3 neighbouring points to that face
  const neighbourCount = 3;
  // addNe

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

    const material = new THREE.MeshBasicMaterial({
      color: "red",
      wireframe: true,
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
        // mesh.material.uniforms.time.value = time;
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
