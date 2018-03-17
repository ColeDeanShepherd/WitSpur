import { parseWithTemplate } from "./Utils";

export class Color {
  public static parse(str: string): Color | null {
    const componentStrings = parseWithTemplate("rgba(${}, ${}, ${}, ${})", str);
    if(!componentStrings) { return null; }

    const components = componentStrings.map(parseFloat);
    if(components.some(isNaN)) { return null; }

    return new Color(components[0], components[1], components[2], components[3]);
  }

  r: number; // [0, 255]
  g: number; // [0, 255]
  b: number; // [0, 255]
  a: number; // [0, 1]

  constructor(r: number, g: number, b: number, a: number) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
  toString() {
    return `rgba(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)}, ${this.a})`;
  }
}

/**
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
export function rgbToHsl(r: number, g: number, b: number): number[] {
  let hsl = new Array(3);
  rgbToHslRef(r, g, b, hsl);

  return hsl;
}
export function rgbToHslRef(r: number, g: number, b: number, outHsl: number[]) {
  r /= 255, g /= 255, b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }

  outHsl[0] = h;
  outHsl[1] = s;
  outHsl[2] = l;
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
export function hslToRgb(h: number, s: number, l: number): number[] {
  let rgb = new Array(3);
  hslToRgbRef(h, s, l, rgb);

  return rgb;
}

function pqtHue2rgb(p: number, q: number, t: number) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    }
export function hslToRgbRef(h: number, s: number, l: number, outRgb: number[]) {
  let r: number, g: number, b: number;

  if (s == 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;

    r = pqtHue2rgb(p, q, h + 1/3);
    g = pqtHue2rgb(p, q, h);
    b = pqtHue2rgb(p, q, h - 1/3);
  }
  
  outRgb[0] = r * 255;
  outRgb[1] = g * 255;
  outRgb[2] = b * 255;
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
export function rgbToHsv(r: number, g: number, b: number): number[] {
  let hsv = new Array(3);
  rgbToHsvRef(r, g, b, hsv);

  return hsv;
}

export function rgbToHsvRef(r: number, g: number, b: number, outHsv: number[]) {
  r /= 255, g /= 255, b /= 255;

  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const v = max;

  const d = max - min;
  s = max == 0 ? 0 : d / max;

  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }

    h /= 6;
  }
  
  outHsv[0] = h;
  outHsv[1] = s;
  outHsv[2] = v;
}

/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
export function hsvToRgb(h: number, s: number, v: number): number[] {
  let rgb = new Array(3);
  hsvToRgbRef(h, s, v, rgb);

  return rgb;
}

export function hsvToRgbRef(h: number, s: number, v: number, outRgb: number[]) {
  let r = 0, g = 0, b = 0;

  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);

  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }

  outRgb[0] = r * 255;
  outRgb[1] = g * 255;
  outRgb[2] = b * 255;
}