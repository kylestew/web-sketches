global.THREE = require("three");

require("three/examples/js/controls/OrbitControls");

const canvasSketch = require("canvas-sketch");

const settings = {
  context: "webgl",
  animate: true,
};

const onBeforeCompile = (shader) => {
  shader.fragmentShader =
    [
      // "varying float intensity;",
      "vec3 cosPalette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {",
      "\treturn a + b * cos(6.28318 * (c * t + d));",
      "}\n",
    ].join("\n") + shader.fragmentShader;
  shader.fragmentShader = shader.fragmentShader.replace(
    `vec4 diffuseColor = vec4( diffuse, opacity );`,
    `\nvec3 brightness = vec3(0.5, 0.5, 0.5);
      \nvec3 contrast = vec3(0.5, 0.5, 0.5);
      \nvec3 oscilation = vec3(1.0, 1.0, 1.0);
      \nvec3 phase = vec3(0.2, 0.1, 0.0);
      \nvec3 color = cosPalette(1.0, brightness, contrast, oscilation, phase);
      \n vec4 diffuseColor = vec4(color, 1.0);`
  );
};

const sketch = ({ context }) => {
  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas,
  });

  renderer.setClearColor("#fff", 1);

  const camera = new THREE.PerspectiveCamera(28, 1, 0.01, 100);
  camera.position.set(-8, 0.5, 8);
  camera.lookAt(new THREE.Vector3());

  const controls = new THREE.OrbitControls(camera, context.canvas);

  const scene = new THREE.Scene();

  const ambientLight = new THREE.AmbientLight(0x000000);
  scene.add(ambientLight);

  const light1 = new THREE.PointLight(0xffffff, 1, 0);
  light1.position.set(0, 200, 0);
  scene.add(light1);

  // const light2 = new THREE.PointLight(0xffffff, 1, 0);
  // light2.position.set(100, 200, 100);
  // scene.add(light2);

  // const light3 = new THREE.PointLight(0xffffff, 1, 0);
  // light3.position.set(-100, -200, -100);
  // scene.add(light3);

  const geometry = new THREE.SphereGeometry(1.8, 128, 128);

  const material = new THREE.MeshPhysicalMaterial({
    color: 0x444444,
    metalness: 0.0,
    roughness: 0.3,
    onBeforeCompile: onBeforeCompile,
  });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

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
    render({ time }) {
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
