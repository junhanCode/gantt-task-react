import { Task } from "../../dist/types/public-types";

export function initTasks() {
  const currentDate = new Date();
  const tasks: Task[] = [
    {
      start: new Date(currentDate.getFullYear(), currentDate.getMonth(), 1),
      end: new Date(currentDate.getFullYear(), currentDate.getMonth(), 15),
      name: "项目A",
      id: "ProjectSample",
      progress: 25,
      type: "project",
      hideChildren: false,
      displayOrder: 1,
      status: "处理中",
      assignee: "张三11111111111111111111111111111",
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
      name: "需求分析",
      id: "Task 0",
      progress: 100,
      type: "task",
      project: "ProjectSample",
      displayOrder: 2,
      status: "待验收",
      assignee: "李四",
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
      name: "技术调研",
      id: "Task 1",
      progress: 100,
      dependencies: ["Task 0"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 3,
      status: "待验收",
      assignee: "王五",
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
      name: "团队讨论",
      id: "Task 2",
      progress: 60,
      dependencies: ["Task 1"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 4,
      status: "处理中",
      assignee: "赵六",
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
      name: "开发实现",
      id: "Task 3",
      progress: 30,
      dependencies: ["Task 2"],
      type: "task",
      project: "ProjectSample",
      displayOrder: 5,
      status: "处理中",
      assignee: "孙七",
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
      name: "代码审查",
      id: "Task 4",
      type: "task",
      progress: 70,
      dependencies: ["Task 2"],
      project: "ProjectSample",
      displayOrder: 6,
      status: "处理中",
      assignee: "周八",
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
      name: "版本发布",
      id: "Task 6",
      progress: currentDate.getMonth(),
      type: "milestone",
      dependencies: ["Task 4"],
      project: "ProjectSample",
      displayOrder: 7,
      status: "待验收",
      assignee: "吴九",
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
      name: "暂停任务",
      id: "Task 9",
      progress: 0,
      isDisabled: true,
      type: "task",
      status: "挂起中",
      assignee: "郑十",
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
