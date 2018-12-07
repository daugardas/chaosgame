import { Chance } from 'chance';
import './ConfigChangeHandlers';
const chance = new Chance();

export interface ICheckPrevious {
  value: number;
  id: number;
}

interface IGameConfig {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  width: number;
  height: number;
  radius: number;
  pointCount: number;
  size: number;
  percentage: number;
  rotation: number;
  checkPrevious: ICheckPrevious[];
  speed: number;
  opacity: number;
}

interface IPoint {
  x: number;
  y: number;
  color?: string;
}

export class Game {
  public config: IGameConfig = {
    canvas: undefined,
    ctx: undefined,
    width: undefined,
    height: undefined,
    radius: undefined,
    pointCount: 3,
    size: 1,
    percentage: 0.5,
    speed: 1,
    rotation: Math.PI / 2,
    opacity: 1,
    checkPrevious: []
  };

  constructor() {
    const height = document.documentElement.clientHeight - 2;
    this.config.canvas = document.getElementById("chaos-canvas") as HTMLCanvasElement;
    this.config.ctx = this.config.canvas.getContext('2d');
    this.config.canvas.width = height;
    this.config.canvas.height = height;
    this.config.width = height;
    this.config.height = height;
    this.config.radius = height / 2;
  }

  private points: IPoint[];

  private getCoordX(angle: number): number {
    return Math.cos(angle) * this.config.radius;
  }

  private getCoordY(angle: number): number {
    return Math.sin(angle) * this.config.radius;
  }

  private getRandomColor(): string {
    return `${chance.integer({ min: 0, max: 255 })}, ${chance.integer({ min: 0, max: 255 })}, ${chance.integer({ min: 0, max: 255 })}`;
  }

  private createPoints(): void {
    const { pointCount, rotation, size, radius } = this.config;
    for (let i = 0; i < pointCount; i++) {
      let angle = i * Math.PI * 2 / pointCount + rotation;
      this.points[i] = {
        x: this.getCoordX(angle) / size + radius / size,
        y: this.getCoordY(angle) / size + radius / size,
        color: this.getRandomColor()
      }
    }

    this.current = {
      x: this.points[chance.integer({ min: 0, max: this.points.length - 1 })].x,
      y: this.points[chance.integer({ min: 0, max: this.points.length - 1 })].y
    }
  }

  private current: IPoint;
  private previousPoints: IPoint[];
  private animation: any;

  public draw(): void {

    const { ctx, percentage, speed, opacity, checkPrevious } = this.config;
    //console.log(this.config.checkPrevious);
    for (let i = 0; i < speed; i++) {
      const num: number = chance.integer({ min: 0, max: this.points.length - 1 }); // random vertex
      let vertex: IPoint = this.points[num];

      if (checkPrevious.length < 1 || this.previousPoints.length <= 5) {
        console.log('added')
        this.current.x += (vertex.x - this.current.x) * percentage;
        this.current.y += (vertex.y - this.current.y) * percentage;
        ctx.fillStyle = `rgba(${vertex.color}, ${opacity})`;
        ctx.fillRect(this.current.x, this.current.y, 1, 1);

        if (this.previousPoints.length <= 5) { // keep the history up to 5 vertexies
          this.previousPoints.unshift(vertex);
        } else {
          this.previousPoints.pop();
          this.previousPoints.unshift(vertex);
        }
      }

      let matched: boolean = false;
      for (let j = 0; j < checkPrevious.length; j++) {
        //console.log(checkPrevious[j].value);
        /* if (checkPrevious[j].value === 0) {
          this.current.x += (vertex.x - this.current.x) * percentage;
          this.current.y += (vertex.y - this.current.y) * percentage;
          ctx.fillStyle = `rgba(${vertex.color}, ${opacity})`;
          ctx.fillRect(this.current.x, this.current.y, 1, 1);

          if (this.previousPoints.length <= 5) { // keep the history up to 10 vertexies
            this.previousPoints.unshift(vertex);
          } else {
            this.previousPoints.pop();
            this.previousPoints.unshift(vertex);
          }
          console.log(this.previousPoints);
          break;
        } */
        //console.log(this.previousPoints[checkPrevious[j].value]);
        if (this.previousPoints[checkPrevious[j].value] === vertex && checkPrevious[j].value) {
          matched = true;
          //console.log('matched');
        } else {
          //console.log("not matcher");
        }
      }

      if (!matched) {
        this.current.x += (vertex.x - this.current.x) * percentage;
        this.current.y += (vertex.y - this.current.y) * percentage;
        ctx.fillStyle = `rgba(${vertex.color}, ${opacity})`;
        ctx.fillRect(this.current.x, this.current.y, 1, 1);

        if (this.previousPoints.length <= 5) { // keep the history up to 10 vertexies
          this.previousPoints.unshift(vertex);
        } else {
          this.previousPoints.pop();
          this.previousPoints.unshift(vertex);
        }
      }
    }

    this.animation = requestAnimationFrame(() => this.draw());
  }

  public start(): void { // resets and start the game
    this.points = [];
    this.previousPoints = [];
    cancelAnimationFrame(this.animation);
    this.config.ctx.clearRect(0, 0, this.config.width, this.config.height);

    console.log(this.config.checkPrevious);
    this.createPoints();
    this.draw();
  }
}