// scene_draw.js
// Draws processed scene instances onto a 2D canvas context

export function draw(ctx, instances) {
  for (const obj of instances) {
    ctx.save();

    const m = obj.transform.data;
    ctx.transform(m[0], m[1], m[3], m[4], m[6], m[7]);

    if (obj.style.fill) ctx.fillStyle = obj.style.fill;
    if (obj.style.stroke) ctx.strokeStyle = obj.style.stroke;
    if (obj.style.lineWidth) ctx.lineWidth = obj.style.lineWidth;

    switch (obj.type) {
      case "circle": {
        const [cx, cy] = obj.base.center;
        ctx.beginPath();
        ctx.arc(cx, cy, obj.base.radius, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        break;
      }

      case "polygon": {
        const pts = obj.base.vertices;
        ctx.beginPath();
        ctx.moveTo(pts[0][0], pts[0][1]);
        for (let i = 1; i < pts.length; i++) {
          ctx.lineTo(pts[i][0], pts[i][1]);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        break;
      }

      case "line": {
        ctx.beginPath();
        ctx.moveTo(obj.base.from[0], obj.base.from[1]);
        ctx.lineTo(obj.base.to[0], obj.base.to[1]);
        ctx.stroke();
        break;
      }

      case "text": {
        ctx.font = obj.base.font || "12px sans-serif";
        ctx.fillStyle = obj.style.fill || ctx.fillStyle;
        const txt = obj.textOverride || obj.base.text;
        ctx.fillText(txt, 0, 0);
        break;
      }
    }

    ctx.restore();
  }
}
