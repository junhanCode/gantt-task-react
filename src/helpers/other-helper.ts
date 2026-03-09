import { BarTask } from "../types/bar-task";
import { Task } from "../types/public-types";

export function isKeyboardEvent(
  event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent
): event is React.KeyboardEvent {
  return (event as React.KeyboardEvent).key !== undefined;
}

export function isMouseEvent(
  event: React.MouseEvent | React.KeyboardEvent | React.FocusEvent
): event is React.MouseEvent {
  return (event as React.MouseEvent).clientX !== undefined;
}

export function isBarTask(task: Task | BarTask): task is BarTask {
  return (task as BarTask).x1 !== undefined;
}

export function removeHiddenTasks(tasks: Task[]) {
  const groupedTasks = tasks.filter(
    t => t.hideChildren && t.type === "project"
  );
  if (groupedTasks.length > 0) {
    for (let i = 0; groupedTasks.length > i; i++) {
      const groupedTask = groupedTasks[i];
      const children = getChildren(tasks, groupedTask);
      tasks = tasks.filter(t => children.indexOf(t) === -1);
    }
  }
  return tasks;
}

function getChildren(taskList: Task[], task: Task) {
  let tasks: Task[] = [];
  if (task.type !== "project") {
    tasks = taskList.filter(
      t => t.dependencies && t.dependencies.indexOf(task.id) !== -1
    );
  } else {
    tasks = taskList.filter(t => t.project && t.project === task.id);
  }
  var taskChildren: Task[] = [];
  tasks.forEach(t => {
    taskChildren.push(...getChildren(taskList, t));
  })
  tasks = tasks.concat(tasks, taskChildren);
  return tasks;
}

/**
 * 将树形结构数据（含 children 字段）展平为甘特图所需的扁平数组。
 * - 自动为每个节点设置 project（父节点 id）、displayOrder、hideChildren。
 * - 已折叠节点（id 存在于 collapsedTaskIds）的子节点不会加入结果数组。
 * - type 未指定时，有子节点的节点默认为 "project"，叶节点默认为 "task"。
 */
export function flattenTreeTasks(
  treeTasks: Task[],
  childrenKey: string,
  collapsedTaskIds: Set<string | number>,
  parentId?: string | number,
  counter: { value: number } = { value: 1 }
): Task[] {
  const result: Task[] = [];

  for (const task of treeTasks) {
    const rawChildren = (task as any)[childrenKey];
    const children = Array.isArray(rawChildren) ? (rawChildren as Task[]) : undefined;
    const hasChildren = !!children && children.length > 0;
    const isCollapsed = collapsedTaskIds.has(task.id);

    const flatTask: Task = {
      ...(task as any),
      project: parentId,
      type: task.type || (hasChildren ? "project" : "task"),
      hideChildren: hasChildren ? isCollapsed : undefined,
      displayOrder: counter.value++,
      children: undefined,
    };

    if (childrenKey !== "children") {
      delete (flatTask as any)[childrenKey];
    }

    result.push(flatTask);

    if (hasChildren && !isCollapsed) {
      result.push(
        ...flattenTreeTasks(children!, childrenKey, collapsedTaskIds, task.id, counter)
      );
    }
  }

  return result;
}

export const sortTasks = (taskA: Task, taskB: Task) => {
  const orderA = taskA.displayOrder || Number.MAX_VALUE;
  const orderB = taskB.displayOrder || Number.MAX_VALUE;
  if (orderA > orderB) {
    return 1;
  } else if (orderA < orderB) {
    return -1;
  } else {
    return 0;
  }
};
