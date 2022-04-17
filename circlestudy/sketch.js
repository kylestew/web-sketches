const canvasSketch = require("canvas-sketch");
const colors = require("riso-colors");
const { randomInt, randomRange } = require("../snod/random");
const { randomInArray } = require("../snod/arrays");
const { linspace } = require("../snod/math");
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
const primary = randomInArray(colors);

const genCircleMatt = (count, rotations) => {
  // angle
  const thetas = linspace(0, 2 * Math.PI * rotations, count, true);
  // distance from center
  // let's vary that density baby
  const radii = linspace(0, 1, count, true).map((val) => -val * val + 1);
  // const radii = linspace(0, 1, count, true).map((val) => Math.log(val + 1));

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
    let count = parseInt(randomRange(9000, 24000));
    let circs = genCircleMatt(count, 1024);

    // remove some

    circs.forEach((circ) => {
      // vary monochrome opacity
      const opacity = parseInt(randomRange(1, 120));
      const hex = primary.hex + opacity.toString(16);
      context.fillStyle = hex;

      // vary radii
      let r = randomRange(0.004, 0.018);

      draw.circle(context, circ, r);
    });
  };
};

canvasSketch(sketch, settings);
