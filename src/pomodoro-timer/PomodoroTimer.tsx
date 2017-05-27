import * as React from "react";

import { assert, millisecondsInSecond, secondsInMinute, zeroPadIntegerString } from "../Utils";

export interface PomodoroTimerProps {}
export interface PomodoroTimerState {
  secondsLeft: number,
  isRunning: boolean
}
export class PomodoroTimer extends React.Component<PomodoroTimerProps, PomodoroTimerState> {
  intervalHandle: number;
  audioTag: HTMLAudioElement;

  constructor(props: PomodoroTimerProps) {
    super(props);

    this.state = {
      secondsLeft: 6,
      isRunning: false
    };
  }
  startTimer() {

  }
  stopTimer() {

  }
  resetTimer() {

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