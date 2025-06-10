// matrix.js
// Mat3 class for 2D affine transformations

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
    const result = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        result[row * 3 + col] = 0;
        for (let i = 0; i < 3; i++) {
          result[row * 3 + col] += a[row * 3 + i] * b[i * 3 + col];
        }
      }
    }
    return new Mat3(result);
  }

  applyToVec3([x, y, z]) {
    const m = this.data;
    return [
      m[0]*x + m[1]*y + m[2]*z,
      m[3]*x + m[4]*y + m[5]*z,
      m[6]*x + m[7]*y + m[8]*z
    ];
  }

  toString() {
    return `[
  ${this.data.slice(0, 3).join(', ')},\n  ${this.data.slice(3, 6).join(', ')},\n  ${this.data.slice(6, 9).join(', ')}
]`;
  }
} // End Mat3
