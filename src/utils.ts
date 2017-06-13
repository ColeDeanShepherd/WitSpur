export const secondsInMinute = 60;
export const millisecondsInSecond = 1000;

export function assert(condition: boolean) {
  if(!condition) {
    throw new Error("Failed assertion.");
  }
}

export function assertUnreachable(x: never): never {
  throw new Error("Failed unreachable assertion.");
}

export function reduceObjectPropertyNames<T>(iteratee: (accumulator: T, propertyName: string) => T, obj: object, initialValue: T): T {
  let accumulator = initialValue;
  
  for(let propertyName in obj) {
    accumulator = iteratee(accumulator, propertyName);
  }

  return accumulator;
}

export class IntRange {
  start: number;
  count: number;

  constructor(start: number, count: number) {
    this.start = start;
    this.count = count;
  }
  toArray(): number[] {
    let array = new Array<number>(this.count);

    for(let i = 0; i < this.count; i++) {
      array[i] = this.start + i;
    }

    return array;
  }
}
export function splitRangeIntoSubRanges(range: IntRange, subRangeCount: number): IntRange[] {
  const countPerRangeEvenDistribution = Math.floor(range.count / subRangeCount);
  const countLeftAfterEvenDistribution = range.count - (subRangeCount * countPerRangeEvenDistribution);
  let subRanges: IntRange[] = [];

  for(let i = 0; i < subRangeCount; i++) {
    const subRangeStartOffset = (i > 0) ? (subRanges[i - 1].start + subRanges[i - 1].count) : 0;
    const subRangeStart = range.start + subRangeStartOffset;
    const subRangeCount = countPerRangeEvenDistribution + ((i < countLeftAfterEvenDistribution) ? 1 : 0);
    subRanges.push(new IntRange(subRangeStart, subRangeCount));
  }

  return subRanges;
}

export function repeatString(repeatCount: number, str: string): string {
  assert(repeatCount >= 0);

  let result = "";

  for(let i = 0; i < repeatCount; i++) {
    result += str;
  }

  return result;
}

export function zeroPadIntegerString(minDigitCount: number, integerString: string): string {
  assert(minDigitCount >= 0);

  const digitCount = integerString.length;
  const paddingZeroCount = Math.max(minDigitCount - digitCount, 0);
  const paddingStr = repeatString(paddingZeroCount, "0");

  return paddingStr + integerString;
}

export function addElementImmutable<T>(arr: T[], newElement: T): T[] {
  return [...arr, newElement];
}
export function setElementImmutable<T>(arr: T[], elementIndex: number, newValue: T): T[] {
  return [...arr.slice(0, elementIndex), newValue, ...arr.slice(elementIndex + 1)];
}
export function removeElementImmutable<T>(arr: T[], elementIndex: number): T[] {
  return [...arr.slice(0, elementIndex), ...arr.slice(elementIndex + 1)]
}

/**
 * Combines two arrays into an array of pairs.
 * If one array is longer than the other, undefined is paired with the other array's values.
 * @param {Array} a 
 * @param {Array} b 
 * @return {Array} result
 */
export function zip(a, b) {
  let result = new Array(Math.max(a.length, b.length));

  for(let i = 0; i < result.length; i++) {
    const elementA = (i < a.length) ? a[i] : undefined;
    const elementB = (i < b.length) ? b[i] : undefined;

    result[i] = [elementA, elementB];
  }

  return result;
}

/**
 * Reverses the zip operation, splitting an array of tuples into an ordered array of arrays of values.
 * @param {Array} array
 * @return {Array} result
 */
export function unzip(zippedArray) {
  if(zippedArray.length === 0) {
    return zippedArray;
  }

  const tupleSize = zippedArray[0].length;
  let unzippedArray = new Array(tupleSize);

  for(let i = 0; i < unzippedArray.length; i++) {
    unzippedArray[i] = zippedArray.map(tuple => tuple[i]);
  }

  return unzippedArray;
}

/**
 * Parses a string of records separated by newlines, which have fields separated by an arbitrary one-line string.
 * @param {String} str
 * @param {String} x
 * @return {String[][]}
 */
export function parseXSV(x: string, str: string) {
  const lines = str.split(/\r?\n/);
  const nonEmptyLines = lines.filter(line => line.length > 0);

  return nonEmptyLines.map(line => {
    return line.split(x);
  });
}

/**
 * Parses a comma-separated value string.
 * @param {String} str
 * @return {String[][]}
 */
export function parseCSV(str: string) {
  return parseXSV(",", str);
}

/**
 * Parses a tab-separated value string.
 * @param {String} str
 * @return {String[][]}
 */
export function parseTSV(str: string) {
  return parseXSV("\t", str);
}

export function capitalizeWord(str: string): string {
  if((str === null) || (str.length === 0)) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function openNewTab(url: string) {
  window.open(url, "_blank");
}

export function runInTmpCanvas(fn, canvasWidth: number, canvasHeight: number) {
  if(!fn) { return; }

  // Add an invisible canvas to <body>.
  var tmpCanvas = document.createElement("canvas");
  tmpCanvas.width = canvasWidth;
  tmpCanvas.height = canvasHeight;
  tmpCanvas.style.display = "none";
  document.getElementsByTagName("body")[0].appendChild(tmpCanvas);

  // Run the passed-in function.
  fn(tmpCanvas, tmpCanvas.getContext("2d"));

  // Remove the temporary canvas.
  if(tmpCanvas.parentNode) {
    tmpCanvas.parentNode.removeChild(tmpCanvas);
  }
}

export function getSvgDataUri(svgString: string): string {
  const encodedSvgDocument = btoa(svgString);
  return `data:image/svg+xml;base64,${encodedSvgDocument}`;
}

export function exportSvgToFile(svgString: string) {
  openNewTab(getSvgDataUri(svgString));
}

export function exportSvgToRasterImage(svgString: string, imageWidth: number, imageHeight: number, imageFormat: string) {
  runInTmpCanvas((canvas, context) => {
    var image = new Image();
    image.onload = () => {
      context.drawImage(image, 0, 0);
      openNewTab(canvas.toDataURL(`image/${imageFormat}`));
    };
    image.src = getSvgDataUri(svgString);
  }, imageWidth, imageHeight);
}

let _genUniqueIdState: { lastDateValue: number | null , collisionCount: number } = {
  lastDateValue: null,
  collisionCount: 0
};
export function genUniqueId(): string {
  const dateValue = (new Date()).valueOf();

  if(dateValue != _genUniqueIdState.lastDateValue) {
    _genUniqueIdState.lastDateValue = dateValue;
    _genUniqueIdState.collisionCount = 0;
  } else {
    _genUniqueIdState.collisionCount++;
  }

  return dateValue.toString() + _genUniqueIdState.collisionCount.toString();
}

// TODO: actually run in background. use webpack-worker/require()
export function runInBackgroundThread(fn: Function, fnArgs: any[], returnCallback: Function) {
  const fnReturnValue = fn.apply(this, fnArgs);
  returnCallback(fnReturnValue);

  // if(typeof(Worker) === "undefined") {
  //   console.log("Browser doesn't support webworkers.");
  // }

  // const webWorkerMainString = `self.addEventListener("message", function(event) {
  //   var fnArgs = event.data;
  //   var fnResult = (${fn}).apply(this, fnArgs);
  //   self.postMessage(fnResult);
  //   self.close();
  // });`;

  // const objectUrl = URL.createObjectURL(new Blob([webWorkerMainString]));
  // let webWorker = new Worker(objectUrl);
  // webWorker.addEventListener("message", event => returnCallback(event.data));
  
  // webWorker.postMessage(fnArgs);
}