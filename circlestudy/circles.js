const circle1 = function (ctx, x, y, r) {
  ctx.beginPath();
  ctx.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
};

const circle2 = function (ctx, x, y, r) {
  ctx.lineWidth = 1;
  for (var i = 0; i < 2.0 * Math.PI; i += 0.0003) {
    const gray = randomInt(255);
    ctx.strokeStyle = `rgba(${gray}, ${gray}, ${gray}, 0.1)`;

    ctx.beginPath();
    ctx.moveTo(x, y);
    let x2 = x + r * Math.cos(i);
    let y2 = y + r * Math.sin(i);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
};

const circle4 = function (ctx, x, y, r) {
  /*
   * TODO: distribute density better
   */
  const hue = randomInt(360);
  const sw = 5;
  let i = r;
  let t = 0;
  while (i >= sw / 2) {
    const gray = randomInt(200);
    ctx.fillStyle = `rgba(${gray}, ${gray}, ${gray}, 0.1)`;

    ctx.beginPath();
    drawCircle(
      ctx,
      x + (i - sw / 2) * Math.cos(t),
      y + (i - sw / 2) * Math.sin(t),
      sw,
      sw
    );
    ctx.fill();

    i -= 0.01;
    t += 0.01;
  }
};

const randomGray = function (min, max, opacity = 1.0) {
  const gray = min + randomInt(max - min);
  return `rgba(${gray}, ${gray}, ${gray}, ${opacity})`;
};

const circle7 = function (ctx, x, y, r) {
  ctx.strokeStyle = "rgba(0, 0, 0, 0.2)";
  drawCircle(ctx, x, y, r, true);
  ctx.strokeStyle = "rgba(0, 0, 0, 0.02)";

  for (let n = 0; n < 10; n++) {
    let rt = Math.random() * 2.0 * Math.PI;
    for (let i = 0; i <= r; i += randomRange(0.5, 4)) {
      let cx = x + (r - i) * Math.cos(rt);
      let cy = y + (r - i) * Math.sin(rt);
      console.log(i, r, cx, cy);
      ctx.lineWidth = randomRange(1, 5);
      drawCircle(ctx, cx, cy, i, true);
    }
  }
};

module.exports = {
  circle1,
  circle2,
  circle4,
  circle7,
};
