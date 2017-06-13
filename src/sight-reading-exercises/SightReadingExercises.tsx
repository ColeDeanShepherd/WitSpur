import * as React from "react";

import * as Utils from "../Utils";

export enum PitchClass {
  C,
  CSharp,
  DFlat,
  D,
  DSharp,
  EFlat,
  E,
  F,
  FSharp,
  GFlat,
  G,
  GSharp,
  AFlat,
  A,
  ASharp,
  BFlat,
  B
}
export function pitchClassToSemitoneOffsetFromC(pitchClass: PitchClass): number {
  switch(pitchClass) {
    case PitchClass.C:
      return 0;
    case PitchClass.CSharp:
      return 1;
    case PitchClass.DFlat:
      return 1;
    case PitchClass.D:
      return 2;
    case PitchClass.DSharp:
      return 3;
    case PitchClass.EFlat:
      return 3;
    case PitchClass.E:
      return 4;
    case PitchClass.F:
      return 5;
    case PitchClass.FSharp:
      return 6;
    case PitchClass.GFlat:
      return 6;
    case PitchClass.G:
      return 7;
    case PitchClass.GSharp:
      return 8;
    case PitchClass.AFlat:
      return 8;
    case PitchClass.A:
      return 9;
    case PitchClass.ASharp:
      return 10;
    case PitchClass.BFlat:
      return 10;
    case PitchClass.B:
      return 11;
  }

  return Utils.assertUnreachable(pitchClass);
}
export function semitoneOffsetFromCToPitchClass(semitoneOffsetFromC: number): PitchClass {
  Utils.assert((semitoneOffsetFromC >= 0) && (semitoneOffsetFromC < 12));

  switch(semitoneOffsetFromC) {
    case 0:
      return PitchClass.C;
    case 1:
      return PitchClass.CSharp;
    case 2:
      return PitchClass.D;
    case 3:
      return PitchClass.DSharp;
    case 4:
      return PitchClass.E;
    case 5:
      return PitchClass.F;
    case 6:
      return PitchClass.FSharp;
    case 7:
      return PitchClass.G;
    case 8:
      return PitchClass.GSharp;
    case 9:
      return PitchClass.A;
    case 10:
      return PitchClass.ASharp;
    case 11:
      return PitchClass.B;
    default:
      Utils.assert(false);
      return PitchClass.C;
  }
}
export function pitchClassToString(pitchClass: PitchClass): string {
  switch (pitchClass) {
    case PitchClass.C:
      return "C";
    case PitchClass.CSharp:
      return "C#";
    case PitchClass.DFlat:
      return "Db";
    case PitchClass.D:
      return "D";
    case PitchClass.DSharp:
      return "D#";
    case PitchClass.EFlat:
      return "Eb";
    case PitchClass.E:
      return "E";
    case PitchClass.F:
      return "F";
    case PitchClass.FSharp:
      return "F#";
    case PitchClass.GFlat:
      return "Gb";
    case PitchClass.G:
      return "G";
    case PitchClass.GSharp:
      return "G#";
    case PitchClass.AFlat:
      return "Ab";
    case PitchClass.A:
      return "A";
    case PitchClass.ASharp:
      return "A#";
    case PitchClass.BFlat:
      return "Bb";
    case PitchClass.B:
      return "B";
  }

  return Utils.assertUnreachable(pitchClass);
}
export function naturalizedPitchClass(pitchClass: PitchClass): PitchClass {
  switch(pitchClass) {
    case PitchClass.CSharp:
      return PitchClass.C;
    case PitchClass.DFlat:
      return PitchClass.D;
    case PitchClass.DSharp:
      return PitchClass.D;
    case PitchClass.EFlat:
      return PitchClass.E;
    case PitchClass.FSharp:
      return PitchClass.F;
    case PitchClass.GFlat:
      return PitchClass.G;
    case PitchClass.GSharp:
      return PitchClass.G;
    case PitchClass.AFlat:
      return PitchClass.A;
    case PitchClass.ASharp:
      return PitchClass.A;
    case PitchClass.BFlat:
      return PitchClass.B;
    default:
      return pitchClass;
  }
}

export class Pitch {
  public static readonly middleC = new Pitch(PitchClass.C, 4);

  public static fromMidiNoteNumber(midiNoteNumber: number): Pitch {
    const octaveNumber = -1 + Math.floor(midiNoteNumber / 12);
    const offsetFromC = midiNoteNumber % 12;
    const pitchClass = semitoneOffsetFromCToPitchClass(offsetFromC);

    return new Pitch(pitchClass, octaveNumber);
  }

