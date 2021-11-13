global.THREE = require("three");
const glslify = require("glslify");
const path = require("path");

require("three/examples/js/controls/OrbitControls");
// require("three/examples/js/math/ImprovedNoise");

const canvasSketch = require("canvas-sketch");

const settings = {
  context: "webgl2",
  animate: true,
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });
  renderer.setClearColor("#000", 1);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.set(1, 1, 2);
  camera.lookAt(new THREE.Vector3());

  const controls = new THREE.OrbitControls(camera, context.canvas);

  // TODO: some fancy texture shit
  //...

  // box volume
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const vertexShader = glslify(path.resolve(__dirname, "./volume.vert"));
  const fragmentShader = glslify(path.resolve(__dirname, "./volume.frag"));
  const material = new THREE.RawShaderMaterial({
    glslVersion: THREE.GLSL3,
    vertexShader,
    fragmentShader,
    side: THREE.BackSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);
      camera.aspect = viewportWidth / viewportHeight;
      camera.updateProjectionMatrix();
    },
    render({ time }) {
      controls.update();
      renderer.render(scene, camera);
    },
    unload() {
      controls.dispose();
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
