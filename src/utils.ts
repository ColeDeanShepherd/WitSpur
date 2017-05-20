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