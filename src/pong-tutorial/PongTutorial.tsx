import * as React from "react";

import * as Utils from "../Utils";
import * as Units from "../Units";
import * as Numerical from "../Numerical";

const PADDLE_DISTANCE_FROM_EDGE = 20;

class Vector2 {
  constructor(public x: number, public y: number) {}

  length(): number {
    return Math.sqrt((this.x * this.x) + (this.y * this.y));
  }
  normalized(): Vector2 {
    const length = this.length();
    return new Vector2(this.x / length, this.y / length);
  }
}
function add(a: Vector2, b: Vector2): Vector2 {
  return new Vector2(a.x + b.x, a.y + b.y);
}
function mul(v: Vector2, scalar: number): Vector2 {
  return new Vector2(scalar * v.x, scalar * v.y);
}

class Rect {
  constructor(
    public width: number,
    public height: number,
    public topLeftPosition: Vector2) {}
}
function areRectanglesOverlapping(a: Rect, b: Rect) {
  const aLeft = a.topLeftPosition.x;
  const bRight = b.topLeftPosition.x + b.width;
  if(bRight <= aLeft) return false; // b is to the left of a
  
  const aRight = a.topLeftPosition.x + a.width;
  const bLeft = b.topLeftPosition.x;
  if(bLeft >= aRight) return false; // b is to the right of a

  const aTop = a.topLeftPosition.y;
  const bBottom = b.topLeftPosition.y + b.height;
  if(bBottom <= aTop) return false; // b is above a

  const aBottom = a.topLeftPosition.y + a.height;
  const bTop = b.topLeftPosition.y;
  if(bTop >= aBottom) return false; // b is below a

  return true;
}

class Paddle {
  static WIDTH = 20;
  static HEIGHT = 80;
  static FILL_STYLE = "white";
  static SPEED = 200;

  constructor(
    public position: Vector2,
    public yDirection: number
  ) {}
  get rect(): Rect {
    return new Rect(Paddle.WIDTH, Paddle.HEIGHT, this.position);
  }
}

class Ball {
  static WIDTH = 20;
  static HEIGHT = 20;
  static FILL_STYLE = "white";
  static SPEED = 200;

  constructor(
    public position: Vector2,
    public direction: Vector2
  ) {}
  
  get rect(): Rect {
    return new Rect(Ball.WIDTH, Ball.HEIGHT, this.position);
  }
}

const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;

const INITIAL_PADDLE_Y = (CANVAS_HEIGHT / 2) - (Paddle.HEIGHT / 2);
let leftPaddle = new Paddle(new Vector2(PADDLE_DISTANCE_FROM_EDGE, INITIAL_PADDLE_Y), 0);
let rightPaddle = new Paddle(new Vector2(CANVAS_WIDTH - PADDLE_DISTANCE_FROM_EDGE - Paddle.WIDTH, INITIAL_PADDLE_Y), 0);
let ball = new Ball(new Vector2((CANVAS_WIDTH / 2) - (Ball.WIDTH / 2), (CANVAS_HEIGHT / 2) - (Ball.HEIGHT / 2)), new Vector2(1, 0));

export interface PongTutorialProps {}
export interface PongTutorialState {}

export class PongTutorial extends React.Component<PongTutorialProps, PongTutorialState> {
  canvasDomElement: HTMLCanvasElement;
  canvasContext: CanvasRenderingContext2D;
  canvasWidth: number = CANVAS_WIDTH;
  canvasHeight: number = CANVAS_HEIGHT;
  
  pixelsInUnit: number = 65;

  isWDown: boolean;
  isSDown: boolean;
  isODown: boolean;
  isLDown: boolean;

  constructor(props: PongTutorialProps) {
    super(props);

    this.state = {};
  }

