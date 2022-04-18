const canvasSketch = require("canvas-sketch");
const colors = require("riso-colors");
const { randomInt, randomRange } = require("../snod/random");
const { randomInArray } = require("../snod/arrays");
const { linspace } = require("../snod/math");
const { luminosity, hexToRGB } = require("../snod/color");
const draw = require("../snod/draw");

const settings = {
  dimensions: [2048, 2048],
};

/*
Generate:
+ Phylotaxi (current)
+ Random in unit circle (vary random distributions)

Vary:
+ Density (control function, skip some)
+ Color (grayscale, in scheme)
+ Radii (individual discs)

Disturb:
+ Offset disc positions
+ Attractor / repulsors

Multiple Circles:
+ Overlay
+ Vary Colors

*/

const background = randomInArray(colors);
// try to ensure enough contrast between colors
let primary = randomInArray(colors);
while (
  Math.abs(
    luminosity(hexToRGB(background.hex)) - luminosity(hexToRGB(primary.hex))
  ) < 0.3
) {
  primary = randomInArray(colors);
}

const densityShapingFn = () => {
  const rand = Math.random();
  if (rand < 0.4) {
    return (x) => -x * x + 1;
  } else if (rand < 0.6) {
    return (x) => -x * x * x + 1;
  } else if (rand < 0.8) {
    return (x) => -x * x * x * x + 1;
  }
  return (x) => x;
};

const genCircleMatt = (count, rotations) => {
  // angle
  const thetas = linspace(0, 2 * Math.PI * rotations, count, true);

  // distance from center
  let radii = linspace(0, 1, count, true);

  // shape the radial density
  radii = radii.map(densityShapingFn());

  return thetas.map((theta, i) => {
    const r = radii[i];
    return [Math.cos(theta) * r, Math.sin(theta) * r];
  });
};

const sketch = () => {
  return ({ context, width, height }) => {
    context.fillStyle = background.hex;
    context.fillRect(0, 0, width, height);

    // normalize canvas to [-1, 1]
    context.translate(width / 2, height / 2);
    context.scale(width / 2, width / 2);
    // add some padding
    context.scale(0.8, 0.8);

    // gen discs in circle
    let count = parseInt(randomRange(3200, 32000));
    // let count = 20000;
    let rotations = parseInt(randomRange(32, 512));
    let circs = genCircleMatt(count, rotations);

    // randomly remove some
    let dice = Math.random() * 0.1;
    circs = circs.filter((_) => Math.random() > dice);

    circs.forEach((circ) => {
      // vary monochrome opacity
      const opacity = parseInt(
        randomRange(randomRange(0, 20), randomRange(80, 164))
      );
      const hex = primary.hex + opacity.toString(16);
      context.fillStyle = hex;

      // vary radii
      let r = randomRange(randomRange(0.002, 0.006), randomRange(0.012, 0.022));

      draw.circle(context, circ, r);
    });
  };
};

canvasSketch(sketch, settings);
