import { Task, GanttColumnConfig } from "../types/public-types";

/** 将 CSS 宽度字符串解析为像素数值，如 "155px" → 155 */
export const parseWidthPx = (w: string | undefined, fallback: number): number => {
  if (!w) return fallback;
  const n = parseFloat(w);
  return isNaN(n) ? fallback : n;
};

/**
 * 获取某列在 Task 上对应的原始值。
 * 内置列做了别名处理（如 plannedStart 实际取 task.plannedStart ?? task.start）；
 * 自定义列直接取 (task as any)[key]。
 */
export function getColumnValue(key: string, task: Task): any {
  switch (key) {
    case "plannedStart":
      return task.plannedStart ?? task.start;
    case "plannedEnd":
      return task.plannedEnd ?? task.end;
    case "actualStart":
      return task.actualStart ?? task.start;
    case "actualEnd":
      return task.actualEnd ?? task.end;
    case "plannedDuration": {
      const s = task.plannedStart ?? task.start;
      const e = task.plannedEnd ?? task.end;
      return Math.ceil(Math.abs(e.getTime() - s.getTime()) / (1000 * 60 * 60 * 24));
    }
    default:
      return (task as any)[key];
  }
}

/**
 * 初始化 colWidths 状态对象（每列宽度，单位 px）。
 * 当 columns 存在时从其 width 字段解析；否则从各个遗留 props 解析。
 */
export function initColWidths(options: {
  columns?: GanttColumnConfig[];
  rowWidth: string;
  nameColumnWidth?: string;
  timeColumnWidths?: {
    plannedStart?: string;
    plannedEnd?: string;
    plannedDuration?: string;
    actualStart?: string;
    actualEnd?: string;
  };
  operationsColumnWidth?: string;
  statusColumnWidth?: string;
  assigneeColumnWidth?: string;
}): Record<string, number> {
  const {
    columns,
    rowWidth,
    nameColumnWidth,
    timeColumnWidths,
    operationsColumnWidth,
    statusColumnWidth,
    assigneeColumnWidth,
  } = options;
  const defaultPx = parseWidthPx(rowWidth, 155);

  if (columns) {
    const result: Record<string, number> = {};
    columns.forEach((col) => {
      if (!col.hidden) {
        result[col.key] = parseWidthPx(col.width, defaultPx);
      }
    });
    return result;
  }

  // 遗留 props 模式
  return {
    name: parseWidthPx(nameColumnWidth ?? rowWidth, defaultPx),
    plannedStart: parseWidthPx(timeColumnWidths?.plannedStart ?? rowWidth, defaultPx),
    plannedEnd: parseWidthPx(timeColumnWidths?.plannedEnd ?? rowWidth, defaultPx),
    plannedDuration: parseWidthPx(timeColumnWidths?.plannedDuration, 100),
    actualStart: parseWidthPx(timeColumnWidths?.actualStart ?? rowWidth, defaultPx),
    actualEnd: parseWidthPx(timeColumnWidths?.actualEnd ?? rowWidth, defaultPx),
    operations: parseWidthPx(operationsColumnWidth, 120),
    status: parseWidthPx(statusColumnWidth, 100),
    assignee: parseWidthPx(assigneeColumnWidth, 100),
  };
}

/**
 * 将用户传入的 columns 与当前拖拽后的 colWidths 合并，
 * 返回每列 width 已更新为 `${px}px` 的数组，并过滤掉 hidden 列。
 * 当 columns 未传时返回 undefined（由各组件按遗留方式渲染）。
 */
export function applyColWidths(
  columns: GanttColumnConfig[] | undefined,
  colWidths: Record<string, number>,
  defaultPx: number
): GanttColumnConfig[] | undefined {
  if (!columns) return undefined;
  return columns
    .filter((c) => !c.hidden)
    .map((c) => ({
      ...c,
      width: `${colWidths[c.key] ?? parseWidthPx(c.width, defaultPx)}px`,
    }));
}
