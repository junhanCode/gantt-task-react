import React, { useEffect, useMemo, useState } from "react";
import styles from "./task-list-table.module.css";
import { Task, GanttColumnConfig } from "../../types/public-types";
import { getVirtualRange, shouldUseVirtualScroll } from "../../helpers/virtual-scroll-helper";
import { getColumnValue } from "../../helpers/column-helper";

const formatYmd = (date: Date) => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}/${m}/${d}`;
};

/** 内置列的默认单元格渲染（不含 name，name 在外部特殊处理） */
const renderBuiltInCell = (key: string, task: Task): React.ReactNode => {
  switch (key) {
    case "plannedStart":
      return <React.Fragment>&nbsp;{formatYmd(task.plannedStart ?? task.start)}</React.Fragment>;
    case "plannedEnd":
      return <React.Fragment>&nbsp;{formatYmd(task.plannedEnd ?? task.end)}</React.Fragment>;
    case "actualStart":
      return <React.Fragment>&nbsp;{formatYmd(task.actualStart ?? task.start)}</React.Fragment>;
    case "actualEnd":
      return <React.Fragment>&nbsp;{formatYmd(task.actualEnd ?? task.end)}</React.Fragment>;
    default:
      return null;
  }
};

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
  nameColumnWidth?: string;
  timeColumnWidths?: {
    plannedStart?: string;
    plannedEnd?: string;
    plannedDuration?: string;
    actualStart?: string;
    actualEnd?: string;
  };
  timeColumnLabels?: {
    plannedStart?: string;
    plannedEnd?: string;
    plannedDuration?: string;
    actualStart?: string;
    actualEnd?: string;
  };
  operationsColumnWidth?: string;
  onAddTask?: (task: Task) => void;
  AddTaskModal?: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    parentTaskId: string;
    onConfirm: (taskData: Partial<Task>) => void;
  }>;
  onEditTask?: (task: Task) => void;
  EditTaskModal?: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    task: Task;
    onConfirm: (taskData: Partial<Task>) => void;
  }>;
  onDeleteTask?: (task: Task) => void;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  onDateChange?: (task: Task, children: Task[]) => void | boolean | Promise<void> | Promise<boolean>;
  scrollY?: number;
  containerHeight?: number;
  /** 统一列配置数组（由 task-list.tsx 传入，已合并列宽状态） */
  columns?: GanttColumnConfig[];
  tableStyles?: {
    height?: number | string;
    container?: React.CSSProperties;
    row?: React.CSSProperties | ((rowIndex: number) => React.CSSProperties);
    cell?: React.CSSProperties;
    header?: React.CSSProperties;
    headerCell?: React.CSSProperties;
    borderColor?: string;
    rowBackgroundColor?: string;
    rowEvenBackgroundColor?: string;
    cellPadding?: string;
    headerBackgroundColor?: string;
    headerTextColor?: string;
  };
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  onExpanderClick,
  nameColumnWidth,
  timeColumnWidths,
  onAddTask,
  onEditTask,
  onDeleteTask,
  expandIcon,
  collapseIcon,
  onDateChange,
  tableStyles,
  columns,
  scrollY = 0,
  containerHeight,
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuPos, setMenuPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [menuTask, setMenuTask] = useState<Task | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editingDuration, setEditingDuration] = useState<string>("");

  const calculateDuration = (start: Date, end: Date): number =>
    Math.ceil(Math.abs(end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));

  const handleAddClick = (task: Task) => { if (onAddTask) onAddTask(task); };
  const handleEditClick = (task: Task) => { if (onEditTask) onEditTask(task); };
  const handleDeleteClick = (task: Task) => { if (onDeleteTask) onDeleteTask(task); };

  const openContextMenu = (event: React.MouseEvent, task: Task) => {
    event.preventDefault();
    setMenuTask(task);
    setMenuPos({ x: event.clientX, y: event.clientY });
    setMenuVisible(true);
  };
  const closeMenu = () => setMenuVisible(false);

  const startEditDuration = (task: Task) => {
    const duration = calculateDuration(task.plannedStart ?? task.start, task.plannedEnd ?? task.end);
    setEditingTaskId(task.id);
    setEditingDuration(duration.toString());
  };

  const saveDuration = (task: Task) => {
    const newDuration = parseInt(editingDuration, 10);
    if (!isNaN(newDuration) && newDuration > 0 && onDateChange) {
      const plannedStart = task.plannedStart ?? task.start;
      const newPlannedEnd = new Date(plannedStart.getTime() + newDuration * 24 * 60 * 60 * 1000);
      onDateChange({ ...task, plannedEnd: newPlannedEnd }, []);
    }
    setEditingTaskId(null);
    setEditingDuration("");
  };

  const cancelEditDuration = () => {
    setEditingTaskId(null);
    setEditingDuration("");
  };

  useEffect(() => {
    const onDocClick = () => setMenuVisible(false);
    const onScroll = () => setMenuVisible(false);
    document.addEventListener("click", onDocClick);
    window.addEventListener("scroll", onScroll, true);
    return () => {
      document.removeEventListener("click", onDocClick);
      window.removeEventListener("scroll", onScroll, true);
    };
  }, []);

  // 若未传入 columns，从遗留 props 构建默认列（不含 operations，保持原有右键菜单交互）
  const resolvedColumns: GanttColumnConfig[] = columns ?? [
    { key: "name",            width: nameColumnWidth ?? rowWidth },
    { key: "plannedStart",    width: timeColumnWidths?.plannedStart    ?? rowWidth,  align: "center" },
    { key: "plannedEnd",      width: timeColumnWidths?.plannedEnd      ?? rowWidth,  align: "center" },
    { key: "plannedDuration", width: timeColumnWidths?.plannedDuration ?? "100px",   align: "center" },
    { key: "actualStart",     width: timeColumnWidths?.actualStart     ?? rowWidth,  align: "center" },
    { key: "actualEnd",       width: timeColumnWidths?.actualEnd       ?? rowWidth,  align: "center" },
  ];

  // 虚拟列表
  const useVirtual = shouldUseVirtualScroll(tasks.length) && !!containerHeight && containerHeight > 0;
  const virtualRange = useMemo(() => {
    if (!useVirtual) return null;
    return getVirtualRange(scrollY, containerHeight, rowHeight, tasks.length);
  }, [useVirtual, scrollY, containerHeight, rowHeight, tasks.length]);

  const visibleTasks = useMemo(() => {
    if (!virtualRange) return tasks;
    return tasks.slice(virtualRange.startIndex, virtualRange.endIndex + 1);
  }, [tasks, virtualRange]);

  const renderTasks = virtualRange ? visibleTasks : tasks;
  const topSpacerHeight = virtualRange ? virtualRange.startIndex * rowHeight : 0;
  const bottomSpacerHeight = virtualRange
    ? (tasks.length - virtualRange.endIndex - 1) * rowHeight
    : 0;

  const cellStyle: React.CSSProperties = {
    ...(tableStyles?.cellPadding ? { padding: tableStyles.cellPadding } : {}),
    ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
    ...(tableStyles?.cell || {}),
  };

  return (
    <div>
      <table
        className={styles.taskListTable}
        style={{
          fontFamily,
          fontSize,
          ...(tableStyles?.borderColor ? { borderColor: tableStyles.borderColor } : {}),
          ...(tableStyles?.container || {}),
        }}
      >
        <colgroup>
          {resolvedColumns.map((col) => (
            <col key={col.key} style={{ width: col.width }} />
          ))}
        </colgroup>
        <tbody>
          {topSpacerHeight > 0 && (
            <tr aria-hidden="true" style={{ height: topSpacerHeight }}>
              <td
                colSpan={resolvedColumns.length}
                style={{ padding: 0, border: "none", height: topSpacerHeight, lineHeight: 0 }}
              />
            </tr>
          )}

          {renderTasks.map((t, idx) => {
            const index = virtualRange ? virtualRange.startIndex + idx : idx;
            let expanderContent: React.ReactNode = null;
            if (t.hideChildren === false) {
              expanderContent = collapseIcon ?? (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="2" y="2" width="12" height="2" rx="1" />
                  <rect x="2" y="7" width="12" height="2" rx="1" />
                  <rect x="2" y="12" width="12" height="2" rx="1" />
                </svg>
              );
            } else if (t.hideChildren === true) {
              expanderContent = expandIcon ?? (
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                  <rect x="2" y="2" width="4" height="4" rx="1" />
                  <rect x="10" y="2" width="4" height="4" rx="1" />
                  <rect x="2" y="10" width="4" height="4" rx="1" />
                  <rect x="10" y="10" width="4" height="4" rx="1" />
                </svg>
              );
            }
            const isChildTask = !!t.project;

            return (
              <tr
                key={`${t.id}row`}
                className={`${styles.taskListTableRow}${isChildTask ? ` ${styles.taskListTableRowChild}` : ""}`}
                onContextMenu={(e) => openContextMenu(e, t)}
                style={{
                  height: rowHeight,
                  ...(tableStyles?.rowBackgroundColor && index % 2 === 0
                    ? { backgroundColor: tableStyles.rowBackgroundColor }
                    : {}),
                  ...(tableStyles?.rowEvenBackgroundColor && index % 2 === 1
                    ? { backgroundColor: tableStyles.rowEvenBackgroundColor }
                    : {}),
                  ...(typeof tableStyles?.row === "function"
                    ? tableStyles.row(index)
                    : tableStyles?.row || {}),
                }}
              >
                {resolvedColumns.map((col) => {
                  const tdStyle: React.CSSProperties = {
                    ...cellStyle,
                    textAlign: col.align ?? "left",
                  };

                  // ── name 列：始终保留展开图标，render 替换文字部分 ──────────
                  if (col.key === "name") {
                    const nameContent = col.render
                      ? col.render(t.name, t, index)
                      : t.name;
                    return (
                      <td
                        key="name"
                        className={styles.taskListCell}
                        style={{ ...cellStyle, textAlign: "left" }}
                        title={t.name}
                      >
                        <div className={styles.taskListNameWrapper}>
                          <div
                            className={expanderContent ? styles.taskListExpander : styles.taskListEmptyExpander}
                            onClick={() => onExpanderClick(t)}
                          >
                            {expanderContent}
                          </div>
                          <div className={styles.taskListNameText}>{nameContent}</div>
                        </div>
                      </td>
                    );
                  }

                  // ── plannedDuration 列：支持双击编辑 ──────────────────────
                  if (col.key === "plannedDuration") {
                    const durationValue = calculateDuration(
                      t.plannedStart ?? t.start,
                      t.plannedEnd ?? t.end
                    );
                    const cellContent = col.render
                      ? col.render(durationValue, t, index)
                      : editingTaskId === t.id
                      ? (
                        <input
                          type="number"
                          min="1"
                          value={editingDuration}
                          onChange={(e) => setEditingDuration(e.target.value)}
                          onBlur={() => saveDuration(t)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") saveDuration(t);
                            else if (e.key === "Escape") cancelEditDuration();
                          }}
                          autoFocus
                          style={{ width: "80%", padding: "2px 4px", textAlign: "center" }}
                        />
                      ) : (
                        <span>{durationValue}</span>
                      );
                    return (
                      <td
                        key="plannedDuration"
                        className={styles.taskListCell}
                        style={{ ...tdStyle, cursor: col.render ? "default" : "pointer" }}
                        onDoubleClick={col.render ? undefined : () => startEditDuration(t)}
                      >
                        {cellContent}
                      </td>
                    );
                  }

                  // ── operations 列 ─────────────────────────────────────────
                  if (col.key === "operations") {
                    return (
                      <td key="operations" className={styles.taskListCell} style={tdStyle}>
                        {col.render ? col.render(undefined, t, index) : (
                          <div className={styles.operationsContainer}>
                            {onAddTask && (
                              <span className={styles.addIcon} onClick={(e) => { e.stopPropagation(); onAddTask(t); }} title="新增子任务">+</span>
                            )}
                            {onEditTask && (
                              <span className={styles.actionIcon} onClick={(e) => { e.stopPropagation(); onEditTask(t); }} title="编辑">✎</span>
                            )}
                            {onDeleteTask && (
                              <span className={styles.actionIcon} onClick={(e) => { e.stopPropagation(); onDeleteTask(t); }} title="删除">×</span>
                            )}
                          </div>
                        )}
                      </td>
                    );
                  }

                  // ── 其他内置列 & 完全自定义列 ──────────────────────────────
                  const value = getColumnValue(col.key, t);
                  const content = col.render
                    ? col.render(value, t, index)
                    : renderBuiltInCell(col.key, t) ?? (value != null ? String(value) : "");

                  return (
                    <td key={col.key} className={styles.taskListCell} style={tdStyle}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            );
          })}

          {bottomSpacerHeight > 0 && (
            <tr aria-hidden="true" style={{ height: bottomSpacerHeight }}>
              <td
                colSpan={resolvedColumns.length}
                style={{ padding: 0, border: "none", height: bottomSpacerHeight, lineHeight: 0 }}
              />
            </tr>
          )}
        </tbody>
      </table>

      {/* 右键菜单 */}
      {menuVisible && menuTask && (
        <div
          className={styles.contextMenu}
          style={{ left: menuPos.x, top: menuPos.y }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div className={styles.contextMenuItem} onClick={() => { closeMenu(); handleAddClick(menuTask); }}>
            新增子任务
          </div>
          <div className={styles.contextMenuItem} onClick={() => { closeMenu(); handleEditClick(menuTask); }}>
            编辑
          </div>
          <div className={styles.contextMenuItem} onClick={() => { closeMenu(); handleDeleteClick(menuTask); }}>
            删除
          </div>
        </div>
      )}
    </div>
  );
};
