import * as React from "react";

import * as Utils from "../Utils";
import * as Pitch from "../Pitch";

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

export class OneMeasureGrandStaffLayout {
  // public readonly : number;
  public readonly containerWidth: number;
  public readonly containerHeight: number;

  public readonly lineWidth: number;

  public readonly heightPerStaff: number;

  public readonly trebleStaffLeftX: number;
  public readonly trebleStaffTopY: number;
  public readonly trebleStaffBottomY: number;

  public readonly bassStaffLeftX: number;
  public readonly bassStaffTopY: number;
  public readonly bassStaffBottomY: number;

  public readonly staffSpaceHeight: number;

  public readonly trebleClefWidth: number;
  public readonly trebleClefHeight: number;

  public readonly bassClefWidth: number;
  public readonly bassClefHeight: number;

  public readonly quarterNoteWidth: number;
  public readonly quarterNoteHeight: number;

  public readonly sharpSymbolWidth: number;
  public readonly sharpSymbolHeight: number;

  public readonly flatSymbolWidth: number;
  public readonly flatSymbolHeight: number;

  public readonly ledgerLineWidth: number;

  public constructor(containerWidth: number, containerHeight: number, lineWidth: number) {
    this.containerWidth = containerWidth;
    this.containerHeight = containerHeight;
    
    this.lineWidth = lineWidth;

    const containerPaddingTopOrBottomInStaffHeights = 1 / 2;
    const heightOfLedgerLinesAboveTrebleStaffOrBelowBassStaffInStaffHeights = 2.5;
    const spaceBetweenTrebleAndBassStaffsInStaffHeights = 1;
    
    const totalHeightAboveTrebleStaffOrBelowBassStaffInStaffHeights = (
      containerPaddingTopOrBottomInStaffHeights +
      heightOfLedgerLinesAboveTrebleStaffOrBelowBassStaffInStaffHeights
    );
    const containerHeightInStaffHeights = (
      totalHeightAboveTrebleStaffOrBelowBassStaffInStaffHeights + 
      1 + // treble staff
      spaceBetweenTrebleAndBassStaffsInStaffHeights +
      1 + // bass staff
      totalHeightAboveTrebleStaffOrBelowBassStaffInStaffHeights
    );
    
    this.heightPerStaff = this.containerHeight / containerHeightInStaffHeights;

    this.trebleStaffLeftX = 0;
    this.trebleStaffTopY = totalHeightAboveTrebleStaffOrBelowBassStaffInStaffHeights * this.heightPerStaff;
    this.trebleStaffBottomY = this.trebleStaffTopY + this.heightPerStaff;

    this.bassStaffLeftX = 0;
    this.bassStaffTopY = this.trebleStaffBottomY + (spaceBetweenTrebleAndBassStaffsInStaffHeights * this.heightPerStaff);
    this.bassStaffBottomY = this.bassStaffTopY + this.heightPerStaff;

    const spaceCountPerStaff = 4;
    this.staffSpaceHeight = this.heightPerStaff / spaceCountPerStaff;

    const trebleClefAspectRatio = 23.872036 / 65.035126;
    this.trebleClefHeight = 1.5 * this.heightPerStaff;
    this.trebleClefWidth = trebleClefAspectRatio * this.trebleClefHeight;

    const bassClefAspectRatio = 18 / 20;
    this.bassClefHeight = (3 / 4) * this.heightPerStaff;
    this.bassClefWidth = bassClefAspectRatio * this.bassClefHeight;

    const quarterNoteAspectRatio = 14.565798 / 41.169685;
    this.quarterNoteHeight = this.heightPerStaff;
    this.quarterNoteWidth = quarterNoteAspectRatio * this.quarterNoteHeight;

    const sharpSymbolAspectRatio = 6.8493137 / 18.679947;
    this.sharpSymbolHeight = (3 / 4) * this.heightPerStaff;
    this.sharpSymbolWidth = sharpSymbolAspectRatio * this.sharpSymbolHeight;

    const flatSymbolAspectRatio = 5.6537971 / 15.641341;
    this.flatSymbolHeight = (3 / 4) * this.heightPerStaff;
    this.flatSymbolWidth = flatSymbolAspectRatio * this.flatSymbolHeight;

    this.ledgerLineWidth = 1.5 * this.quarterNoteWidth;
  }
  public pitchToY(pitch: Pitch.Pitch): number {
    const isNoteOnTrebleClef = pitch.midiNoteNumber >= Pitch.trebleClefLowestPitch.midiNoteNumber;
    const clefBottomLinePitch = isNoteOnTrebleClef ? Pitch.trebleClefLowestPitch : Pitch.bassClefLowestPitch;
    const clefBottomLineY = isNoteOnTrebleClef ? this.trebleStaffBottomY : this.bassStaffBottomY;
    return clefBottomLineY - (Pitch.getOffsetInNaturalPitches(clefBottomLinePitch, pitch) * (this.staffSpaceHeight / 2));
  };
}

