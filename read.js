// read.js
// Builds a transformation matrix from a transform stack and applies it to scene objects

import { Mat3 } from './matrix.js';

function buildMatrix(stack) {
  let matrix = Mat3.identity();
  for (let i = 0; i < stack.length; i++) {
    const cmd = stack[i];
    const arg = stack[i + 1];
    switch (cmd) {
      case 'translate':
        matrix = matrix.mul(Mat3.translate(arg));
        i++;
        break;
      case 'scale':
        matrix = matrix.mul(Mat3.scale2(arg));
        i++;
        break;
      case 'rotate':
        matrix = matrix.mul(Mat3.rotate(arg));
        i++;
        break;
      default:
        console.warn("Unknown command:", cmd);
    }
  }
  return matrix;
}

export function read(scene) {
  const { primitives, objects } = scene;

  return objects.map(obj => {
    const shape = primitives[obj.shape];
    const transform = buildMatrix(obj.transform || []);
    return {
      type: shape.type,
      transform,
      base: shape,
      style: obj.style || {},
      textOverride: obj.textOverride || null
    };
  });
}
