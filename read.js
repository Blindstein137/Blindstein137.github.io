// read.js
// Converts descriptor data into drawable instance objects with transform matrices

import { Mat3 } from './matrix.js';

export function read(descriptor) {
  const primitives = descriptor.primitives;

  return descriptor.objects.map(obj => {
    const base = primitives[obj.base];
    let transform = Mat3.identity();

    for (let i = 0; i < obj.transform.length; i++) {
      const cmd = obj.transform[i];
      const arg = obj.transform[i + 1];
      switch (cmd) {
        case 'translate':
          transform = transform.mul(Mat3.translate(arg));
          i++;
          break;
        case 'scale':
          transform = transform.mul(Mat3.scale2(arg));
          i++;
          break;
        case 'rotate':
          transform = transform.mul(Mat3.rotate(arg));
          i++;
          break;
        case 'identity':
          // identity: no-op
          break;
      }
    }

    return {
      ...obj,
      base,
      transform,
    };
  });
}
