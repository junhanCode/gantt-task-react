import React from "react";
import styles from "./task-list-header.module.css";

export const OATaskListHeader: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  headerGutterRight?: number;
  nameColumnWidth?: string;
  expandAllLeafTasks?: boolean;
  onToggleExpandAll?: () => void;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
  operationsColumnWidth?: string;
  operationsColumnLabel?: string;
  showOperationsColumn?: boolean;
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
  headerHeight, 
  fontFamily, 
  fontSize, 
  rowWidth,
  nameColumnWidth,
  headerGutterRight,
  expandAllLeafTasks = true,
  onToggleExpandAll,
  expandIcon,
  collapseIcon,
  operationsColumnWidth,
  operationsColumnLabel,
  showOperationsColumn = true,
  tableStyles,
}) => { 
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
          height: headerHeight - 2,
          ...(tableStyles?.headerBackgroundColor ? { backgroundColor: tableStyles.headerBackgroundColor } : {}),
        }}
      >
        {/* 任務標題列 */}
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: nameColumnWidth || rowWidth,
            maxWidth: nameColumnWidth || rowWidth,
            ...(tableStyles?.cellPadding ? { padding: tableStyles.cellPadding } : {}),
            ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
            ...(tableStyles?.headerTextColor ? { color: tableStyles.headerTextColor } : {}),
            ...(tableStyles?.headerCell || {}),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {onToggleExpandAll && (
              <div
                onClick={onToggleExpandAll}
                style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                {/* expandAllLeafTasks=true 表示所有任务被折叠，显示折叠图标（表示当前状态） */}
                {expandAllLeafTasks 
                  ? (collapseIcon ?? (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                        <rect x="2" y="2" width="12" height="2" rx="1" />
                        <rect x="2" y="7" width="12" height="2" rx="1" />
                        <rect x="2" y="12" width="12" height="2" rx="1" />
                      </svg>
                    ))
                  : (expandIcon ?? (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                        <rect x="2" y="2" width="4" height="4" rx="1" />
                        <rect x="10" y="2" width="4" height="4" rx="1" />
                        <rect x="2" y="10" width="4" height="4" rx="1" />
                        <rect x="10" y="10" width="4" height="4" rx="1" />
                      </svg>
                    ))
                }
              </div>
            )}
            <span>任務標題</span>
          </div>
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.6,
            marginTop: headerHeight * 0.2,
          }}
        />
        
        {/* 狀態列 */}
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: "100px",
            maxWidth: "100px",
            textAlign: 'center',
            ...(tableStyles?.cellPadding ? { padding: tableStyles.cellPadding } : {}),
            ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
            ...(tableStyles?.headerTextColor ? { color: tableStyles.headerTextColor } : {}),
            ...(tableStyles?.headerCell || {}),
          }}
        >
          <span>狀態</span>
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.6,
            marginTop: headerHeight * 0.2,
          }}
        />
        
        {/* 負責人列 */}
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: "100px",
            maxWidth: "100px",
            textAlign: 'center',
            ...(tableStyles?.cellPadding ? { padding: tableStyles.cellPadding } : {}),
            ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
            ...(tableStyles?.headerTextColor ? { color: tableStyles.headerTextColor } : {}),
            ...(tableStyles?.headerCell || {}),
          }}
        >
          <span>負責人</span>
        </div>
        {showOperationsColumn && (
          <React.Fragment>
            <div
              className={styles.ganttTable_HeaderSeparator}
              style={{
                height: headerHeight * 0.6,
                marginTop: headerHeight * 0.2,
              }}
            />
            {/* 操作列 */}
            <div
              className={styles.ganttTable_HeaderItem}
              style={{
                minWidth: operationsColumnWidth ?? "120px",
                maxWidth: operationsColumnWidth ?? "120px",
                textAlign: 'center',
                ...(tableStyles?.cellPadding ? { padding: tableStyles.cellPadding } : {}),
                ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
                ...(tableStyles?.headerTextColor ? { color: tableStyles.headerTextColor } : {}),
                ...(tableStyles?.headerCell || {}),
              }}
            >
              <span>{operationsColumnLabel ?? "操作"}</span>
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
