export class Complex {
  public re: number;
  public im: number;

  constructor(re: number, im: number) {
    this.re = re;
    this.im = im;
  }
}
export function add(a: Complex, b: Complex): Complex {
  return new Complex(a.re + b.re, a.im + b.im);
}
export function subtract(a: Complex, b: Complex): Complex {
  return new Complex(a.re - b.re, a.im - b.im);
}
export function multiply(a: Complex, b: Complex): Complex {
  return new Complex((a.re * b.re) - (a.im * b.im), (a.re * b.im) + (a.im * b.re));
}
export function abs(x: Complex): number {
  return Math.sqrt((x.re * x.re) + (x.im * x.im));
}
export function absSquared(x: Complex): number {
  return (x.re * x.re) + (x.im * x.im);
}