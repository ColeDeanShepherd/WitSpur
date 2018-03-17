import { createJuliaSetImageDataPart } from "../Fractal";

addEventListener("message", function(message) {
  const fnArgs = message.data.renderArgs;
  const pixels = createJuliaSetImageDataPart.apply(self, fnArgs);
  postMessage({
    pixels: pixels,
    widthOfCanvasInPixels: message.data.widthOfCanvasInPixels,
    rowCount: message.data.rowCount,
    rowStartIndex: message.data.rowStartIndex,
    renderId: message.data.renderId
  });
});