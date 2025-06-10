// read.js
// Interprets a scene descriptor and builds draw-ready instances
// Assumes left-to-right transform composition and modular matrix utilities

import { Mat3 } from './matrix.js';

function buildMatrix(transformStack) {
  let matrix = Mat3.identity();

  for (let i = 0; i < transformStack.length; i++) {
    const cmd = transformStack[i];
    const arg = transformStack[i + 1];

    switch (cmd) {
      case 'translate':
        matrix = matrix.mul(Mat3.translate(arg[0], arg[1]));
        i++;
        break;
      case 'scale':
        matrix = matrix.mul(Mat3.scale2(arg[0], arg[1]));
        i++;
        break;
      case 'rotate':
        matrix = matrix.mul(Mat3.rotate(arg));
        i++;
        break;
      default:
        console.warn(`Unknown transform command: ${cmd}`);
        break;
    }
  }

  return matrix;
}

export function read(scene) {
  const { primitives, objects } = scene;

  return objects.map(obj => {
    const base = primitives[obj.shape];
    const transform = buildMatrix(obj.transform || []);

    return {
      type: base.type,
      transform,
      base,
      style: obj.style || {},
      textOverride: obj.textOverride || null
    };
  });
}
