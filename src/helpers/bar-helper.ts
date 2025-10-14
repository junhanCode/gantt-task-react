import { Task } from "../types/public-types";
import { BarTask, TaskTypeInternal } from "../types/bar-task";
import { BarMoveAction } from "../types/gantt-task-actions";

const convertToBarTask = (
  task: Task,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  barActualColor: string,
  barActualSelectedColor: string,
  barDelayColor: string,
  projectProgressColor: string,
  projectProgressSelectedColor: string,
  projectBackgroundColor: string,
  projectBackgroundSelectedColor: string,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string
): BarTask => {
  let barTask: BarTask;
  switch (task.type) {
    case "milestone":
      barTask = convertToMilestone(
        task,
        index,
        dates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        milestoneBackgroundColor,
        milestoneBackgroundSelectedColor
      );
      break;
    case "project":
      barTask = convertToBar(
        task,
        index,
        dates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        rtl,
        projectProgressColor,
        projectProgressSelectedColor,
        projectBackgroundColor,
        projectBackgroundSelectedColor,
        barActualColor,
        barActualSelectedColor,
        barDelayColor
      );
      break;
    default:
      barTask = convertToBar(
        task,
        index,
        dates,
        columnWidth,
        rowHeight,
        taskHeight,
        barCornerRadius,
        handleWidth,
        rtl,
        barProgressColor,
        barProgressSelectedColor,
        barBackgroundColor,
        barBackgroundSelectedColor,
        barActualColor,
        barActualSelectedColor,
        barDelayColor
      );
      break;
  }
  return barTask;
};

export const convertToBarTasks = (
  tasks: Task[],
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  barProgressColor: string,
  barProgressSelectedColor: string,
  barBackgroundColor: string,
  barBackgroundSelectedColor: string,
  barActualColor: string,
  barActualSelectedColor: string,
  barDelayColor: string,
  projectProgressColor: string,
  projectProgressSelectedColor: string,
  projectBackgroundColor: string,
  projectBackgroundSelectedColor: string,
  milestoneBackgroundColor: string,
  milestoneBackgroundSelectedColor: string
) => {
  let barTasks = tasks.map((t, i) => {
    return convertToBarTask(
      t,
      i,
      dates,
      columnWidth,
      rowHeight,
      taskHeight,
      barCornerRadius,
      handleWidth,
      rtl,
      barProgressColor,
      barProgressSelectedColor,
      barBackgroundColor,
      barBackgroundSelectedColor,
      barActualColor,
      barActualSelectedColor,
      barDelayColor,
      projectProgressColor,
      projectProgressSelectedColor,
      projectBackgroundColor,
      projectBackgroundSelectedColor,
      milestoneBackgroundColor,
      milestoneBackgroundSelectedColor
    );
  });

  barTasks = barTasks.map(task => {
    const dependencies = task.dependencies || [];
    const barChildren = barTasks.filter(t => dependencies.includes(t.id));
    return { ...task, barChildren };
  });

  return barTasks;
};

