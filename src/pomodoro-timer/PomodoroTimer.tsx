import * as React from "react";

import { assert } from "../Utils";

const secondsInMinute = 60;
const millisecondsInSecond = 1000;

export function repeatString(repeatCount: number, str: string): string {
  assert(repeatCount >= 0);

  let result = "";

  for(let i = 0; i < repeatCount; i++) {
    result += str;
  }

  return result;
}

export function zeroPadIntegerString(minDigitCount: number, integerString: string): string {
  assert(minDigitCount >= 0);

  const digitCount = integerString.length;
  const paddingZeroCount = Math.max(minDigitCount - digitCount, 0);
  const paddingStr = repeatString(paddingZeroCount, "0");

  return paddingStr + integerString;
}

export interface PomodoroTimerProps {}
export interface PomodoroTimerState {
  secondsLeft: number
}
export class PomodoroTimer extends React.Component<PomodoroTimerProps, PomodoroTimerState> {
  intervalHandle: number;
  audioTag: HTMLAudioElement;

  constructor(props: PomodoroTimerProps) {
    super(props);

    this.state = {
      secondsLeft: 6
    };
  }
  playAlarmSound() {
    this.audioTag.play();
  }

  componentDidMount() {
    this.intervalHandle = setInterval(() => {
      const newSecondsLeft = Math.max(this.state.secondsLeft - 1, 0);
      this.setState({ secondsLeft: newSecondsLeft });

      if(newSecondsLeft <= 0) {
        clearInterval(this.intervalHandle);
        this.playAlarmSound();
      }
    }, millisecondsInSecond);
  }

  componentWillUnmount() {
    clearInterval(this.intervalHandle);
  }

  render(): JSX.Element {
    const minutesLeftIntegerPart = Math.floor(this.state.secondsLeft / secondsInMinute);
    const secondsLeftIntegerPart = Math.floor(this.state.secondsLeft - (minutesLeftIntegerPart * secondsInMinute));
    const secondsString = zeroPadIntegerString(2, secondsLeftIntegerPart.toString());

    return (
      <div>
        <div>{minutesLeftIntegerPart}:{secondsString}</div>
        <div>
          <button>Start</button>
          <button>Stop</button>
          <button>Reset</button>
        </div>
        <audio ref={(audioTag) => this.audioTag = audioTag}>
          Your browser does not support the <code>audio</code> element.
          <source src="sound/bell.mp3" type="audio/mp3" />
        </audio>
      </div>
    );
  }
}