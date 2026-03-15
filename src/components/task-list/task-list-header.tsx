import React from "react";
import styles from "./task-list-header.module.css";
import { GanttColumnConfig } from "../../types/public-types";

/** 可拖拽的列 key */
type ColKey = "name" | "plannedStart" | "plannedEnd" | "plannedDuration" | "actualStart" | "actualEnd" | "operations";

const MIN_COL_WIDTH = 50;

/** 开始拖拽列宽 */
const startResize = (
  e: React.MouseEvent,
  colKey: ColKey,
  onColumnResize: (colKey: string, newWidthPx: number) => void
) => {
  e.preventDefault();
  e.stopPropagation();
  const cell = (e.currentTarget as HTMLElement).parentElement!;
  const startX = e.clientX;
  const startWidth = cell.getBoundingClientRect().width;

  const onMouseMove = (ev: MouseEvent) => {
    const newWidth = Math.max(MIN_COL_WIDTH, Math.round(startWidth + ev.clientX - startX));
    onColumnResize(colKey, newWidth);
  };

  const onMouseUp = () => {
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
  };

  document.body.style.cursor = "col-resize";
  document.body.style.userSelect = "none";
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
};


export const 
TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  headerGutterRight?: number;
  nameColumnWidth?: string;
  timeColumnLabels?: {
    plannedStart?: string;
    plannedEnd?: string;
    plannedDuration?: string;
    actualStart?: string;
    actualEnd?: string;
  };
  timeColumnWidths?: {
    plannedStart?: string;
    plannedEnd?: string;
    plannedDuration?: string;
    actualStart?: string;
    actualEnd?: string;
  };
  operationsColumnWidth?: string;
  operationsColumnLabel?: string;
  isTaskListCollapsed?: boolean;
  onToggleTaskList?: () => void;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  /** 列宽拖拽回调，传入列 key 和新宽度（px） */
  onColumnResize?: (colKey: string, newWidthPx: number) => void;
  /** 统一列配置数组（由 task-list.tsx 传入，已合并列宽状态） */
  columns?: GanttColumnConfig[];
  tableStyles?: {
    headerHeight?: number;
    height?: number | string;
    container?: React.CSSProperties;
    row?: React.CSSProperties | ((rowIndex: number) => React.CSSProperties);
    cell?: React.CSSProperties;
    header?: React.CSSProperties;
    headerCell?: React.CSSProperties;
    headerCellPadding?: string;
    borderColor?: string;
    rowBackgroundColor?: string;
    rowEvenBackgroundColor?: string;
    cellPadding?: string;
    headerBackgroundColor?: string;
    headerTextColor?: string;
  };
}> = ({ 
  headerHeight, 
  fontFamily, 
  fontSize, 
  rowWidth, 
  headerGutterRight,
  nameColumnWidth, 
  timeColumnLabels, 
  timeColumnWidths, 
  operationsColumnWidth, 
  operationsColumnLabel,
  onColumnResize,
  columns,
  tableStyles,
}) => {
  // 若传入了统一 columns，使用它；否则从遗留 props 构建默认列
  const resolvedColumns: GanttColumnConfig[] = columns ?? [
    { key: "name",             title: "Item",                                                    width: nameColumnWidth ?? rowWidth },
    { key: "plannedStart",     title: timeColumnLabels?.plannedStart     ?? "Planned Start",     width: timeColumnWidths?.plannedStart     ?? rowWidth,  align: "center" },
    { key: "plannedEnd",       title: timeColumnLabels?.plannedEnd       ?? "Planned End",       width: timeColumnWidths?.plannedEnd       ?? rowWidth,  align: "center" },
    { key: "plannedDuration",  title: timeColumnLabels?.plannedDuration  ?? "Duration (Days)",   width: timeColumnWidths?.plannedDuration  ?? "100px",   align: "center" },
    { key: "actualStart",      title: timeColumnLabels?.actualStart      ?? "Actual Start",      width: timeColumnWidths?.actualStart      ?? rowWidth,  align: "center" },
    { key: "actualEnd",        title: timeColumnLabels?.actualEnd        ?? "Actual End",        width: timeColumnWidths?.actualEnd        ?? rowWidth,  align: "center" },
    { key: "operations",       title: operationsColumnLabel              ?? "操作",              width: operationsColumnWidth              ?? "120px",   align: "center" },
  ];

  const hPx = tableStyles?.headerHeight ?? headerHeight;

  const commonCellStyle = (col: GanttColumnConfig): React.CSSProperties => ({
    minWidth: col.width,
    maxWidth: col.width,
    textAlign: col.align ?? "left",
    ...(tableStyles?.headerCellPadding ?? tableStyles?.cellPadding
      ? { padding: tableStyles?.headerCellPadding ?? tableStyles?.cellPadding }
      : {}),
    ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
    ...(tableStyles?.headerTextColor ? { color: tableStyles.headerTextColor } : {}),
    ...(tableStyles?.headerCell || {}),
  });

  const handle = (colKey: string) =>
    onColumnResize ? (
      <div
        className={styles.resizeHandle}
        onMouseDown={(e) => startResize(e, colKey as ColKey, onColumnResize)}
      />
    ) : null;

  const separator = (
    <div
      className={styles.ganttTable_HeaderSeparator}
      style={{ height: hPx * 0.6, marginTop: hPx * 0.2 }}
    />
  );

  return (
    <div
      className={styles.ganttTable}
      style={{
        fontFamily,
        fontSize,
        paddingRight: headerGutterRight ?? 0,
        ...(tableStyles?.borderColor ? {
          borderColor: tableStyles.borderColor,
          borderTopColor: tableStyles.borderColor,
          borderBottomColor: tableStyles.borderColor,
          borderLeftColor: tableStyles.borderColor,
          borderRightColor: tableStyles.borderColor,
        } : {}),
        ...(tableStyles?.header || {}),
      }}
    >
      <div
        className={styles.ganttTable_Header}
        style={{
          height: hPx - 2,
          ...(tableStyles?.headerBackgroundColor ? { backgroundColor: tableStyles.headerBackgroundColor } : {}),
        }}
      >
        {resolvedColumns.map((col, i) => (
          <React.Fragment key={col.key}>
            {i > 0 && separator}
            <div className={styles.ganttTable_HeaderItem} style={commonCellStyle(col)}>
              {col.renderTitle ? col.renderTitle() : <span>&nbsp;{col.title}</span>}
              {handle(col.key)}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