const quarterNoteAnchorXPercent = 0.5;
const quarterNoteAnchorYPercent = 0.85;
const sharpSymbolAnchorXPercent = 0.5;
const sharpSymbolAnchorYPercent = 0.5;
const flatSymbolAnchorXPercent = 0.5;
const flatSymbolAnchorYPercent = 0.8;

export function renderQuarterNoteAndAccidentalSymbolAndLedgerLines(layout: OneMeasureGrandStaffLayout, notePitch: Pitch.Pitch, noteAnchorX: number) {
  const noteAnchorY = layout.pitchToY(notePitch);
  const noteLeftX = noteAnchorX - (quarterNoteAnchorXPercent * layout.quarterNoteWidth);
  const noteTopY = noteAnchorY - (quarterNoteAnchorYPercent * layout.quarterNoteHeight);

  const accidentalAnchorX = noteAnchorX - layout.quarterNoteWidth;
  const accidentalAnchorY = noteAnchorY;

  const sharpSymbolLeftX = accidentalAnchorX - (sharpSymbolAnchorXPercent * layout.sharpSymbolWidth);
  const sharpSymbolTopY = accidentalAnchorY - (sharpSymbolAnchorYPercent * layout.sharpSymbolHeight);

  const flatSymbolLeftX = accidentalAnchorX - (flatSymbolAnchorXPercent * layout.flatSymbolWidth);
  const flatSymbolTopY = accidentalAnchorY - (flatSymbolAnchorYPercent * layout.flatSymbolHeight);

  const visibleLedgerLinePitches = Pitch.getVisibleLedgerLinesForPitch(notePitch);

  const ledgerLineX1 = noteAnchorX - (layout.ledgerLineWidth / 2);
  const ledgerLineX2 = noteAnchorX + (layout.ledgerLineWidth / 2);
  const ledgerLines = visibleLedgerLinePitches.map((pitch: Pitch.Pitch) => {
    const y = layout.pitchToY(pitch);
    return <line x1={ledgerLineX1} y1={y} x2={ledgerLineX2} y2={y} strokeWidth={layout.lineWidth} stroke={"#000"} />;
  });

  return (
    <g>
      {ledgerLines}
      <image x={noteLeftX} y={noteTopY} width={layout.quarterNoteWidth} height={layout.quarterNoteHeight} xlinkHref="img/quarter-note.svg" />
      {Pitch.isSharp(notePitch) ? <image x={sharpSymbolLeftX} y={sharpSymbolTopY} width={layout.sharpSymbolWidth} height={layout.sharpSymbolHeight} xlinkHref="img/sharp-symbol.svg" /> : null}
      {Pitch.isFlat(notePitch) ? <image x={flatSymbolLeftX} y={flatSymbolTopY} width={layout.flatSymbolWidth} height={layout.flatSymbolHeight} xlinkHref="img/flat-symbol.svg" /> : null}
    </g>
  );
}

