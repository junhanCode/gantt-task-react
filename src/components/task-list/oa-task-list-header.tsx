import React from "react";
import styles from "./task-list-header.module.css";

export const OATaskListHeader: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  headerGutterRight?: number;
  expandAllLeafTasks?: boolean;
  onToggleExpandAll?: () => void;
  expandIcon?: React.ReactNode;
  collapseIcon?: React.ReactNode;
}> = ({ 
  headerHeight, 
  fontFamily, 
  fontSize, 
  rowWidth, 
  headerGutterRight,
  expandAllLeafTasks = true,
  onToggleExpandAll,
  expandIcon,
  collapseIcon,
}) => {
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
        {/* 任务标题列 */}
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: rowWidth,
            maxWidth: rowWidth,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {onToggleExpandAll && (
              <div
                onClick={onToggleExpandAll}
                style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                {expandAllLeafTasks 
                  ? (collapseIcon ?? <span>−</span>)
                  : (expandIcon ?? <span>+</span>)
                }
              </div>
            )}
            <span>任务标题</span>
          </div>
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.6,
            marginTop: headerHeight * 0.2,
          }}
        />
        
        {/* 状态列 */}
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: "100px",
            maxWidth: "100px",
            textAlign: 'center',
          }}
        >
          <span>状态</span>
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: headerHeight * 0.6,
            marginTop: headerHeight * 0.2,
          }}
        />
        
        {/* 负责人列 */}
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: "100px",
            maxWidth: "100px",
            textAlign: 'center',
          }}
        >
          <span>负责人</span>
        </div>
      </div>
    </div>
  );
};
