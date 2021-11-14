global.THREE = require("three");

require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");
const vertShader = require("./shaders/sketch.vert");
const fragShader = require("./shaders/sketch.frag");

const settings = {
  context: "webgl",
  animate: true,
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  renderer.setClearColor("#000", 1);

  const camera = new THREE.PerspectiveCamera(30, 1, 1, 1000);
  camera.position.set(0, 0, 100);
  camera.lookAt(new THREE.Vector3());

  const controls = new THREE.OrbitControls(camera, context.canvas);

  const scene = new THREE.Scene();

  const geometry = new THREE.IcosahedronGeometry(20, 20);

  const material = new THREE.ShaderMaterial({
    vertexShader: vertShader,
    fragmentShader: fragShader,
    // color: 0xb7ff00,
    // wireframe: true,
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