export function renderGrandStaffWithNote(layout: OneMeasureGrandStaffLayout, x: number, y: number, notePitches: (Pitch.Pitch | null)[]) {
  const clefMarginLeft = 5;

  const trebleClefAnchorYPercent = 0.64;
  const trebleClefAnchorY = layout.trebleStaffTopY + (3 * layout.staffSpaceHeight);
  const trebleClefLeftX = layout.trebleStaffLeftX + clefMarginLeft;
  const trebleClefTopY = trebleClefAnchorY - (trebleClefAnchorYPercent * layout.trebleClefHeight);
  
  const bassClefAnchorYPercent = 0.3;
  const bassClefAnchorY = layout.bassStaffTopY + layout.staffSpaceHeight;
  const bassClefLeftX = layout.bassStaffLeftX + clefMarginLeft;
  const bassClefTopY = bassClefAnchorY - (bassClefAnchorYPercent * layout.bassClefHeight);

  const staffConnectingLineX1 = layout.lineWidth / 2;
  const staffConnectingLineY1 = layout.trebleStaffTopY;
  const staffConnectingLineX2 = staffConnectingLineX1;
  const staffConnectingLineY2 = layout.bassStaffBottomY;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {renderStaff(layout.containerWidth, layout.heightPerStaff, layout.trebleStaffLeftX, layout.trebleStaffTopY)}
      <image x={trebleClefLeftX} y={trebleClefTopY} width={layout.trebleClefWidth} height={layout.trebleClefHeight} xlinkHref="img/treble-clef.svg" />
      
      {renderStaff(layout.containerWidth, layout.heightPerStaff, layout.bassStaffLeftX, layout.bassStaffTopY)}
      <image x={bassClefLeftX} y={bassClefTopY} width={layout.bassClefWidth} height={layout.bassClefHeight} xlinkHref="img/bass-clef.svg" />

      <line x1={staffConnectingLineX1} y1={staffConnectingLineY1} x2={staffConnectingLineX2} y2={staffConnectingLineY2} strokeWidth={layout.lineWidth} stroke={"#000"} />

      {notePitches.map(notePitch => notePitch ? renderQuarterNoteAndAccidentalSymbolAndLedgerLines(layout, notePitch, (1 / 2) * layout.containerWidth) : null)}
    </g>
  );
}

export interface PianoProps {
  width: number;
  height: number;
  pressedKeys: Pitch.Pitch[];
  onKeyPressed: (onKeyPressed: Pitch.Pitch) => void;
  onKeyReleased: (onKeyPressed: Pitch.Pitch) => void;
}
export interface PianoState {}
export class Piano extends React.Component<PianoProps, PianoState> {
  isMouseDown: boolean;
  boundOnMouseDown: (event: any) => void;
  boundOnMouseUp: (event: any) => void;

