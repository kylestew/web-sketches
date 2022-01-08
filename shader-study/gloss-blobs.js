const canvasSketch = require("canvas-sketch");

global.THREE = require("three");
require("three/examples/js/controls/OrbitControls");

const vertexShader = require("./shaders/noise-material.vert");
const fragmentShader = require("./shaders/noise-material.frag");

const settings = {
  context: "webgl",
  dimensions: [1080, 1080],
  animate: true,
  duration: 12,
  fps: 50,
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    context,
  });
  renderer.setClearColor("#000", 1);

  const camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
  camera.position.set(0, 0, 8);
  camera.lookAt(new THREE.Vector3());
  const controls = new THREE.OrbitControls(camera, context.canvas);

  const scene = new THREE.Scene();

  const geometry = new THREE.IcosahedronGeometry(1, 64);

  const matCapMap = new THREE.TextureLoader().load(
    "textures/matcap-porcelain-white.jpeg"
  );

  const material = new THREE.ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms: {
      u_time: {
        type: "f",
        value: 0,
      },
      u_amplitude: {
        type: "f",
        value: 0.6,
      },
      u_frequency: {
        type: "f",
        value: 0.8,
      },
      u_matCapMap: {
        type: "t",
        value: matCapMap,
      },
    },
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
    render({ playhead }) {
      mesh.material.uniforms.u_time.value = playhead;
      controls.update();
      renderer.render(scene, camera);
    },
    unload() {
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
