import React from "react";
import styles from "./task-list-header.module.css";

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  nameColumnWidth?: string;
  timeColumnLabels?: {
    plannedStart?: string;
    plannedEnd?: string;
    actualStart?: string;
    actualEnd?: string;
  };
  timeColumnWidths?: {
    plannedStart?: string;
    plannedEnd?: string;
    actualStart?: string;
    actualEnd?: string;
  };
  operationsColumnWidth?: string;
  operationsColumnLabel?: string;
}> = ({ headerHeight, fontFamily, fontSize, rowWidth, nameColumnWidth, timeColumnLabels, timeColumnWidths, operationsColumnWidth, operationsColumnLabel }) => {
  const label = {
    plannedStart: timeColumnLabels?.plannedStart ?? "Planned Start",
    plannedEnd: timeColumnLabels?.plannedEnd ?? "Planned End",
    actualStart: timeColumnLabels?.actualStart ?? "Actual Start",
    actualEnd: timeColumnLabels?.actualEnd ?? "Actual End",
  };
  const width = {
    name: nameColumnWidth ?? rowWidth,
    plannedStart: timeColumnWidths?.plannedStart ?? rowWidth,
    plannedEnd: timeColumnWidths?.plannedEnd ?? rowWidth,
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
          }}
        >
          &nbsp;Name
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.2,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: width.plannedStart,
          }}
        >
          &nbsp;{label.plannedStart}
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.25,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: width.plannedEnd,
          }}
        >
          &nbsp;{label.plannedEnd}
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.25,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: width.actualStart,
          }}
        >
          &nbsp;{label.actualStart}
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.25,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: width.actualEnd,
          }}
        >
          &nbsp;{label.actualEnd}
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.5,
            marginTop: headerHeight * 0.25,
          }}
        />
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: width.operations,
          }}
        >
          &nbsp;{operationsColumnLabel ?? "操作"}
        </div>
      </div>
    </div>
  );
};