const convertToBar = (
  task: Task,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  rtl: boolean,
  progressColor: string,
  progressSelectedColor: string,
  backgroundColor: string,
  backgroundSelectedColor: string,
  actualColor: string,
  actualSelectedColor: string,
  delayColor: string
): BarTask => {
  // 使用计划时间作为主要显示时间，如果没有则使用基础时间
  const plannedStart = task.plannedStart || task.start;
  const plannedEnd = task.plannedEnd || task.end;
  
  // 使用实际时间，如果没有则使用基础时间
  const actualStart = task.actualStart || task.start;
  const actualEnd = task.actualEnd || task.end;

  let x1: number;
  let x2: number;
  let actualX1: number;
  let actualX2: number;
  let progressX: number;
  let progressWidth: number;

  if (rtl) {
    x2 = taskXCoordinateRTL(plannedStart, dates, columnWidth);
    x1 = taskXCoordinateRTL(plannedEnd, dates, columnWidth);
    actualX2 = taskXCoordinateRTL(actualStart, dates, columnWidth);
    actualX1 = taskXCoordinateRTL(actualEnd, dates, columnWidth);
  } else {
    x1 = taskXCoordinate(plannedStart, dates, columnWidth);
    x2 = taskXCoordinate(plannedEnd, dates, columnWidth);
    actualX1 = taskXCoordinate(actualStart, dates, columnWidth);
    actualX2 = taskXCoordinate(actualEnd, dates, columnWidth);
  }

  const [progressWidthLocal, progressXLocal] = getProgressPointInternal(
    x1,
    x2,
    task.progress,
    rtl
  );
  progressWidth = progressWidthLocal;
  progressX = progressXLocal;

  const y = taskYCoordinate(index, rowHeight, taskHeight);

  const styles = {
    backgroundColor,
    backgroundSelectedColor,
    progressColor,
    progressSelectedColor,
    actualColor,
    actualSelectedColor,
    delayColor,
  };

  return {
    ...task,
    index,
    x1,
    x2,
    actualX1,
    actualX2,
    y,
    height: taskHeight,
    progressX,
    progressWidth,
    barCornerRadius,
    handleWidth,
    typeInternal: task.type as TaskTypeInternal,
    barChildren: [],
    styles,
  };
};

const convertToMilestone = (
  task: Task,
  index: number,
  dates: Date[],
  columnWidth: number,
  rowHeight: number,
  taskHeight: number,
  barCornerRadius: number,
  handleWidth: number,
  backgroundColor: string,
  backgroundSelectedColor: string
): BarTask => {
  const x = taskXCoordinate(task.start, dates, columnWidth);
  const y = taskYCoordinate(index, rowHeight, taskHeight);

  const x1 = x - taskHeight * 0.5;
  const x2 = x + taskHeight * 0.5;

  const styles = {
    backgroundColor,
    backgroundSelectedColor,
    progressColor: backgroundColor,
    progressSelectedColor: backgroundSelectedColor,
    actualColor: backgroundColor,
    actualSelectedColor: backgroundSelectedColor,
    delayColor: "#FF9800",
  };

  return {
    ...task,
    index,
    x1,
    x2,
    actualX1: x1,
    actualX2: x2,
    y,
    height: taskHeight,
    progressX: x1,
    progressWidth: x2 - x1,
    barCornerRadius,
    handleWidth,
    typeInternal: task.type as TaskTypeInternal,
    barChildren: [],
    styles,
  };
};

const taskXCoordinate = (xDate: Date, dates: Date[], columnWidth: number) => {
  const index = dates.findIndex(d => d.getTime() >= xDate.getTime()) - 1;
  if (index < 0) {
    return 0;
  }
  const remainderMillis = xDate.getTime() - dates[index].getTime();
  const remainder = remainderMillis / (dates[index + 1].getTime() - dates[index].getTime());
  return (index + remainder) * columnWidth;
};

const taskXCoordinateRTL = (xDate: Date, dates: Date[], columnWidth: number) => {
  let x = taskXCoordinate(xDate, dates, columnWidth);
  const chartWidth = (dates.length - 1) * columnWidth;
  x = chartWidth - x;
  return x;
};

const taskYCoordinate = (index: number, rowHeight: number, taskHeight: number) => {
  const y = index * rowHeight;
  return y + (rowHeight - taskHeight) / 2;
};

const getProgressPointInternal = (
  x1: number,
  x2: number,
  progress: number,
  rtl: boolean
): [number, number] => {
  const progressWidth = (x2 - x1) * (progress / 100);
  let progressX: number;
  if (rtl) {
    progressX = x2 - progressWidth;
  } else {
    progressX = x1;
  }
  return [progressWidth, progressX];
};

export const getProgressPoint = (
  progressX: number,
  taskY: number,
  taskHeight: number
) => {
  return {
    x: progressX,
    y: taskY + taskHeight / 2,
  };
};

