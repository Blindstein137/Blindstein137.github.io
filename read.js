// read.js (corrected)

import { Mat3 } from './matrix.js';

function buildMatrix(transformList) {
  let matrix = Mat3.identity();
  let i = 0;
  while (i < transformList.length) {
    const cmd = transformList[i];
    const arg = transformList[i + 1];
    switch (cmd) {
      case 'translate':
        matrix = matrix.mul(Mat3.translate(arg)); // ✅ corrected
        i++;
        break;
      case 'scale':
        matrix = matrix.mul(Mat3.scale2(arg));    // ✅ corrected
        i++;
        break;
      case 'rotate':
        matrix = matrix.mul(Mat3.rotate(arg));
        i++;
        break;
      default:
        console.warn(`Unknown transform command: ${cmd}`);
    }
    i++;
  }
  return matrix;
}

export function read(scene) {
  return scene.objects.map(obj => {
    const matrix = buildMatrix(obj.transforms);
    return {
      ...obj,
      matrix,
    };
  });
} 
