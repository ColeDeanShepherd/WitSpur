import * as Utils from "./Utils";

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

  public constructor(public pitchClass: PitchClass, public octaveNumber: number) {}
  public get midiNoteNumber(): number {
    return midiNoteNumber(this);
  }
  public toString() {
    return pitchClassToString(this.pitchClass) + this.octaveNumber;
  }
}

export const highestLedgerLinePitchBelowBassClef = new Pitch(PitchClass.E, 2);
export const bassClefLowestPitch = new Pitch(PitchClass.G, 2);
export const bassClefHighestPitch = new Pitch(PitchClass.A, 3);
export const trebleClefLowestPitch = new Pitch(PitchClass.E, 4);
export const trebleClefHighestPitch = new Pitch(PitchClass.F, 5);
export const lowestLedgerLinePitchAboveTrebleClef = new Pitch(PitchClass.A, 5);

export const lowestPitchOn88KeyPiano = new Pitch(PitchClass.A, 0);
export const highestPitchOn88KeyPiano = new Pitch(PitchClass.C, 8);

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

  if(pitch.midiNoteNumber >= lowestLedgerLinePitchAboveTrebleClef.midiNoteNumber) {
    let ledgerLines: Pitch[] = [];

    for(let midiNoteNumber = lowestLedgerLinePitchAboveTrebleClef.midiNoteNumber; midiNoteNumber <= pitch.midiNoteNumber; midiNoteNumber++) {
      const currentPitch = Pitch.fromMidiNoteNumber(midiNoteNumber);

      if(isOnLedgerLineInGrandStaff(currentPitch)) {
        ledgerLines.push(currentPitch);
      }
    }

    return ledgerLines;
  }

  if(pitch.midiNoteNumber <= highestLedgerLinePitchBelowBassClef.midiNoteNumber) {
    let ledgerLines: Pitch[] = [];

    for(let midiNoteNumber = highestLedgerLinePitchBelowBassClef.midiNoteNumber; midiNoteNumber >= pitch.midiNoteNumber; midiNoteNumber--) {
      const currentPitch = Pitch.fromMidiNoteNumber(midiNoteNumber);

      if(isOnLedgerLineInGrandStaff(currentPitch)) {
        ledgerLines.push(currentPitch);
      }
    }

    return ledgerLines;
  }
  
  return [];
}

export function getRandomPitch(lowestPitch: Pitch, highestPitch: Pitch): Pitch {
  Utils.assert(lowestPitch.midiNoteNumber <= highestPitch.midiNoteNumber);
  
  const pitchDistanceInSemitones = highestPitch.midiNoteNumber - lowestPitch.midiNoteNumber;

  return Pitch.fromMidiNoteNumber(Utils.randomInt(lowestPitch.midiNoteNumber, highestPitch.midiNoteNumber));
}
export function getRandomPitchOn88KeyPiano(): Pitch {
  return getRandomPitch(lowestPitchOn88KeyPiano, highestPitchOn88KeyPiano);
}