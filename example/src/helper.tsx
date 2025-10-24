import { Task } from "../../dist/types/public-types";

export function initTasks() {
  const currentDate = new Date();
  const tasks: Task[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Some Project",
      id: "ProjectSample",
      progress: 25,
      type: "project",
      hideChildren: false,
      displayOrder: 1,
      // 不设置 plannedStart, plannedEnd, actualStart, actualEnd
      // 这样项目会根据子项自动计算时间范围
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        2,
        12,
        28
      ),
      // 计划时间
      plannedStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      plannedEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2, 12, 28),
      // 实际时间 - 准时完成
      actualStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      actualEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2, 12, 28),
      name: "Idea",
      id: "Task 0",
      progress: 45,
      type: "task",
      project: "ProjectSample",
      displayOrder: 2,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      // 计划时间
      plannedStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 2),
      plannedEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4, 0, 0),
      // 实际时间 - 提前完成
      actualStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1, 18, 0),
      actualEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 3, 16, 0),
      name: "Research",
      id: "Task 1",
      progress: 25,
      dependencies: ["Task 0"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 3,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      // 计划时间
      plannedStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 4),
      plannedEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      // 实际时间 - 延误开始
      actualStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 5, 10, 0),
      actualEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 0, 0),
      name: "Discussion with team",
      id: "Task 2",
      progress: 10,
      dependencies: ["Task 1"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 4,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
      // 计划时间
      plannedStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      plannedEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 0, 0),
      // 实际时间 - 延误结束
      actualStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      actualEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10, 6, 0),
      name: "Developing",
      id: "Task 3",
      progress: 2,
      dependencies: ["Task 2"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 5,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      // 计划时间
      plannedStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8),
      plannedEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 10),
      // 实际时间 - 进行中
      actualStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 8, 14, 0),
      actualEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 9, 18, 0), // 还未完成
      name: "Review",
      id: "Task 4",
      type: "task",
      progress: 70,
      dependencies: ["Task 2"],
      project: "ProjectSample",
      displayOrder: 6,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      // 计划时间
      plannedStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      plannedEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      // 实际时间 - 里程碑准时
      actualStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      actualEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "Release",
      id: "Task 6",
      progress: currentDate.getMonth(),
      type: "milestone",
      dependencies: ["Task 4"],
      project: "ProjectSample",
      displayOrder: 7,
    },
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      // 计划时间
      plannedStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      plannedEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      // 实际时间 - 未开始
      actualStart: new Date(currentDate.getFullYear(), currentDate.getMonth(), 18),
      actualEnd: new Date(currentDate.getFullYear(), currentDate.getMonth(), 19),
      name: "Party Time",
      id: "Task 9",
      progress: 0,
      isDisabled: true,
      type: "task",
    },
  ];
  return tasks;
}

export function getStartEndDateForProject(tasks: Task[], projectId: string) {
  const projectTasks = tasks.filter(t => t.project === projectId);
  let start = projectTasks[0].start;
  let end = projectTasks[0].end;

  for (let i = 0; i < projectTasks.length; i++) {
    const task = projectTasks[i];
    if (start.getTime() > task.start.getTime()) {
      start = task.start;
    }
    if (end.getTime() < task.end.getTime()) {
      end = task.end;
    }
  }
  return [start, end];
}
