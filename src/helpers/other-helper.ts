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
 * 将 Ant Design Table 风格的树形任务数据（children 嵌套）展平为甘特图所需的平铺数组。
 * - 自动根据父子关系设置子任务的 `project` 字段
 * - 若父节点有 children 且 type 未指定为 "task"/"milestone"，自动升级为 "project"
 * - 若 tasks 中没有任何 children 字段，直接原样返回（向后兼容平铺格式）
 * - 剥离 children 字段，避免影响后续处理
 */
export function flattenTaskTree(tasks: Task[]): Task[] {
  const hasTree = tasks.some(t => Array.isArray((t as any).children) && (t as any).children.length > 0);
  if (!hasTree) {
    // 已是平铺格式，不做任何处理
    return tasks;
  }

  const result: Task[] = [];
  let orderCounter = 1;

  function traverse(node: Task, parentId?: string) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, ...rest } = node as Task & { children?: Task[] };
    const hasChildren = Array.isArray(children) && children.length > 0;

    const flat: Task = {
      ...rest,
      // 若有子节点且还不是明确的 task/milestone，升级为 project
      type: hasChildren && rest.type !== "milestone" ? "project" : rest.type,
      // 子任务指向父
      ...(parentId ? { project: parentId } : {}),
      // 有子节点时默认折叠（除非已明确设置）
      ...(hasChildren && rest.hideChildren === undefined ? { hideChildren: true } : {}),
      displayOrder: rest.displayOrder ?? orderCounter,
    };
    orderCounter++;
    result.push(flat);

    if (hasChildren) {
      children!.forEach(child => traverse(child, flat.id));
    }
  }

  tasks.forEach(task => traverse(task));
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