// 将坐标值转换回 Date 对象
const coordinateToDate = (x: number, dates: Date[], columnWidth: number): Date => {
  const index = Math.floor(x / columnWidth);
  const remainder = (x % columnWidth) / columnWidth;
  
  if (index < 0) {
    return dates[0];
  }
  if (index >= dates.length - 1) {
    return dates[dates.length - 1];
  }
  
  const startDate = dates[index];
  const endDate = dates[index + 1];
  const timeDiff = endDate.getTime() - startDate.getTime();
  
  return new Date(startDate.getTime() + timeDiff * remainder);
};

export const handleTaskBySVGMouseEvent = (
  x: number,
  action: BarMoveAction,
  selectedTask: BarTask,
  _xStep: number,
  _timeStep: number,
  initEventX1Delta: number,
  rtl: boolean,
  dates: Date[],
  columnWidth: number
): { isChanged: boolean; changedTask: BarTask } => {
  let changedTask: BarTask = { ...selectedTask };
  let isChanged = false;

  switch (action) {
    case "start":
      if (rtl) {
        changedTask = {
          ...changedTask,
          x2: x,
          plannedEnd: coordinateToDate(x, dates, columnWidth),
        };
      } else {
        changedTask = {
          ...changedTask,
          x1: x,
          plannedStart: coordinateToDate(x, dates, columnWidth),
        };
      }
      isChanged = changedTask.x1 !== selectedTask.x1 || changedTask.x2 !== selectedTask.x2;
      break;
    case "end":
      if (rtl) {
        changedTask = {
          ...changedTask,
          x1: x,
          plannedStart: coordinateToDate(x, dates, columnWidth),
        };
      } else {
        changedTask = {
          ...changedTask,
          x2: x,
          plannedEnd: coordinateToDate(x, dates, columnWidth),
        };
      }
      isChanged = changedTask.x1 !== selectedTask.x1 || changedTask.x2 !== selectedTask.x2;
      break;
    case "actualStart":
      if (rtl) {
        changedTask = {
          ...changedTask,
          actualX2: x,
          actualEnd: coordinateToDate(x, dates, columnWidth),
        };
      } else {
        changedTask = {
          ...changedTask,
          actualX1: x,
          actualStart: coordinateToDate(x, dates, columnWidth),
        };
      }
      isChanged = changedTask.actualX1 !== selectedTask.actualX1 || changedTask.actualX2 !== selectedTask.actualX2;
      break;
    case "actualEnd":
      if (rtl) {
        changedTask = {
          ...changedTask,
          actualX1: x,
          actualStart: coordinateToDate(x, dates, columnWidth),
        };
      } else {
        changedTask = {
          ...changedTask,
          actualX2: x,
          actualEnd: coordinateToDate(x, dates, columnWidth),
        };
      }
      isChanged = changedTask.actualX1 !== selectedTask.actualX1 || changedTask.actualX2 !== selectedTask.actualX2;
      break;
    case "move":
      const newX1 = x - initEventX1Delta;
      const newX2 = x - initEventX1Delta + (selectedTask.x2 - selectedTask.x1);
      const newActualX1 = x - initEventX1Delta;
      const newActualX2 = x - initEventX1Delta + (selectedTask.actualX2 - selectedTask.actualX1);
      
      changedTask = {
        ...changedTask,
        x1: newX1,
        x2: newX2,
        actualX1: newActualX1,
        actualX2: newActualX2,
        plannedStart: coordinateToDate(newX1, dates, columnWidth),
        plannedEnd: coordinateToDate(newX2, dates, columnWidth),
        actualStart: coordinateToDate(newActualX1, dates, columnWidth),
        actualEnd: coordinateToDate(newActualX2, dates, columnWidth),
      };
      isChanged = changedTask.x1 !== selectedTask.x1 || changedTask.x2 !== selectedTask.x2;
      break;
    case "progress":
      const progressWidth = x - selectedTask.x1;
      const progress = (progressWidth / (selectedTask.x2 - selectedTask.x1)) * 100;
      changedTask = {
        ...changedTask,
        progress: Math.max(0, Math.min(100, progress)),
        progressWidth,
        progressX: selectedTask.x1,
      };
      isChanged = changedTask.progress !== selectedTask.progress;
      break;
  }

  return { isChanged, changedTask };
};