  constructor(public pitchClass: PitchClass, public octaveNumber: number) {}
  get midiNoteNumber(): number {
    return midiNoteNumber(this);
  }
  toString() {
    return pitchClassToString(this.pitchClass) + this.octaveNumber;
  }
}

export const bassClefLowestPitch = new Pitch(PitchClass.G, 2);
export const bassClefHighestPitch = new Pitch(PitchClass.A, 3);
export const trebleClefLowestPitch = new Pitch(PitchClass.E, 4);
export const trebleClefHighestPitch = new Pitch(PitchClass.F, 5);

export function isNatural(pitch: Pitch): boolean {
  return !isAccidental(pitch);
}
export function isAccidental(pitch: Pitch): boolean {
  switch(pitch.pitchClass) {
    case PitchClass.CSharp:
    case PitchClass.DFlat:
    case PitchClass.DSharp:
    case PitchClass.EFlat:
    case PitchClass.FSharp:
    case PitchClass.GFlat:
    case PitchClass.GSharp:
    case PitchClass.AFlat:
    case PitchClass.ASharp:
    case PitchClass.BFlat:
      return true;
    default:
      return false;
  }
}
export function isSharp(pitch: Pitch): boolean {
  switch(pitch.pitchClass) {
    case PitchClass.CSharp:
    case PitchClass.DSharp:
    case PitchClass.FSharp:
    case PitchClass.GSharp:
    case PitchClass.ASharp:
      return true;
    default:
      return false;
  }
}
export function isFlat(pitch: Pitch): boolean {
  switch(pitch.pitchClass) {
    case PitchClass.DFlat:
    case PitchClass.EFlat:
    case PitchClass.GFlat:
    case PitchClass.AFlat:
    case PitchClass.BFlat:
      return true;
    default:
      return false;
  }
}
export function midiNoteNumber(pitch: Pitch): number {
  const cNoteNumberForOctave = 12 * (1 + pitch.octaveNumber);
  const offsetFromC = pitchClassToSemitoneOffsetFromC(pitch.pitchClass);

  return cNoteNumberForOctave + offsetFromC;
}
export function getOffsetInNaturalPitches(basePitch: Pitch, offsetPitch: Pitch): number {
  if(basePitch.midiNoteNumber === offsetPitch.midiNoteNumber) { return 0; }

  const lowerPitch = (basePitch.midiNoteNumber <= offsetPitch.midiNoteNumber) ? basePitch : offsetPitch;
  const higherPitch = (basePitch.midiNoteNumber > offsetPitch.midiNoteNumber) ? basePitch : offsetPitch;
  let lastNaturalizedPitchClass = naturalizedPitchClass(lowerPitch.pitchClass);
  let absOffsetInNaturalPitches = 0;
  
  for(let currentPitchMidiNoteNumber = lowerPitch.midiNoteNumber + 1; currentPitchMidiNoteNumber <= higherPitch.midiNoteNumber; currentPitchMidiNoteNumber++) {
    const currentPitch = Pitch.fromMidiNoteNumber(currentPitchMidiNoteNumber);
    const currentNaturalizedPitchClass = naturalizedPitchClass(currentPitch.pitchClass);

    if(currentNaturalizedPitchClass != lastNaturalizedPitchClass) {
      absOffsetInNaturalPitches++;
      lastNaturalizedPitchClass = currentNaturalizedPitchClass;
    }
  }

  const offsetSign = Math.sign(offsetPitch.midiNoteNumber - basePitch.midiNoteNumber);
  return offsetSign * absOffsetInNaturalPitches;
}
export function isOnLineInSheetMusic(pitch: Pitch): boolean {
  const absPitchOffsetInNaturalPitches = Math.abs(getOffsetInNaturalPitches(Pitch.middleC, pitch));

  return (absPitchOffsetInNaturalPitches % 2) == 0
}
export function isPitchInBassClef(pitch: Pitch): boolean {
  return (pitch.midiNoteNumber >= bassClefLowestPitch.midiNoteNumber) && (pitch.midiNoteNumber <= bassClefHighestPitch.midiNoteNumber);
}
export function isPitchInTrebleClef(pitch: Pitch): boolean {
  return (pitch.midiNoteNumber >= trebleClefLowestPitch.midiNoteNumber) && (pitch.midiNoteNumber <= trebleClefHighestPitch.midiNoteNumber);
}
export function isOnLedgerLineInGrandStaff(pitch: Pitch): boolean {
  return !isPitchInBassClef(pitch) && !isPitchInTrebleClef(pitch) && isOnLineInSheetMusic(pitch);
}
export function getVisibleLedgerLinesForPitch(pitch: Pitch): Pitch[] {
  if(pitch.midiNoteNumber === Pitch.middleC.midiNoteNumber) {
    return [Pitch.middleC];
  }

  if(pitch.midiNoteNumber > trebleClefHighestPitch.midiNoteNumber) {
    let ledgerLines: Pitch[] = [];

    for(let midiNoteNumber = trebleClefHighestPitch.midiNoteNumber + 1; midiNoteNumber <= pitch.midiNoteNumber; midiNoteNumber++) {
      const currentPitch = Pitch.fromMidiNoteNumber(midiNoteNumber);

      if(isOnLedgerLineInGrandStaff(currentPitch)) {
        ledgerLines.push(currentPitch);
      }
    }

    return ledgerLines;
  }

  if(pitch.midiNoteNumber < bassClefLowestPitch.midiNoteNumber) {
    let ledgerLines: Pitch[] = [];

    for(let midiNoteNumber = bassClefLowestPitch.midiNoteNumber - 1; midiNoteNumber >= pitch.midiNoteNumber; midiNoteNumber--) {
      const currentPitch = Pitch.fromMidiNoteNumber(midiNoteNumber);

      if(isOnLedgerLineInGrandStaff(currentPitch)) {
        ledgerLines.push(currentPitch);
      }
    }

    return ledgerLines;
  }
  
  return [];
}

