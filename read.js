import { Mat3 } from './matrix.js';

function buildMatrix(transforms) {
  let result = Mat3.identity();

  for (let i = 0; i < transforms.length; i += 2) {
    const op = transforms[i];
    const args = transforms[i + 1];

    if (!args) {
      console.warn(`Missing arguments for transform "${op}" at index ${i}`);
      continue;
    }

    switch (op) {
      case "translate":
        if (!Array.isArray(args) || args.length !== 2) {
          console.warn(`Invalid arguments for translate:`, args);
          break;
        }
        result = result.mul(Mat3.translate(args));
        break;

      case "scale":
      case "scale2":
        if (!Array.isArray(args) || args.length !== 2) {
          console.warn(`Invalid arguments for scale:`, args);
          break;
        }
        result = result.mul(Mat3.scale2(args));
        break;

      case "rotate":
        if (typeof args !== "number") {
          console.warn(`Invalid angle for rotate:`, args);
          break;
        }
        result = result.mul(Mat3.rotate(args));
        break;

      default:
        console.warn(`Unknown transform: "${op}"`);
    }
  }

  return result;
}

function read(scene) {
  return scene.objects.map(obj => {
    const matrix = buildMatrix(obj.transforms || []);
    return { ...obj, matrix };
  });
}

export { read };
