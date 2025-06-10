// sceneDraw.js
// Draws processed scene instances onto a 2D canvas context
// Assumes each object has a transform matrix, style, and base definition

export function draw(ctx, instances) {
  for (const obj of instances) {
    ctx.save();

    // Apply transform matrix to context
    const m = obj.transform;
    ctx.transform(m.data[0], m.data[1], m.data[3], m.data[4], m.data[6], m.data[7]);

    // Apply styling
    if (obj.style.fill) ctx.fillStyle = obj.style.fill;
    if (obj.style.stroke) ctx.strokeStyle = obj.style.stroke;
    if (obj.style.lineWidth) ctx.lineWidth = obj.style.lineWidth;

    // Draw based on primitive type
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

      case "curve": {
        const f = obj.base.parametric;
        const steps = f.steps || 100;
        const tmin = f.tmin;
        const tmax = f.tmax;
        const dt = (tmax - tmin) / steps;

        ctx.beginPath();
        for (let i = 0; i <= steps; i++) {
          const t = tmin + i * dt;
          const x = eval(f.x);
          const y = eval(f.y);
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
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
