import { Task, TaskType } from "./public-types";

export interface BarTask extends Task {
  index: number;
  typeInternal: TaskTypeInternal;
  x1: number;
  x2: number;
  actualX1: number;
  actualX2: number;
  y: number;
  height: number;
  progressX: number;
  progressWidth: number;
  barCornerRadius: number;
  handleWidth: number;
  barChildren: BarTask[];
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
    actualColor: string;
    actualSelectedColor: string;
    delayColor: string;
  };
}

export type TaskTypeInternal = TaskType | "smalltask";
