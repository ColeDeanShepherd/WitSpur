import { millisecondsInSecond } from "./Utils";

export class Stopwatch {
  public get elapsedTimeInSeconds(): number {
    const elapsedTimeInMilliseconds = this._isRunning ? (this.accumulatedTimeInMilliseconds + (performance.now() - this.startTimeInMilliseconds)) : this.accumulatedTimeInMilliseconds;

    return elapsedTimeInMilliseconds / millisecondsInSecond;
  }
  public get isRunning(): boolean {
    return this._isRunning;
  }

  public constructor() {
    this._isRunning = false;
    this.accumulatedTimeInMilliseconds = 0;
  }
  public start() {
    if(!this._isRunning) {
      this.startTimeInMilliseconds = performance.now();
      this._isRunning = true;
    }
  }
  public stop() {
    if(this._isRunning) {
      this.accumulatedTimeInMilliseconds += performance.now() - this.startTimeInMilliseconds;
      this._isRunning = false;
    }
  }
  public reset() {
    this.accumulatedTimeInMilliseconds = 0;

    if(this._isRunning) {
      this.startTimeInMilliseconds = performance.now();
    }
  }

  private _isRunning: boolean;
  private accumulatedTimeInMilliseconds: number;
  private startTimeInMilliseconds: number;
}