  startSimulation() {
    // add event handlers
    document.addEventListener("keyup", (event: KeyboardEvent) => {
      const keyDownValue = false;

      switch(event.key) {
        case "w":
          this.isWDown = keyDownValue;
          break;
        case "s":
          this.isSDown = keyDownValue;
          break;
        case "o":
          this.isODown = keyDownValue;
          break;
        case "l":
          this.isLDown = keyDownValue;
          break;
      }
    });
    document.addEventListener("keydown", (event: KeyboardEvent) => {
      const keyDownValue = true;

      switch(event.key) {
        case "w":
          this.isWDown = keyDownValue;
          break;
        case "s":
          this.isSDown = keyDownValue;
          break;
        case "o":
          this.isODown = keyDownValue;
          break;
        case "l":
          this.isLDown = keyDownValue;
          break;
      }
    });

    // start event loop
    const fixedDt = 1 / 60;
    let accumulatedTime = 0;

    let lastTimeStamp: number;
    const runFrame = (timeStamp) => {
      const dt = (timeStamp - lastTimeStamp) / Units.millisecondsInSecond;

      accumulatedTime += dt;

      while(accumulatedTime >= fixedDt) {
        this.update(fixedDt);

        accumulatedTime -= fixedDt;
      }
      
      this.renderFrame();
      
      requestAnimationFrame(runFrame);

      lastTimeStamp = timeStamp;
    };

    lastTimeStamp = performance.now();
    requestAnimationFrame(runFrame);
  }
  update(dt: number) {
    if(this.isWDown) {
      leftPaddle.yDirection = -1;
    } else if(this.isSDown) {
      leftPaddle.yDirection = 1;
    } else {
      leftPaddle.yDirection = 0;
    }

    this.updatePaddle(leftPaddle, dt);

    if(this.isODown) {
      rightPaddle.yDirection = -1;
    } else if(this.isLDown) {
      rightPaddle.yDirection = 1;
    } else {
      rightPaddle.yDirection = 0;
    }

    this.updatePaddle(rightPaddle, dt);

    this.updateBall(ball, dt);
  }
  updatePaddle(paddle: Paddle, dt: number) {
    paddle.position.y += dt * Paddle.SPEED * paddle.yDirection;
  }
  updateBall(ball: Ball, dt: number) {
    ball.position = add(ball.position, mul(ball.direction, dt * Ball.SPEED));

    if(areRectanglesOverlapping(ball.rect, leftPaddle.rect)) {
      ball.direction.x = Math.abs(ball.direction.x);
    }

    if(areRectanglesOverlapping(ball.rect, rightPaddle.rect)) {
      ball.direction.x = -Math.abs(ball.direction.x);
    }
  }

  drawPaddle(paddle: Paddle) {
    this.fillRect(paddle.position.x, paddle.position.y, Paddle.WIDTH, Paddle.HEIGHT, Paddle.FILL_STYLE);
  }
  drawBall(ball: Ball) {
    this.fillRect(ball.position.x, ball.position.y, Ball.WIDTH, Ball.HEIGHT, Ball.FILL_STYLE);
  }
  strokeLine(x1: number, y1: number, x2: number, y2: number) {
    this.canvasContext.beginPath();
    this.canvasContext.moveTo(x1, y1);
    this.canvasContext.lineTo(x2, y2);
    this.canvasContext.closePath();
    this.canvasContext.stroke();
  }
  fillRect(x: number, y: number, width: number, height: number, fillStyle: string) {
    this.canvasContext.fillStyle = fillStyle;
    this.canvasContext.fillRect(x, y, width, height);
  }
  fillCircle(radius: number, x: number, y: number, fillStyle: string) {
    this.canvasContext.fillStyle = fillStyle;

    this.canvasContext.beginPath();
    this.canvasContext.arc(x, y, radius, 0, 2 * Math.PI, true);
    this.canvasContext.closePath();

    this.canvasContext.fill();
  }
  renderFrame() {
    this.canvasContext.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    this.fillRect(0, 0, this.canvasWidth, this.canvasHeight, "black");

    this.drawPaddle(leftPaddle);
    this.drawPaddle(rightPaddle);
    this.drawBall(ball);





    const fontSizeInPixels = 18;
    const textX = 10;
    let textY = fontSizeInPixels;
    let textYSpacing = 1.3 * fontSizeInPixels;

    this.canvasContext.font = `${fontSizeInPixels}px sans-serif`;
  }

  componentDidMount() {
    const context = this.canvasDomElement.getContext("2d");
    if(!context) { return; }

    this.canvasContext = context;
    this.startSimulation();
  }

  render(): JSX.Element {
    return (
      <div className="card">
        <canvas ref={canvas => canvas ? (this.canvasDomElement = canvas) : null} width={this.canvasWidth} height={this.canvasHeight}>
          Your browser does not support the canvas tag. Please upgrade your browser.
        </canvas>
      </div>
    );
  }
}