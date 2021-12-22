global.THREE = require("three");

const canvasSketch = require("canvas-sketch");
const vertShader = require("./shaders/sketch.vert");
const fragShader = require("./shaders/sketch.frag");

const settings = {
  context: "webgl",
  dimensions: [512, 512],
  animate: true,
  attributes: { antialias: true },
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    context,
  });
  renderer.setClearColor("#fff", 1);

  const camera = new THREE.PerspectiveCamera(45, 1, 1, 1000);
  camera.position.set(0, 0, 200);
  camera.lookAt(new THREE.Vector3());

  const scene = new THREE.Scene();

  const geometry = new THREE.IcosahedronGeometry(64, 64);

  const material = new THREE.ShaderMaterial({
    vertexShader: vertShader,
    fragmentShader: fragShader,
    uniforms: {
      time: {
        type: "f",
        value: 1.23,
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
