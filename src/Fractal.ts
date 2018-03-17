import { Complex, add, subtract, multiply, abs } from "./Complex";
import * as Color from "./Color";

export function createMandelbrotSetImageDataPart(widthInPixels: number, heightInPixels: number, widthInUnits: number, heightInUnits: number, centerPosition: Complex, maxIterationCount: number, hue: number, saturation: number, startRowIndex: number, rowCount: number): Uint8ClampedArray {
  const widthOfPixelInUnits = widthInUnits / widthInPixels;
  const heightOfPixelInUnits = heightInUnits / heightInPixels;
  
  const topLeftPosition = add(centerPosition, new Complex(-(widthInUnits / 2), heightInUnits / 2));
  const topLeftPixelCenterPosition = add(topLeftPosition, new Complex(widthOfPixelInUnits / 2, -(heightOfPixelInUnits / 2)));

  let imageData = new Uint8ClampedArray(4 * widthInPixels * rowCount);
  
  const startPixelY = startRowIndex;
  const endPixelY = startPixelY + rowCount;
  let pixelRgb = new Array(3);

  for(let y = startPixelY; y < endPixelY; y++) {
    for(let x = 0; x < widthInPixels; x++) {
      const cRe = topLeftPixelCenterPosition.re + (x * widthOfPixelInUnits);
      const cIm = topLeftPixelCenterPosition.im - (y * heightOfPixelInUnits);
      let znRe = 0;
      let znIm = 0;
      let n = 1;

      /*
      n: [1 to maxIterationCount + 1]
      maxIterationCount + 1 means the point is in the set!
      n < (maxIterationCount + 1) means the point is not in the set.
      */
      for(n = 1; n <= maxIterationCount; n++) {
        // z(n + 1) = (zn * zn) + c
        const reSquared = znRe * znRe;
        const imSquared = znIm * znIm;
        const newRe = (reSquared - imSquared) + cRe;
        const newIm = (2 * (znRe * znIm)) + cIm;
        znRe = newRe;
        znIm = newIm;

        // if absSquared(zn) > (2 * 2)
        if((reSquared + imSquared) > 4) {
          break;
        }
      }
      
      const colorI = n - 1; // [0, maxIterationCount]
      const lightness = (colorI === maxIterationCount) ? 0 : Math.sqrt(colorI / (maxIterationCount - 1));
      Color.hslToRgbRef(hue, saturation, lightness, pixelRgb);

      // set pixel of image
      const pixelIndex = (widthInPixels * (y - startRowIndex)) + x;
      const pixelRByteIndex = 4 * pixelIndex;

      imageData[pixelRByteIndex] = pixelRgb[0];
      imageData[pixelRByteIndex + 1] = pixelRgb[1];
      imageData[pixelRByteIndex + 2] = pixelRgb[2];
      imageData[pixelRByteIndex + 3] = 255;
    }
  }

  return imageData;
}

export function createJuliaSetImageDataPart(widthInPixels: number, heightInPixels: number, widthInUnits: number, heightInUnits: number, c: Complex, centerPosition: Complex, maxIterationCount: number, hue: number, saturation: number, startRowIndex: number, rowCount: number): Uint8ClampedArray {
  const widthOfPixelInUnits = widthInUnits / widthInPixels;
  const heightOfPixelInUnits = heightInUnits / heightInPixels;
  
  const topLeftPosition = add(centerPosition, new Complex(-(widthInUnits / 2), heightInUnits / 2));
  const topLeftPixelCenterPosition = add(topLeftPosition, new Complex(widthOfPixelInUnits / 2, -(heightOfPixelInUnits / 2)));

  let imageData = new Uint8ClampedArray(4 * widthInPixels * rowCount);
  
  const startPixelY = startRowIndex;
  const endPixelY = startPixelY + rowCount;
  let pixelRgb = new Array(3);

  for(let y = startPixelY; y < endPixelY; y++) {
    for(let x = 0; x < widthInPixels; x++) {
      const cRe = c.re;
      const cIm = c.im;
      let znRe = topLeftPixelCenterPosition.re + (x * widthOfPixelInUnits);
      let znIm = topLeftPixelCenterPosition.im - (y * heightOfPixelInUnits);
      let n = 1;

      /*
      n: [1 to maxIterationCount + 1]
      maxIterationCount + 1 means the point is in the set!
      n < (maxIterationCount + 1) means the point is not in the set.
      */
      for(n = 1; n <= maxIterationCount; n++) {
        // z(n + 1) = (zn * zn) + c
        const reSquared = znRe * znRe;
        const imSquared = znIm * znIm;
        const newRe = (reSquared - imSquared) + cRe;
        const newIm = (2 * (znRe * znIm)) + cIm;
        znRe = newRe;
        znIm = newIm;

        // if absSquared(zn) > (2 * 2)
        if((reSquared + imSquared) > 4) {
          break;
        }
      }
      
      const colorI = n - 1; // [0, maxIterationCount]
      const lightness = (colorI === maxIterationCount) ? 0 : Math.sqrt(colorI / (maxIterationCount - 1));
      Color.hslToRgbRef(hue, saturation, lightness, pixelRgb);

      // set pixel of image
      const pixelIndex = (widthInPixels * (y - startRowIndex)) + x;
      const pixelRByteIndex = 4 * pixelIndex;

      imageData[pixelRByteIndex] = pixelRgb[0];
      imageData[pixelRByteIndex + 1] = pixelRgb[1];
      imageData[pixelRByteIndex + 2] = pixelRgb[2];
      imageData[pixelRByteIndex + 3] = 255;
    }
  }

  return imageData;
}