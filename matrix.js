export class Mat3 {
  constructor(...args) {
    for (let i = 0; i < 9; i++) this[i] = args[i] || 0;
  }

  static identity() {
    return new Mat3(
      1, 0, 0,
      0, 1, 0,
      0, 0, 1
    );
  }

  static translate(x, y) {
    return new Mat3(
      1, 0, 0,
      0, 1, 0,
      x, y, 1
    );
  }

  static scale2(sx, sy) {
    return new Mat3(
      sx, 0, 0,
      0, sy, 0,
      0, 0, 1
    );
  }

  static rotate(angle) {
    const c = Math.cos(angle), s = Math.sin(angle);
    return new Mat3(
      c, s, 0,
     -s, c, 0,
      0, 0, 1
    );
  }

  mul(y) {
    if (y instanceof Vec3) {
      return new Vec3(
        y[0]*this[0] + y[1]*this[3] + y[2]*this[6],
        y[0]*this[1] + y[1]*this[4] + y[2]*this[7],
        y[0]*this[2] + y[1]*this[5] + y[2]*this[8]
      );
    }
    const r = new Array(9).fill(0);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        for (let k = 0; k < 3; k++) {
          r[i*3 + j] += this[i*3 + k] * y[k*3 + j];
        }
      }
    }
    return new Mat3(...r);
  }

  inverse() {
    const [a,b,c,d,e,f,g,h,i] = this;
    const A = e*i - f*h, B = c*h - b*i, C = b*f - c*e;
    const D = f*g - d*i, E = a*i - c*g, F = c*d - a*f;
    const G = d*h - e*g, H = b*g - a*h, I = a*e - b*d;
    const det = a*A + b*D + c*G;
    return new Mat3(
      A/det, B/det, C/det,
      D/det, E/det, F/det,
      G/det, H/det, I/det
    );
  }

  [Symbol.iterator]() {
    let index = 0;
    return {
      next: () => index < 9
        ? { value: this[index++], done: false }
        : { value: undefined, done: true }
    };
  }
}
