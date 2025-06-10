// matrix.js with Vec3 class support and full matrix functionality

class Vec3 {
  constructor(x, y, z = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toArray() {
    return [this.x, this.y, this.z];
  }

  static fromArray([x, y, z = 1]) {
    return new Vec3(x, y, z);
  }

  *[Symbol.iterator]() {
    yield this.x;
    yield this.y;
    yield this.z;
  }

  toString() {
    return `Vec3(${this.x}, ${this.y}, ${this.z})`;
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
      0, 0, 1
    ]);
  }

  static translate([tx, ty]) {
    return new Mat3([
      1, 0, 0,
      0, 1, 0,
      tx, ty, 1
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
    const rad = typeof theta === 'number' ? theta : 0;
    const c = Math.cos(rad);
    const s = Math.sin(rad);
    return new Mat3([
      c, -s, 0,
      s,  c, 0,
      0,  0, 1
    ]);
  }

  mul(other) {
    if (other instanceof Mat3) {
      const a = this.data;
      const b = other.data;
      const result = new Array(9);

      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          result[row * 3 + col] =
            a[row * 3 + 0] * b[0 * 3 + col] +
            a[row * 3 + 1] * b[1 * 3 + col] +
            a[row * 3 + 2] * b[2 * 3 + col];
        }
      }

      return new Mat3(result);
    } else if (other instanceof Vec3) {
      const [x, y, z] = other;
      const m = this.data;
      const tx = x * m[0] + y * m[3] + z * m[6];
      const ty = x * m[1] + y * m[4] + z * m[7];
      const tz = x * m[2] + y * m[5] + z * m[8];
      return new Vec3(tx, ty, tz);
    } else {
      throw new Error("Unsupported multiplication target");
    }
  }

  applyToVec3([x, y, z = 1]) {
    const m = this.data;
    return [
      x * m[0] + y * m[3] + z * m[6],
      x * m[1] + y * m[4] + z * m[7],
      x * m[2] + y * m[5] + z * m[8]
    ];
  }

  *[Symbol.iterator]() {
    yield* this.data;
  }

  toString() {
    return `Mat3(${this.data.join(", ")})`;
  }
}

export { Mat3, Vec3 };
