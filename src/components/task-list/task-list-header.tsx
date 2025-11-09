import React from "react";
import styles from "./task-list-header.module.css";


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
  return (
    <div
      className={styles.ganttTable}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
        paddingRight: headerGutterRight ?? 0,
      }}
    >
      <div
        className={styles.ganttTable_Header}
        style={{
          height: headerHeight - 2,
        }}
      >
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: width.name,
            maxWidth: width.name,
          }}
        >
          <span>Item</span>
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.6,
            marginTop: headerHeight * 0.2,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: width.plannedStart,
            maxWidth: width.plannedStart,
            textAlign: 'center',
          }}
        >
          &nbsp;{label.plannedStart}
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.6,
            marginTop: headerHeight * 0.2,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: width.plannedEnd,
            maxWidth: width.plannedEnd,
            textAlign: 'center',
          }}
        >
          &nbsp;{label.plannedEnd}
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.6,
            marginTop: headerHeight * 0.2,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: width.plannedDuration,
            maxWidth: width.plannedDuration,
            textAlign: 'center',
          }}
        >
          &nbsp;{label.plannedDuration}
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.6,
            marginTop: headerHeight * 0.2,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: width.actualStart,
            maxWidth: width.actualStart,
            textAlign: 'center',
          }}
        >
          &nbsp;{label.actualStart}
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.6,
            marginTop: headerHeight * 0.2,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: width.actualEnd,
            maxWidth: width.actualEnd,
            textAlign: 'center',
          }}
        >
          &nbsp;{label.actualEnd}
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.6,
            marginTop: headerHeight * 0.2,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: width.operations,
            maxWidth: width.operations,
            textAlign: 'center',
          }}
        >
          &nbsp;{operationsColumnLabel ?? "操作"}
        </div>
      </div>
    </div>
  );
};
