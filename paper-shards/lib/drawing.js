module.exports.drawPoly = (context, poly) => {
  context.strokeStyle = poly.strokeStyle;
  context.beginPath();
  const pn = poly.pts.slice(-1)[0];
  context.moveTo(pn[0], pn[1]);
  for (var i = 0; i < poly.pts.length; ++i) {
    const pt = poly.pts[i];
    context.lineTo(pt[0], pt[1]);
  }
  context.stroke();
};
