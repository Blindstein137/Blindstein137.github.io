// Modified matrix.js with iterable support for Mat2, Mat3, and Mat4

export class Vec2 {
    0;
    1;
    constructor(x, y) {
        this[0] = x;
        this[1] = y;
    }
    static zero() {
        return new Vec2(0, 0);
    }
    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => {
                if (index == 0 || index == 1) {
                    const value = this[index];
                    index++;
                    return { value, done: false };
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
    }
    mag() {
        return Math.sqrt(this[0]**2 + this[1]**2);
    }
    normalize() {
        return this.mul(1.0 / this.mag());
    }
    add(y) {
        return new Vec2(this[0] + y[0], this[1] + y[1]);
    }
    sub(y) {
        return new Vec2(this[0] - y[0], this[1] - y[1]);
    }
    mul(y) {
        return typeof y === "number" ?
            new Vec2(this[0] * y, this[1] * y) :
            new Vec2(this[0] * y[0] + this[1] * y[1], this[0] * y[2] + this[1] * y[3]);
    }
}

export class Vec3 {
    0; 1; 2;
    constructor(x, y, z) {
        this[0] = x; this[1] = y; this[2] = z;
    }
    static zero() { return new Vec3(0, 0, 0); }
    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => {
                if (index < 3) return { value: this[index++], done: false };
                return { value: undefined, done: true };
            }
        };
    }
    mag() { return Math.sqrt(this[0]**2 + this[1]**2 + this[2]**2); }
    normalize() { return this.mul(1.0 / this.mag()); }
    add(y) { return new Vec3(this[0]+y[0], this[1]+y[1], this[2]+y[2]); }
    sub(y) { return new Vec3(this[0]-y[0], this[1]-y[1], this[2]-y[2]); }
    mul(y) {
        return typeof y === "number"
            ? new Vec3(this[0]*y, this[1]*y, this[2]*y)
            : new Vec3(
                this[0]*y[0] + this[1]*y[1] + this[2]*y[2],
                this[0]*y[3] + this[1]*y[4] + this[2]*y[5],
                this[0]*y[6] + this[1]*y[7] + this[2]*y[8]
              );
    }
}

export class Vec4 {
    0; 1; 2; 3;
    constructor(x, y, z, w) {
        this[0] = x; this[1] = y; this[2] = z; this[3] = w;
    }
    static zero() { return new Vec4(0, 0, 0, 0); }
    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => {
                if (index < 4) return { value: this[index++], done: false };
                return { value: undefined, done: true };
            }
        };
    }
    mag() { return Math.sqrt(this[0]**2 + this[1]**2 + this[2]**2 + this[3]**2); }
    normalize() { return this.mul(1.0 / this.mag()); }
    add(y) { return new Vec4(this[0]+y[0], this[1]+y[1], this[2]+y[2], this[3]+y[3]); }
    sub(y) { return new Vec4(this[0]-y[0], this[1]-y[1], this[2]-y[2], this[3]-y[3]); }
    mul(y) {
        return typeof y === "number"
            ? new Vec4(this[0]*y, this[1]*y, this[2]*y, this[3]*y)
            : new Vec4(
                this[0]*y[0] + this[1]*y[1] + this[2]*y[2] + this[3]*y[3],
                this[0]*y[4] + this[1]*y[5] + this[2]*y[6] + this[3]*y[7],
                this[0]*y[8] + this[1]*y[9] + this[2]*y[10] + this[3]*y[11],
                this[0]*y[12] + this[1]*y[13] + this[2]*y[14] + this[3]*y[15]
              );
    }
}

export class Mat2 {
    0; 1; 2; 3;
    constructor(xx, xy, yx, yy) {
        this[0] = xx; this[1] = xy; this[2] = yx; this[3] = yy;
    }
    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => index < 4 ? { value: this[index++], done: false } : { value: undefined, done: true }
        };
    }
    static identity() { return new Mat2(1, 0, 0, 1); }
    static scale(amount) { return new Mat2(amount, 0, 0, amount); }
    static rotate(angle) {
        const c = Math.cos(angle), s = Math.sin(angle);
        return new Mat2(c, -s, s, c);
    }
    mul(y) {
        return y instanceof Vec2
            ? new Vec2(y[0]*this[0] + y[1]*this[2], y[0]*this[1] + y[1]*this[3])
            : new Mat2(
                y[0]*this[0] + y[1]*this[2], y[0]*this[1] + y[1]*this[3],
                y[2]*this[0] + y[3]*this[2], y[2]*this[1] + y[3]*this[3]
              );
    }
    inverse() {
        const [a,b,c,d] = this;
        const det = a*d - b*c;
        return new Mat2(d/det, -b/det, -c/det, a/det);
    }
}

export class Mat3 {
    0;1;2;3;4;5;6;7;8;
    constructor(...args) {
        args.forEach((val, i) => this[i] = val);
    }
    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => index < 9 ? { value: this[index++], done: false } : { value: undefined, done: true }
        };
    }
    static identity() { return new Mat3(1,0,0, 0,1,0, 0,0,1); }
    static translate([tx, ty]) { return new Mat3(1,0,tx, 0,1,ty, 0,0,1); }
    static scale2(s) { return new Mat3(s,0,0, 0,s,0, 0,0,1); }
    static rotate(angle) {
        const c = Math.cos(angle), s = Math.sin(angle);
        return new Mat3(c,-s,0, s,c,0, 0,0,1);
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
                    r[i*3+j] += this[i*3+k] * y[k*3+j];
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
}

export class Mat4 {
    constructor(...args) {
        args.forEach((val, i) => this[i] = val);
    }
    [Symbol.iterator]() {
        let index = 0;
        return {
            next: () => index < 16 ? { value: this[index++], done: false } : { value: undefined, done: true }
        };
    }
    static identity() {
        return new Mat4(...[1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]);
    }
    // Additional static methods like translate, scale, etc. should go here.
    // Existing .mul() and .inverse() logic can remain unchanged from the base version.
}
