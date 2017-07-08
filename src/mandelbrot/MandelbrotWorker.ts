import { createMandelbrotSetImageDataPart } from "../Fractal";

addEventListener("message", function(message) {
  const fnArgs = message.data;
  const pixels = createMandelbrotSetImageDataPart.apply(self, fnArgs);
  postMessage(pixels);
  close();
});