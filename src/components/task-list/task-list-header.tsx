import React from "react";
import styles from "./task-list-header.module.css";

// 默认的田字形图标（展开状态）
const DefaultExpandIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="2" width="4" height="4" rx="1" />
    <rect x="10" y="2" width="4" height="4" rx="1" />
    <rect x="2" y="10" width="4" height="4" rx="1" />
    <rect x="10" y="10" width="4" height="4" rx="1" />
  </svg>
);

// 默认的日字形图标（折叠状态）
const DefaultCollapseIcon: React.FC<{ size?: number }> = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 16 16" fill="currentColor">
    <rect x="2" y="2" width="12" height="2" rx="1" />
    <rect x="2" y="7" width="12" height="2" rx="1" />
    <rect x="2" y="12" width="12" height="2" rx="1" />
  </svg>
);

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
  isTaskListCollapsed?: boolean;
  onToggleTaskList?: () => void;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
}> = ({ 
  headerHeight, 
  fontFamily, 
  fontSize, 
  rowWidth, 
  nameColumnWidth, 
  timeColumnLabels, 
  timeColumnWidths, 
  operationsColumnWidth, 
  operationsColumnLabel,
  isTaskListCollapsed = false,
  onToggleTaskList,
  expandIcon,
  collapseIcon
}) => {
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
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          {onToggleTaskList && (
            <button
              className={styles.toggleButton}
              onClick={onToggleTaskList}
              title={isTaskListCollapsed ? "展开任务列表" : "折叠任务列表"}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: '2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#666',
                borderRadius: '2px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#f0f0f0';
                e.currentTarget.style.color = '#333';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent';
                e.currentTarget.style.color = '#666';
              }}
            >
              {isTaskListCollapsed 
                ? (expandIcon || <DefaultExpandIcon />)
                : (collapseIcon || <DefaultCollapseIcon />)
              }
            </button>
          )}
          <span>Name</span>
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
