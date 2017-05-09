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
export function parseXSV(x, str) {
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
export function parseCSV(str) {
  return parseXSV(",", str);
}

/**
 * Parses a tab-separated value string.
 * @param {String} str
 * @return {String[][]}
 */
export function parseTSV(str) {
  return parseXSV("\t", str);
}

export function colorToString(color) {
  if(typeof color === "string") {
    return color;
  } else if(color.r !== undefined) {
    return (color.a === undefined) ? `rgb(${color.r}, ${color.g}, ${color.b})` : `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
  } else {
    return null
  }
}

export function isLetter(str) {
  return (str.length === 1) && (str.match(/[a-z]/i));
}

export function isUpperCase(str) {
  return str === str.toUpperCase();
}

export function camelCaseToWords(str) {
  if(str.length === 0) {
    return str;
  }

  let words = [];
  let wordStartIndex = 0;
  let charIndex;

  for(charIndex = 0; charIndex < str.length; charIndex++) {
    let char = str.charAt(charIndex);

    if((charIndex > 0) && isUpperCase(char) && isLetter(char)) {
      words.push(str.substring(wordStartIndex, charIndex).toLowerCase());

      wordStartIndex = charIndex;
    }
  }

  words.push(str.substring(wordStartIndex, charIndex).toLowerCase());

  return words;
}

export function capitalizeWord(word) {
  if(word.length === 0) {
    return word;
  }

  return word.charAt(0).toUpperCase() + word.substring(1);
}

export function openNewTab(url) {
  window.open(url, "_blank");
}

export function runInTmpCanvas(fn, canvasWidth, canvasHeight) {
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
  tmpCanvas.parentNode.removeChild(tmpCanvas);
}

export function getSvgDataUri(svgString) {
  const encodedSvgDocument = btoa(svgString);
  return `data:image/svg+xml;base64,${encodedSvgDocument}`;
}

export function exportSvgToFile(svgString) {
  openNewTab(getSvgDataUri(svgString));
}

export function exportSvgToRasterImage(svgString, imageWidth, imageHeight, imageFormat) {
  runInTmpCanvas((canvas, context) => {
    var image = new Image();
    image.onload = () => {
      context.drawImage(image, 0, 0);
      openNewTab(canvas.toDataURL(`image/${imageFormat}`));
    };
    image.src = getSvgDataUri(svgString);
  }, imageWidth, imageHeight);
}

export function genUniqueId() {
  const dateValue = (new Date()).valueOf();

  if(dateValue != genUniqueId.lastDateValue) {
    genUniqueId.lastDateValue = dateValue;
    genUniqueId.collisionCount = 0;
  } else {
    genUniqueId.collisionCount++;
  }

  return dateValue.toString() + genUniqueId.collisionCount.toString();
}
genUniqueId.lastDateValue = null;
genUniqueId.collisionCount = 0;