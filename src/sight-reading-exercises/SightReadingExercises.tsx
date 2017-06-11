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

export interface SightReadingExercisesProps {}
export interface SightReadingExercisesState {
}

export class SightReadingExercises extends React.Component<SightReadingExercisesProps, SightReadingExercisesState> {
  constructor(props: SightReadingExercisesProps) {
    super(props);

    this.state = {};
  }
  renderStaff(width: number, height: number): JSX.Element {
    const spaceCount = 4;
    const spaceHeight = height / spaceCount;
    const lineCount = spaceCount + 1
    const lineYs = (new Utils.IntRange(0, lineCount)).toArray().map((i: number) => i * spaceHeight);

    return (
      <svg width={width} height={height}>
        {lineYs.map((y: number) => <line x1={0} y1={y} x2={width} y2={y} strokeWidth={1} stroke={"#000"} />)}
      </svg>
    );
  }
  renderPiano(): JSX.Element {
    const pianoWidth = 960;
    const pianoHeight = 200;
    const keyCount = 88;
    const firstKeyPitch = new Pitch(PitchClass.A, 0);
    const keyPitches = (new Utils.IntRange(firstKeyPitch.midiNoteNumber, keyCount)).toArray().map(midiNoteNumber => Pitch.fromMidiNoteNumber(midiNoteNumber));
    const naturalKeyCount = keyPitches.reduce((acc: number, pitch: Pitch) => isNatural(pitch) ? (acc + 1) : acc, 0);
    const naturalKeyWidth = pianoWidth / naturalKeyCount; // Assuming piano starts and ends with natural keys.
    const naturalKeyHeight = pianoHeight;
    const accidentalKeyWidth = 0.55 * naturalKeyWidth;
    const accidentalKeyHeight = 0.6 * naturalKeyHeight;

    const renderPianoKey = (pitch: Pitch, x: number, y: number) => {
      const isNaturalKey = isNatural(pitch);
      const width = isNaturalKey ? naturalKeyWidth : accidentalKeyWidth;
      const height = isNaturalKey ? naturalKeyHeight : accidentalKeyHeight;
      const fill = isNaturalKey ? "#FFF" : "#000";
      return <rect width={width} height={height} fill={fill} strokeWidth={1} stroke="#000" x={x} y={y} />;
    };
    
    let naturalKeyX = 0;
    let naturalKeyY = 0;

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
      <svg width={pianoWidth} height={pianoHeight}>
        {renderNaturalKeys()}
        {renderAccidentalKeys()}
      </svg>
    );
  }
  render(): JSX.Element {
    return (
      <div>
        {this.renderStaff(256, 100)}
        {this.renderPiano()}
      </div>
    );
  }
}