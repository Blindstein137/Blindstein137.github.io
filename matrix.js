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
- [ ] scene_draw.js
- [ ] scene_descriptor.js
- [ ] read.js

Update Notes:
- No changes needed for Phase 2; logic is math-only and independent of canvas drawing.
*/

export class Mat3 {
  constructor(data) {
    this.data = data;
  }

  static identity() {
    return new Mat3([1, 0, 0, 0, 1, 0]);
  }

  static translate([x, y]) {
    return new Mat3([1, 0, x, 0, 1, y]);
  }

  static scale2([sx, sy]) {
    return new Mat3([sx, 0, 0, 0, sy, 0]);
  }

  static rotate(theta) {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return new Mat3([c, -s, 0, s, c, 0]);
  }

  mul(b) {
    const a = this.data;
    const m = b.data;
    const r = new Array(6);

    r[0] = a[0] * m[0] + a[1] * m[3];
    r[1] = a[0] * m[1] + a[1] * m[4];
    r[2] = a[0] * m[2] + a[1] * m[5] + a[2];

    r[3] = a[3] * m[0] + a[4] * m[3];
    r[4] = a[3] * m[1] + a[4] * m[4];
    r[5] = a[3] * m[2] + a[4] * m[5] + a[5];

    return new Mat3(r);
  }

  toString() {
    const d = this.data.map(n => n.toFixed(2));
    return (
      `⎡ ${d[0]} ${d[1]} ${d[2]} ⎤\n` +
      `⎣ ${d[3]} ${d[4]} ${d[5]} ⎦`
    );
  }
}