export function renderStaff(width: number, height: number, x: number, y: number): JSX.Element {
  const spaceCount = 4;
  const lineCount = 5;
  const lineWidth = 2;
  const firstLineY = lineWidth / 2;
  const distanceBetweenLinesInStaff = (height - lineWidth) / spaceCount;
  const lineYs = (new Utils.IntRange(0, lineCount)).toArray().map((i: number) => firstLineY + (i * distanceBetweenLinesInStaff));

  return (
    <g transform={`translate(${x}, ${y})`}>
      {lineYs.map((y: number) => <line x1={0} y1={y} x2={width} y2={y} strokeWidth={lineWidth} stroke={"#000"} />)}
    </g>
  );
}

export function renderGrandStaffWithNote(width: number, height: number, x: number, y: number, notePitch: Pitch) {
  const staffHeightsInTotalHeight = 8; // treble, bass, margin between treble & bass, "staff" above treble, "staff" below bass, two spaces above treble + two spaces below bass, staff of padding at top and bottom
  const heightPerStaff = height / staffHeightsInTotalHeight;
  const lineWidth = 2;

  const clefMarginLeft = 5;
  const spaceCount = 4;
  const distanceBetweenLinesInStaff = (heightPerStaff - lineWidth) / spaceCount;

  const trebleStaffX = 0;
  const trebleStaffY = 2.5 * heightPerStaff;
  const bassStaffX = trebleStaffX;
  const bassStaffY = trebleStaffY + (2 * heightPerStaff);

  const trebleClefAspectRatio = 23.872036 / 65.035126;
  const trebleClefHeight = 1.5 * heightPerStaff;
  const trebleClefWidth = trebleClefAspectRatio * trebleClefHeight;
  const trebleClefAnchorYPercent = 0.64;
  const topTrebleClefLineY = trebleStaffY + (lineWidth / 2);
  const trebleClefAnchorY = topTrebleClefLineY + (3 * distanceBetweenLinesInStaff);
  const trebleClefLeftX = trebleStaffX + clefMarginLeft;
  const trebleClefTopY = trebleClefAnchorY - (trebleClefAnchorYPercent * trebleClefHeight);
  const lowestTrebleClefPitch = new Pitch(PitchClass.C, 4);
  const bottomTrebleClefLinePitch = new Pitch(PitchClass.E, 4);
  const bottomTrebleClefLineY = topTrebleClefLineY + (4 * distanceBetweenLinesInStaff);

  const bassClefAspectRatio = 18 / 20;
  const bassClefHeight = (3 / 4) * heightPerStaff;
  const bassClefWidth = bassClefAspectRatio * bassClefHeight;
  const bassClefAnchorYPercent = 0.3;
  const topBassClefLineY = bassStaffY + (lineWidth / 2);
  const bassClefAnchorY = topBassClefLineY + distanceBetweenLinesInStaff;
  const bassClefLeftX = bassStaffX + clefMarginLeft;
  const bassClefTopY = bassClefAnchorY - (bassClefAnchorYPercent * bassClefHeight);
  const lastBassClefPitch = new Pitch(PitchClass.B, 3);
  const bottomBassClefLinePitch = new Pitch(PitchClass.G, 2);
  const bottomBassClefLineY = topBassClefLineY + (4 * distanceBetweenLinesInStaff);

  const staffConnectingLineX1 = lineWidth / 2;
  const staffConnectingLineY1 = trebleStaffY;
  const staffConnectingLineX2 = staffConnectingLineX1;
  const staffConnectingLineY2 = bassStaffY + heightPerStaff;
  
  const quarterNoteAspectRatio = 14.565798 / 41.169685;
  const quarterNoteHeight = heightPerStaff;
  const quarterNoteWidth = quarterNoteAspectRatio * quarterNoteHeight;
  const quarterNoteAnchorXPercent = 0.5;
  const quarterNoteAnchorYPercent = 0.85;

  const sharpSymbolAspectRatio = 6.8493137 / 18.679947;
  const sharpSymbolHeight = (3 / 4) * heightPerStaff;
  const sharpSymbolWidth = sharpSymbolAspectRatio * sharpSymbolHeight;
  const sharpSymbolAnchorXPercent = 0.5;
  const sharpSymbolAnchorYPercent = 0.5;

  const flatSymbolAspectRatio = 5.6537971 / 15.641341;
  const flatSymbolHeight = (3 / 4) * heightPerStaff;
  const flatSymbolWidth = flatSymbolAspectRatio * flatSymbolHeight;
  const flatSymbolAnchorXPercent = 0.5;
  const flatSymbolAnchorYPercent = 0.8;

  const pitchToY = (pitch: Pitch) => {
    const isNoteOnTrebleClef = pitch.midiNoteNumber >= lowestTrebleClefPitch.midiNoteNumber;
    const clefBottomLinePitch = isNoteOnTrebleClef ? bottomTrebleClefLinePitch : bottomBassClefLinePitch;
    const clefBottomLineY = isNoteOnTrebleClef ? bottomTrebleClefLineY : bottomBassClefLineY;
    return clefBottomLineY - (getOffsetInNaturalPitches(clefBottomLinePitch, pitch) * (distanceBetweenLinesInStaff / 2));
  };
  
  const noteAnchorX = (1 / 2) * width;
  const noteAnchorY = pitchToY(notePitch);
  const noteLeftX = noteAnchorX - (quarterNoteAnchorXPercent * quarterNoteWidth);
  const noteTopY = noteAnchorY - (quarterNoteAnchorYPercent * quarterNoteHeight);

  const accidentalAnchorX = noteAnchorX - quarterNoteWidth;
  const accidentalAnchorY = noteAnchorY;

  const sharpSymbolLeftX = accidentalAnchorX - (sharpSymbolAnchorXPercent * sharpSymbolWidth);
  const sharpSymbolTopY = accidentalAnchorY - (sharpSymbolAnchorYPercent * sharpSymbolHeight);

  const flatSymbolLeftX = accidentalAnchorX - (flatSymbolAnchorXPercent * flatSymbolWidth);
  const flatSymbolTopY = accidentalAnchorY - (flatSymbolAnchorYPercent * flatSymbolHeight);

  const ledgerLineWidth = 1.5 * quarterNoteWidth;
  const visibleLedgerLinePitches = getVisibleLedgerLinesForPitch(notePitch);

  const ledgerLineX1 = noteAnchorX - (ledgerLineWidth / 2);
  const ledgerLineX2 = noteAnchorX + (ledgerLineWidth / 2);
  const ledgerLines = visibleLedgerLinePitches.map((pitch: Pitch) => {
    const y = pitchToY(pitch);
    return <line x1={ledgerLineX1} y1={y} x2={ledgerLineX2} y2={y} strokeWidth={lineWidth} stroke={"#000"} />;
  });

  return (
    <g transform={`translate(${x}, ${y})`}>
      {renderStaff(width, heightPerStaff, trebleStaffX, trebleStaffY)}
      <image x={trebleClefLeftX} y={trebleClefTopY} width={trebleClefWidth} height={trebleClefHeight} xlinkHref="img/treble-clef.svg" />
      
      {renderStaff(width, heightPerStaff, bassStaffX, bassStaffY)}
      <image x={bassClefLeftX} y={bassClefTopY} width={bassClefWidth} height={bassClefHeight} xlinkHref="img/bass-clef.svg" />

      <line x1={staffConnectingLineX1} y1={staffConnectingLineY1} x2={staffConnectingLineX2} y2={staffConnectingLineY2} strokeWidth={lineWidth} stroke={"#000"} />

      {ledgerLines}
      <image x={noteLeftX} y={noteTopY} width={quarterNoteWidth} height={quarterNoteHeight} xlinkHref="img/quarter-note.svg" />
      {isSharp(notePitch) ? <image x={sharpSymbolLeftX} y={sharpSymbolTopY} width={sharpSymbolWidth} height={sharpSymbolHeight} xlinkHref="img/sharp-symbol.svg" /> : null}
      {isFlat(notePitch) ? <image x={flatSymbolLeftX} y={flatSymbolTopY} width={flatSymbolWidth} height={flatSymbolHeight} xlinkHref="img/flat-symbol.svg" /> : null}
    </g>
  );
}
export function renderPiano(width: number, height: number, onKeyPressed: (keyPitch: Pitch) => void): JSX.Element {
  const keyCount = 88;
  const firstKeyPitch = new Pitch(PitchClass.A, 0);
  const keyPitches = (new Utils.IntRange(firstKeyPitch.midiNoteNumber, keyCount)).toArray().map(midiNoteNumber => Pitch.fromMidiNoteNumber(midiNoteNumber));
  const naturalKeyCount = keyPitches.reduce((acc: number, pitch: Pitch) => isNatural(pitch) ? (acc + 1) : acc, 0);
  const keyStrokeWidth = 2;
  const firstNaturalKeyX = keyStrokeWidth / 2;
  const firstNaturalKeyY = keyStrokeWidth / 2;
  const naturalKeyWidth = (width - keyStrokeWidth) / naturalKeyCount; // Assuming piano starts and ends with natural keys.
  const naturalKeyHeight = height - keyStrokeWidth;
  const accidentalKeyWidth = 0.55 * naturalKeyWidth;
  const accidentalKeyHeight = 0.6 * naturalKeyHeight;

  const renderPianoKey = (pitch: Pitch, x: number, y: number) => {
    const isNaturalKey = isNatural(pitch);
    const width = isNaturalKey ? naturalKeyWidth : accidentalKeyWidth;
    const height = isNaturalKey ? naturalKeyHeight : accidentalKeyHeight;
    const fill = isNaturalKey ? "#FFF" : "#000";
    return <rect width={width} height={height} fill={fill} strokeWidth={keyStrokeWidth} stroke="#000" x={x} y={y} onClick={() => onKeyPressed(pitch)} />;
  };
  
  let naturalKeyX = firstNaturalKeyX;
  let naturalKeyY = firstNaturalKeyY;

  const keyXs = keyPitches.map((pitch: Pitch, index: number) => {
    if((index > 0) && isNatural(pitch)) {
      naturalKeyX += naturalKeyWidth;
    }

    const accidentalOffset = isAccidental(pitch) ? (naturalKeyWidth - (accidentalKeyWidth / 2)) : 0;
    return naturalKeyX + accidentalOffset;
  });
  const renderNaturalKeys = () => keyPitches.map((pitch: Pitch, index: number) => isNatural(pitch) ? renderPianoKey(pitch, keyXs[index], naturalKeyY) : null);
  const renderAccidentalKeys = () => keyPitches.map((pitch: Pitch, index: number) => isAccidental(pitch) ? renderPianoKey(pitch, keyXs[index], naturalKeyY) : null);

  return (
    <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={width} height={height}>
      {renderNaturalKeys()}
      {renderAccidentalKeys()}
    </svg>
  );
}

export interface SightReadingExercisesProps {}
export interface SightReadingExercisesState {
  pressedPitch: Pitch;
}

export class SightReadingExercises extends React.Component<SightReadingExercisesProps, SightReadingExercisesState> {
  constructor(props: SightReadingExercisesProps) {
    super(props);

    this.state = {
      pressedPitch: new Pitch(PitchClass.A, 4)
    };
  }

  onKeyPressed(pitch: Pitch) {
    this.setState({ pressedPitch: pitch })
  }

  render(): JSX.Element {
    //<circle cx={10} cy={spaceCenterYInStaff(staffHeight, )} r={noteHeight / 2} fill="#000" />
    const grandStaffWidth = 160;
    const grandStaffHeight = 300;
    const grandStaffTopMargin = 20;

    return (
      <div>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={grandStaffWidth} height={grandStaffTopMargin + grandStaffHeight}>
          {renderGrandStaffWithNote(grandStaffWidth, grandStaffHeight, 0, grandStaffTopMargin, this.state.pressedPitch)}
        </svg>  
        {renderPiano(960, 180, this.onKeyPressed.bind(this))}
      </div>
    );
  }
}