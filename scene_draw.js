/* 
=== DevTrack: File Update Plan Tracker ===

✅ Phase Checklist:
1. ✔ Button functionality + matrix display
2. ☐ Y-axis label upright orientation
3. ☐ Full-screen coordinate axes (with padded auto-scaling)
4. ☐ Tick marks at regular intervals with numerical labels
5. ☐ Ensure RT and TR transformations land triangle on same coordinates

🔁 Files to cycle through for current phase:
- [✔] descriptor.html
- [✔] matrix.js
- [✔] scene_draw.js
- [ ] scene_descriptor.js
- [ ] read.js

Update Notes:
- Applied canvas Y-axis flip with text orientation correction.
- Repositioned text labels to prevent upside-down rendering.
*/

export function draw(ctx, instances) {
  ctx.save();

  // Set origin to center, flip Y for mathematical axis orientation
  ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);
  ctx.scale(50, -50);

  for (const obj of instances) {
    ctx.save();

    const m = obj.transform.data;
    ctx.transform(m[0], m[3], m[1], m[4], m[2], m[5]);

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
        ctx.scale(1, -1); // Re-invert text so it’s readable
        ctx.font = obj.base.font || "12px sans-serif";
        ctx.fillStyle = obj.style.fill || ctx.fillStyle;
        const txt = obj.textOverride || obj.base.text;
        ctx.fillText(txt, 0, -0.1); // Small Y-offset tweak for alignment
        break;
      }
    }

    ctx.restore();
  }

  ctx.restore();
}
