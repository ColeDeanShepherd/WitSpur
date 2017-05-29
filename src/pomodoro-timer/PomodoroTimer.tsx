import * as React from "react";

import { assert, millisecondsInSecond, secondsInMinute, zeroPadIntegerString } from "../Utils";
import { TimeoutV2 } from "../TimeoutV2";

export const pomodoroDurationInSeconds = 25 * secondsInMinute;
export const pomodoroShortBreakDurationInSeconds = 5 * secondsInMinute;
export const pomodoroLongBreakDurationInSeconds = 20 * secondsInMinute;

export interface PomodoroTimerProps {}
export interface PomodoroTimerState {}
export class PomodoroTimer extends React.Component<PomodoroTimerProps, PomodoroTimerState> {
  timeInSeconds: number;
  timeout: TimeoutV2;
  audioTag: HTMLAudioElement;

  constructor(props: PomodoroTimerProps) {
    super(props);

    this.timeInSeconds = pomodoroDurationInSeconds;
    this.timeout = new TimeoutV2(this.onTimeUp.bind(this), this.timeInSeconds, false);
    this.state = {};
  }

  public get timeLeftString(): string {
    const secondsLeft = this.timeout.secondsLeft;
    const visualSecondsLeft = Math.ceil(secondsLeft);

    const minutesLeftIntegerPart = Math.floor(visualSecondsLeft / secondsInMinute);

    const secondsLeftIntegerPart = Math.floor(visualSecondsLeft - (minutesLeftIntegerPart * secondsInMinute));
    const secondsString = zeroPadIntegerString(2, secondsLeftIntegerPart.toString());

    return `${minutesLeftIntegerPart}m ${secondsString}s`;
  }

  public setToPomodoro() {
    this.timeInSeconds = pomodoroDurationInSeconds;
    this.reset();
  }
  public setToPomodoroShortBreak() {
    this.timeInSeconds = pomodoroShortBreakDurationInSeconds;
    this.reset();
  }
  public setToPomodoroLongBreak() {
    this.timeInSeconds = pomodoroLongBreakDurationInSeconds;
    this.reset();
  }

  public start() {
    const runAnimationFrame = () => {
      this.forceUpdate();

      if(this.timeout.isRunning) {
        requestAnimationFrame(runAnimationFrame);
      }
    };

    this.timeout.start();
    this.forceUpdate();
    requestAnimationFrame(runAnimationFrame);
  }
  public stop() {
    this.timeout.stop();
    this.forceUpdate();
  }
  public reset() {
    this.timeout.stop();
    this.stopAlarmSound();
    this.timeout = new TimeoutV2(this.onTimeUp.bind(this), this.timeInSeconds, false);
    this.forceUpdate();
  }
  public stopAlarmSound() {
    this.audioTag.pause();
    this.audioTag.currentTime = 0;
  }

  public onTimeUp() {
    this.audioTag.play();
  }

  public componentWillUnmount() {
    if(this.timeout.isRunning) {
      this.timeout.stop();
    }
  }
  public render(): JSX.Element {
    const buttonStyle = {margin: "0 0.5em 0.5em 0.5em"};

    return (
      <div style={{textAlign: "center"}}>
        <div>
          <button onClick={this.setToPomodoro.bind(this)} style={buttonStyle}>Pomodoro</button>
          <button onClick={this.setToPomodoroShortBreak.bind(this)} style={buttonStyle}>Short Break</button>
          <button onClick={this.setToPomodoroLongBreak.bind(this)} style={buttonStyle}>Long Break</button>
        </div>
        <div style={{fontSize: "4em", margin: "3.75rem 0 4rem 0"}}>{this.timeLeftString}</div>
        <div>
          {(!this.timeout.isRunning && !this.timeout.isFinished) ? <button onClick={this.start.bind(this)} style={buttonStyle}>Start</button> : null}
          {(this.timeout.isRunning && !this.timeout.isFinished) ? <button onClick={this.stop.bind(this)} style={buttonStyle}>Stop</button> : null}
          {(!this.timeout.isRunning && this.timeout.isFinished) ? <button onClick={this.stopAlarmSound.bind(this)} style={buttonStyle}>Ok</button> : null}
          <button onClick={this.reset.bind(this)} style={buttonStyle}>Reset</button>
        </div>
        <audio ref={(audioTag) => this.audioTag = audioTag}>
          Your browser does not support the <code>audio</code> element.
          <source src="sound/bell.mp3" type="audio/mp3" />
        </audio>
      </div>
    );
  }
}