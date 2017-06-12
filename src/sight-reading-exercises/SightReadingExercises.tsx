import * as React from "react";

import * as Utils from "../Utils";

export enum PitchClass {
  C = 0,
  CSharpDFlat = 1,
  D = 2,
  DSharpEFlat = 3,
  E = 4,
  F = 5,
  FSharpGFlat = 6,
  G = 7,
  GSharpAFlat = 8,
  A = 9,
  ASharpBFlat = 10,
  B = 11
}
export function pitchClassToString(pitchClass: PitchClass): string {
  switch (pitchClass) {
    case PitchClass.C:
      return "C";
    case PitchClass.CSharpDFlat:
      return "C#/Db";
    case PitchClass.D:
      return "D";
    case PitchClass.DSharpEFlat:
      return "D#/Eb";
    case PitchClass.E:
      return "E";
    case PitchClass.F:
      return "F";
    case PitchClass.FSharpGFlat:
      return "F#/Gb";
    case PitchClass.G:
      return "G";
    case PitchClass.GSharpAFlat:
      return "G#/Ab";
    case PitchClass.A:
      return "A";
    case PitchClass.ASharpBFlat:
      return "A#/Bb";
    case PitchClass.B:
      return "B";
  }
}

export class Pitch {
  public static fromMidiNoteNumber(midiNoteNumber: number): Pitch {
    const octaveNumber = -1 + Math.floor(midiNoteNumber / 12);
    const offsetFromC = midiNoteNumber % 12;
    const pitchClass = offsetFromC as PitchClass;

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
export function isNatural(pitch: Pitch): boolean {
  return !isAccidental(pitch);
}
export function isAccidental(pitch: Pitch): boolean {
  switch(pitch.pitchClass) {
    case PitchClass.CSharpDFlat:
    case PitchClass.DSharpEFlat:
    case PitchClass.FSharpGFlat:
    case PitchClass.GSharpAFlat:
    case PitchClass.ASharpBFlat:
      return true;
    default:
      return false;
  }
}
export function midiNoteNumber(pitch: Pitch): number {
  const cNoteNumberForOctave = 12 * (1 + pitch.octaveNumber);
  const offsetFromC = pitch.pitchClass as number;

  return cNoteNumberForOctave + offsetFromC;
}
export function getOffsetInNaturalPitches(basePitch: Pitch, offsetPitch: Pitch): number {
  if(basePitch.midiNoteNumber === offsetPitch.midiNoteNumber) { return 0; }

  const offsetSign = Math.sign(offsetPitch.midiNoteNumber - basePitch.midiNoteNumber);
  let offsetInNaturalPitches = 0;
  let currentPitchMidiNoteNumber = basePitch.midiNoteNumber;

  while(currentPitchMidiNoteNumber != offsetPitch.midiNoteNumber) {
    if(isNatural(Pitch.fromMidiNoteNumber(currentPitchMidiNoteNumber))) {
      offsetInNaturalPitches += offsetSign;
    }
    
    currentPitchMidiNoteNumber += offsetSign;
  }

  return offsetInNaturalPitches;
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
  const spaceBetweenStaffs = height / 3;
  const heightPerStaff = (height - spaceBetweenStaffs) / 2;
  const lineWidth = 2;
  const staffConnectingLineX = lineWidth / 2;

  const trebleClefAspectRatio = 23.872036 / 65.035126;
  const bassClefAspectRatio = 18 / 20;
  const quarterNoteAspectRatio = 14.565798 / 41.169685;

  const trebleStaffX = 0;
  const trebleStaffY = 0;
  const bassStaffX = 0;
  const bassStaffY = heightPerStaff + spaceBetweenStaffs;

  const trebleClefHeight = 1.5 * heightPerStaff;
  const trebleClefWidth = trebleClefAspectRatio * trebleClefHeight;
  const bassClefHeight = (3 / 4) * heightPerStaff;
  const bassClefWidth = bassClefAspectRatio * bassClefHeight;
  const quarterNoteHeight = heightPerStaff;
  const quarterNoteWidth = quarterNoteAspectRatio * quarterNoteHeight;

  const trebleClefAnchorYPercent = 0.64;
  const bassClefAnchorYPercent = 0.3;
  const quarterNoteAnchorXPercent = 0.5;
  const quarterNoteAnchorYPercent = 0.85;

  const clefMarginLeft = 5;
  const spaceCount = 4;
  const distanceBetweenLinesInStaff = (heightPerStaff - lineWidth) / spaceCount;

  const topTrebleClefLineY = trebleStaffY + (lineWidth / 2);
  const topBassClefLineY = bassStaffY + (lineWidth / 2);
  
  const trebleClefAnchorY = topTrebleClefLineY + (3 * distanceBetweenLinesInStaff);
  const bassClefAnchorY = topBassClefLineY + distanceBetweenLinesInStaff;

  const trebleClefLeftX = trebleStaffX + clefMarginLeft;
  const trebleClefTopY = trebleClefAnchorY - (trebleClefAnchorYPercent * trebleClefHeight);
  const bassClefLeftX = bassStaffX + clefMarginLeft;
  const bassClefTopY = bassClefAnchorY - (bassClefAnchorYPercent * bassClefHeight);
  
  const lowestTrebleClefPitch = new Pitch(PitchClass.C, 4);
  const bottomTrebleClefLinePitch = new Pitch(PitchClass.E, 4);
  const bottomTrebleClefLineY = topTrebleClefLineY + (4 * distanceBetweenLinesInStaff);

  const lastBassClefPitch = new Pitch(PitchClass.B, 3);
  const bottomBassClefLinePitch = new Pitch(PitchClass.G, 2);
  const bottomBassClefLineY = topBassClefLineY + (4 * distanceBetweenLinesInStaff);

  const isNoteOnTrebleClef = notePitch.midiNoteNumber >= lowestTrebleClefPitch.midiNoteNumber;
  const clefBottomLinePitch = isNoteOnTrebleClef ? bottomTrebleClefLinePitch : bottomBassClefLinePitch;
  const clefBottomLineY = isNoteOnTrebleClef ? bottomTrebleClefLineY : bottomBassClefLineY;
  const noteAnchorX = width / 2;
  const noteAnchorY = clefBottomLineY - (getOffsetInNaturalPitches(clefBottomLinePitch, notePitch) * (distanceBetweenLinesInStaff / 2));
  const noteLeftX = noteAnchorX - (quarterNoteAnchorXPercent * quarterNoteWidth);
  const noteTopY = noteAnchorY - (quarterNoteAnchorYPercent * quarterNoteHeight);

  return (
    <g transform={`translate(${x}, ${y})`}>
      {renderStaff(width, heightPerStaff, trebleStaffX, trebleStaffY)}
      <image x={trebleClefLeftX} y={trebleClefTopY} width={trebleClefWidth} height={trebleClefHeight} xlinkHref="img/treble-clef.svg" />
      
      {renderStaff(width, heightPerStaff, bassStaffX, bassStaffY)}
      <image x={bassClefLeftX} y={bassClefTopY} width={bassClefWidth} height={bassClefHeight} xlinkHref="img/bass-clef.svg" />

      <line x1={staffConnectingLineX} y1={0} x2={staffConnectingLineX} y2={height} strokeWidth={lineWidth} stroke={"#000"} />

      <image x={noteLeftX} y={noteTopY} width={quarterNoteWidth} height={quarterNoteHeight} xlinkHref="img/quarter-note.svg" />
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
    const grandStaffHeight = 200;
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