const canvasSketch = require("canvas-sketch");

const settings = {
  dimensions: [2048, 2048],
  animate: true,
};

const GROWTH_DIST = 0.001;

let node = {
  prev: [],
  pos: [0, 0],
  rad: 0.02,
  angle: 0,

  update: function () {
    if (this.rad <= 0) return;

    this.prev.push({
      pos: this.pos,
      rad: this.rad,
    });

    let [x, y] = this.pos;
    x += GROWTH_DIST * Math.cos(this.angle);
    y += GROWTH_DIST * Math.sin(this.angle);
    this.pos = [x, y];

    this.rad -= 0.00002;

    this.angle += (Math.random() - 0.5) * 0.2;
  },
};

const sketch = () => {
  return ({ context: ctx, width, height }) => {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, width, height);

    // normalize canvas
    const scale = width / 2.0;
    ctx.translate(width / 2, height / 2);
    ctx.scale(scale, scale);
    ctx.lineWidth = 4.0 / scale;

    const renderNode = (node) => {
      node.prev.forEach((pt) => {
        ctx.beginPath();
        let [x, y] = pt.pos;
        ctx.arc(x, y, pt.rad, 0, 2 * Math.PI, false);
        ctx.fillStyle = "black";
        ctx.fill();
        // ctx.stroke();
      });
    };

    node.update();
    renderNode(node);
  };
};

canvasSketch(sketch, settings);
