import { Stopwatch } from "./Stopwatch";

export class TimeoutV2 {
  public get callback() {
    return this._callback;
  }
  public get delayInSeconds() {
    return this._delayInSeconds;
  }
  public get secondsLeft() {
    return Math.max(this._delayInSeconds - this.stopwatch.elapsedTimeInSeconds, 0);
  }
  public get isRunning() {
    return this.nativeTimeoutHandle !== null;
  }
  public get isFinished() {
    return this._isFinished;
  }

  public constructor(callback: () => void, delayInSeconds: number, autoStart: boolean = true) {
    this._callback = callback;
    this._delayInSeconds = delayInSeconds;
    this.stopwatch = new Stopwatch();
    this.nativeTimeoutHandle = null;
    this._isFinished = false;

    if(autoStart) {
      this.start();
    }
  }
  public start() {
    if(!this.isRunning) {
      this.stopwatch.start();

      this.nativeTimeoutHandle = setTimeout(() => {
        this.nativeTimeoutHandle = null;
        this._callback();
        this._isFinished = true;
      }, 1000 * this.secondsLeft);
    }
  }
  public stop() {
    if(this.isRunning && (this.nativeTimeoutHandle !== null)) {
      clearTimeout(this.nativeTimeoutHandle);
      this.nativeTimeoutHandle = null;

      this.stopwatch.stop();
    }
  }

  private _callback: () => void;
  private _delayInSeconds: number;
  private stopwatch: Stopwatch;
  private nativeTimeoutHandle: number | null;
  private _isFinished: boolean;
}