// matrix.js
// Provides 3x3 matrix operations for 2D affine transforms

export class Mat3 {
  constructor(data) {
    this.data = data;
  }

  static identity() {
    return new Mat3([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    ]);
  }

  static translate([tx, ty]) {
    return new Mat3([
      1, 0, tx,
      0, 1, ty,
      0, 0, 1
    ]);
  }

  static scale2([sx, sy]) {
    return new Mat3([
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1
    ]);
  }

  static rotate(theta) {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return new Mat3([
      c, -s, 0,
      s,  c, 0,
      0,  0, 1
    ]);
  }

  mul(other) {
    const a = this.data;
    const b = other.data;
    const r = new Array(9);

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        r[3 * row + col] =
          a[3 * row + 0] * b[0 + col] +
          a[3 * row + 1] * b[3 + col] +
          a[3 * row + 2] * b[6 + col];
      }
    }
    return new Mat3(r);
  }

  toString(precision = 2) {
    const fmt = x => x.toFixed(precision).padStart(6);
    return (
      fmt(this.data[0]) + ' ' + fmt(this.data[1]) + ' ' + fmt(this.data[2]) + '\n' +
      fmt(this.data[3]) + ' ' + fmt(this.data[4]) + ' ' + fmt(this.data[5]) + '\n' +
      fmt(this.data[6]) + ' ' + fmt(this.data[7]) + ' ' + fmt(this.data[8])
    );
  }
}
