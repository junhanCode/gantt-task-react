import React from "react";
import styles from "./task-list-header.module.css";

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
  tableStyles,
}) => {
  const label = {
    plannedStart: timeColumnLabels?.plannedStart ?? "Planned Start",
    plannedEnd: timeColumnLabels?.plannedEnd ?? "Planned End",
    plannedDuration: timeColumnLabels?.plannedDuration ?? "Duration (Days)",
    actualStart: timeColumnLabels?.actualStart ?? "Actual Start",
    actualEnd: timeColumnLabels?.actualEnd ?? "Actual End",
  };
  const width = {
    name: nameColumnWidth ?? rowWidth,
    plannedStart: timeColumnWidths?.plannedStart ?? rowWidth,
    plannedEnd: timeColumnWidths?.plannedEnd ?? rowWidth,
    plannedDuration: timeColumnWidths?.plannedDuration ?? "100px",
    actualStart: timeColumnWidths?.actualStart ?? rowWidth,
    actualEnd: timeColumnWidths?.actualEnd ?? rowWidth,
    operations: operationsColumnWidth ?? "120px",
  };

  const commonCellStyle = (w: string): React.CSSProperties => ({
    minWidth: w,
    maxWidth: w,
    ...(tableStyles?.headerCellPadding ?? tableStyles?.cellPadding ? { padding: tableStyles?.headerCellPadding ?? tableStyles?.cellPadding } : {}),
    ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
    ...(tableStyles?.headerTextColor ? { color: tableStyles.headerTextColor } : {}),
    ...(tableStyles?.headerCell || {}),
  });

  const handle = (colKey: ColKey) =>
    onColumnResize ? (
      <div
        className={styles.resizeHandle}
        onMouseDown={(e) => startResize(e, colKey, onColumnResize)}
      />
    ) : null;

  return (
    <div
      className={styles.ganttTable}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
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
          height: (tableStyles?.headerHeight ?? headerHeight) - 2,
          ...(tableStyles?.headerBackgroundColor ? { backgroundColor: tableStyles.headerBackgroundColor } : {}),
        }}
      >
        <div className={styles.ganttTable_HeaderItem} style={commonCellStyle(width.name)}>
          <span>Item</span>
          {handle("name")}
        </div>
        <div className={styles.ganttTable_HeaderSeparator}
          style={{ height: (tableStyles?.headerHeight ?? headerHeight) * 0.6, marginTop: (tableStyles?.headerHeight ?? headerHeight) * 0.2 }}
        />
        <div className={styles.ganttTable_HeaderItem} style={{ ...commonCellStyle(width.plannedStart), textAlign: "center" }}>
          &nbsp;{label.plannedStart}
          {handle("plannedStart")}
        </div>
        <div className={styles.ganttTable_HeaderSeparator}
          style={{ height: (tableStyles?.headerHeight ?? headerHeight) * 0.6, marginTop: (tableStyles?.headerHeight ?? headerHeight) * 0.2 }}
        />
        <div className={styles.ganttTable_HeaderItem} style={{ ...commonCellStyle(width.plannedEnd), textAlign: "center" }}>
          &nbsp;{label.plannedEnd}
          {handle("plannedEnd")}
        </div>
        <div className={styles.ganttTable_HeaderSeparator}
          style={{ height: (tableStyles?.headerHeight ?? headerHeight) * 0.6, marginTop: (tableStyles?.headerHeight ?? headerHeight) * 0.2 }}
        />
        <div className={styles.ganttTable_HeaderItem} style={{ ...commonCellStyle(width.plannedDuration), textAlign: "center" }}>
          &nbsp;{label.plannedDuration}
          {handle("plannedDuration")}
        </div>
        <div className={styles.ganttTable_HeaderSeparator}
          style={{ height: (tableStyles?.headerHeight ?? headerHeight) * 0.6, marginTop: (tableStyles?.headerHeight ?? headerHeight) * 0.2 }}
        />
        <div className={styles.ganttTable_HeaderItem} style={{ ...commonCellStyle(width.actualStart), textAlign: "center" }}>
          &nbsp;{label.actualStart}
          {handle("actualStart")}
        </div>
        <div className={styles.ganttTable_HeaderSeparator}
          style={{ height: (tableStyles?.headerHeight ?? headerHeight) * 0.6, marginTop: (tableStyles?.headerHeight ?? headerHeight) * 0.2 }}
        />
        <div className={styles.ganttTable_HeaderItem} style={{ ...commonCellStyle(width.actualEnd), textAlign: "center" }}>
          &nbsp;{label.actualEnd}
          {handle("actualEnd")}
        </div>
        <div className={styles.ganttTable_HeaderSeparator}
          style={{ height: (tableStyles?.headerHeight ?? headerHeight) * 0.6, marginTop: (tableStyles?.headerHeight ?? headerHeight) * 0.2 }}
        />
        <div className={styles.ganttTable_HeaderItem} style={{ ...commonCellStyle(width.operations), textAlign: "center" }}>
          &nbsp;{operationsColumnLabel ?? "操作"}
          {handle("operations")}
        </div>
      </div>
    </div>
  );
};
