export const secondsInMinute = 60;
export const millisecondsInSecond = 1000;

export function assert(condition: boolean) {
  if(!condition) {
    throw new Error("Failed assertion.");
  }
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