  onMouseDown(event: any) {
    this.isMouseDown = true;
  }
  onMouseUp(event: any) {
    this.isMouseDown = false;
  }
  componentDidMount() {
    this.boundOnMouseDown = this.onMouseDown.bind(this);
    this.boundOnMouseUp = this.onMouseUp.bind(this);

    window.addEventListener("mousedown", this.boundOnMouseDown, false);
    window.addEventListener("mouseup", this.boundOnMouseUp, false);
  }
  componentWillUnmount() {
    window.removeEventListener("mousedown", this.boundOnMouseDown, false);
    window.removeEventListener("mouseup", this.boundOnMouseUp, false);
  }
  render() {
    const keyCount = 88;
    const firstKeyPitch = Pitch.lowestPitchOn88KeyPiano;
    const keyPitches = (new Utils.IntRange(firstKeyPitch.midiNoteNumber, keyCount)).toArray().map(midiNoteNumber => Pitch.Pitch.fromMidiNoteNumber(midiNoteNumber));
    const naturalKeyCount = keyPitches.reduce((acc: number, pitch: Pitch.Pitch) => Pitch.isNatural(pitch) ? (acc + 1) : acc, 0);
    const keyStrokeWidth = 2;
    const firstNaturalKeyX = keyStrokeWidth / 2;
    const firstNaturalKeyY = keyStrokeWidth / 2;
    const naturalKeyWidth = (this.props.width - keyStrokeWidth) / naturalKeyCount; // Assuming piano starts and ends with natural keys.
    const naturalKeyHeight = this.props.height - keyStrokeWidth;
    const accidentalKeyWidth = 0.55 * naturalKeyWidth;
    const accidentalKeyHeight = 0.6 * naturalKeyHeight;

    const renderPianoKey = (pitch: Pitch.Pitch, x: number, y: number) => {
      const isNaturalKey = Pitch.isNatural(pitch);
      const width = isNaturalKey ? naturalKeyWidth : accidentalKeyWidth;
      const height = isNaturalKey ? naturalKeyHeight : accidentalKeyHeight;
      const defaultFill = isNaturalKey ? "#FFF" : "#000";
      const pressedFill = "#CCC";
      const isKeyPressed = this.props.pressedKeys.find((pressedPitch: Pitch.Pitch) => pressedPitch.midiNoteNumber === pitch.midiNoteNumber);
      const fill = isKeyPressed ? pressedFill : defaultFill;
      const onMouseOver = () => {
        if(this.isMouseDown) {
          this.props.onKeyPressed(pitch);
        }
      };
      const onMouseOut = () => {
        if(isKeyPressed) {
          this.props.onKeyReleased(pitch);
        }
      };

      return <rect width={width} height={height} fill={fill} strokeWidth={keyStrokeWidth} stroke="#000" x={x} y={y} onMouseOver={onMouseOver.bind(this)} onMouseOut={onMouseOut.bind(this)} onMouseDown={() => this.props.onKeyPressed(pitch)} onMouseUp={() => this.props.onKeyReleased(pitch)} className="piano-key" />;
    };
    
    let naturalKeyX = firstNaturalKeyX;
    let naturalKeyY = firstNaturalKeyY;

    const keyXs = keyPitches.map((pitch: Pitch.Pitch, index: number) => {
      if((index > 0) && Pitch.isNatural(pitch)) {
        naturalKeyX += naturalKeyWidth;
      }

      const accidentalOffset = Pitch.isAccidental(pitch) ? (naturalKeyWidth - (accidentalKeyWidth / 2)) : 0;
      return naturalKeyX + accidentalOffset;
    });
    const renderNaturalKeys = () => keyPitches.map((pitch: Pitch.Pitch, index: number) => Pitch.isNatural(pitch) ? renderPianoKey(pitch, keyXs[index], naturalKeyY) : null);
    const renderAccidentalKeys = () => keyPitches.map((pitch: Pitch.Pitch, index: number) => Pitch.isAccidental(pitch) ? renderPianoKey(pitch, keyXs[index], naturalKeyY) : null);

    return (
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={this.props.width} height={this.props.height}>
        {renderNaturalKeys()}
        {renderAccidentalKeys()}
      </svg>
    );
  }
}

export interface SightReadingExercisesProps {}
export interface SightReadingExercisesState {
  correctPitch: Pitch.Pitch;
  pressedPitch: Pitch.Pitch | null;
}

export class SightReadingExercises extends React.Component<SightReadingExercisesProps, SightReadingExercisesState> {
  constructor(props: SightReadingExercisesProps) {
    super(props);

    this.state = {
      correctPitch: Pitch.getRandomPitchOn88KeyPiano(),
      pressedPitch: null
    };
  }

  onKeyPressed(keyPitch: Pitch.Pitch) {
    const newStateDelta = {
      pressedPitch: keyPitch
    };

    if(keyPitch.midiNoteNumber === this.state.correctPitch.midiNoteNumber) {
      newStateDelta["correctPitch"] = Pitch.getRandomPitchOn88KeyPiano();
    }

    this.setState(newStateDelta);
  }
  onKeyReleased(keyPitch: Pitch.Pitch) {
    this.setState({ pressedPitch: null });
  }

  render(): JSX.Element {
    //<circle cx={10} cy={spaceCenterYInStaff(staffHeight, )} r={noteHeight / 2} fill="#000" />
    const grandStaffWidth = 160;
    const grandStaffHeight = 300;
    const grandStaffTopMargin = 20;
    const layout = new OneMeasureGrandStaffLayout(grandStaffWidth, grandStaffHeight, 2);

    return (
      <div>
        <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" width={grandStaffWidth} height={grandStaffTopMargin + grandStaffHeight}>
          {renderGrandStaffWithNote(layout, 0, grandStaffTopMargin, [this.state.correctPitch, this.state.pressedPitch])}
        </svg>  
        <Piano width={960} height={180} onKeyPressed={this.onKeyPressed.bind(this)} onKeyReleased={this.onKeyReleased.bind(this)} pressedKeys={this.state.pressedPitch ? [this.state.pressedPitch] : []} />
      </div>
    );
  }
}