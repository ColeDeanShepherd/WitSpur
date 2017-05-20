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