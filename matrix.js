// matrix.js (final validated + Vec3-aware version)

class Vec3 {
  constructor(x, y, z = 1) {
    this[0] = x;
    this[1] = y;
    this[2] = z;
  }

  *[Symbol.iterator]() {
    yield this[0];
    yield this[1];
    yield this[2];
  }

  toString() {
    return `Vec3(${this[0]}, ${this[1]}, ${this[2]})`;
  }
}

class Mat3 {
  constructor(data) {
    this.data = data;
  }

  static identity() {
    return new Mat3([
      1, 0, 0,
      0, 1, 0,
      0, 0, 1,
    ]);
  }

  static translate([tx, ty]) {
    return new Mat3([
      1, 0, tx,
      0, 1, ty,
      0, 0, 1,
    ]);
  }

  static scale2([sx, sy]) {
    return new Mat3([
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1,
    ]);
  }

  static rotate(theta) {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return new Mat3([
      c, -s, 0,
      s,  c, 0,
      0,  0, 1,
    ]);
  }

  mul(other) {
    if (other instanceof Vec3) {
      const m = this.data;
      const [x, y, z] = other;
      return new Vec3(
        m[0] * x + m[1] * y + m[2] * z,
        m[3] * x + m[4] * y + m[5] * z,
        m[6] * x + m[7] * y + m[8] * z
      );
    }
    const a = this.data;
    const b = other.data;
    const result = new Array(9);
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

  applyToVec3(vec) {
    const [x, y, z] = vec;
    const m = this.data;
    return [
      m[0] * x + m[1] * y + m[2] * z,
      m[3] * x + m[4] * y + m[5] * z,
      m[6] * x + m[7] * y + m[8] * z,
    ];
  }

  *[Symbol.iterator]() {
    yield* this.data;
  }

  toString() {
    return `[
      ${this.data.slice(0, 3).join(', ')},\n      ${this.data.slice(3, 6).join(', ')},\n      ${this.data.slice(6, 9).join(', ')}
    ]`;
  }
}

export { Mat3, Vec3 };
