const canvasSketch = require("canvas-sketch");

global.THREE = require("three");

require("three/examples/js/postprocessing/EffectComposer.js");
require("three/examples/js/postprocessing/RenderPass.js");
require("three/examples/js/postprocessing/ShaderPass.js");
require("three/examples/js/shaders/CopyShader.js");

const vertShader = require("./shaders/blob.vert");
const fragShader = require("./shaders/blob.frag");

const settings = {
  context: "webgl",
  dimensions: [720, 720],
  animate: true,
  attributes: { antialias: true },
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    context,
  });
  renderer.setClearColor("#000", 1);

  const composer = new THREE.EffectComposer(renderer);

  const camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
  camera.position.set(0, 0, 8);
  camera.lookAt(new THREE.Vector3());

  const scene = new THREE.Scene();

  const geometry = new THREE.IcosahedronGeometry(1, 64);

  const material = new THREE.ShaderMaterial({
    vertexShader: vertShader,
    fragmentShader: fragShader,
    uniforms: {
      time: {
        type: "f",
        value: 0,
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
    render({ time }) {
      mesh.material.uniforms.time.value = time;
      renderer.render(scene, camera);
    },
    unload() {
      renderer.dispose();
    },
  };
};

canvasSketch(sketch, settings);
