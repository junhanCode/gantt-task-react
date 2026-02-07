import React from "react";
import { I18nTexts } from "../../i18n";
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
  rowSelection?: {
    columnWidth?: string;
    /** 自定义多选列表头，支持 ReactNode 或渲染函数 */
    columnTitle?: React.ReactNode | ((props: { defaultLabel: string }) => React.ReactNode);
    showSelectAll?: boolean;
    checkboxBorderColor?: string;
  };
  /** 未读列配置 */
  unreadColumn?: {
    show?: boolean;
    width?: string;
    title?: string;
  };
  allSelected?: boolean;
  indeterminate?: boolean;
  onSelectAll?: (checked: boolean) => void;
  /** 任务标题列表头自定义渲染。入参为默认展开/折叠节点和标题文案，返回表头内容（可含图标并自行绑定 onClick） */
  taskTitleHeaderRender?: (props: {
    expandCollapseNode: React.ReactNode;
    titleText: string;
  }) => React.ReactNode;
  /** 表头列自定义渲染（类似 Ant Design columns[].title），未指定时回退到默认或 taskTitleHeaderRender */
  columnHeaderRenderers?: Partial<{
    rowSelection: React.ReactNode | ((props: { defaultLabel: string }) => React.ReactNode);
    unread: React.ReactNode | ((props: { defaultLabel: string }) => React.ReactNode);
    name: React.ReactNode | ((props: { expandCollapseNode: React.ReactNode; defaultLabel: string }) => React.ReactNode);
    status: React.ReactNode | ((props: { defaultLabel: string }) => React.ReactNode);
    assignee: React.ReactNode | ((props: { defaultLabel: string }) => React.ReactNode);
    operations: React.ReactNode | ((props: { defaultLabel: string }) => React.ReactNode);
  }>;
  i18n?: I18nTexts;
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
  rowSelection,
  unreadColumn,
  allSelected = false,
  indeterminate = false,
  onSelectAll,
  taskTitleHeaderRender,
  columnHeaderRenderers,
  i18n,
}) => {
  const renderHeader = (
    key: keyof NonNullable<typeof columnHeaderRenderers>,
    defaultLabel: string,
    extra?: { expandCollapseNode?: React.ReactNode }
  ): React.ReactNode => {
    const renderer = columnHeaderRenderers?.[key];
    if (!renderer) return defaultLabel;
    if (typeof renderer === 'function') {
      return renderer({
        defaultLabel,
        ...(extra?.expandCollapseNode !== undefined && { expandCollapseNode: extra.expandCollapseNode }),
      } as any);
    }
    return renderer;
  };

  const expandCollapseNode = onToggleExpandAll ? (
    <div
      onClick={onToggleExpandAll}
      style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
    >
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
        className={`${styles.ganttTable_Header} oa-task-list-header-row`}
        style={{
          height: (tableStyles?.headerHeight ?? headerHeight),
          ...(tableStyles?.headerBackgroundColor ? { backgroundColor: tableStyles.headerBackgroundColor } : {}),
        }}
      >
        {/* 多選列 */}
        {rowSelection && (
          <React.Fragment>
            <div
              className={styles.ganttTable_HeaderItem}
              style={{
                minWidth: rowSelection.columnWidth || "50px",
                maxWidth: rowSelection.columnWidth || "50px",
                textAlign: 'center',
                ...(tableStyles?.headerCellPadding ?? tableStyles?.cellPadding ? { padding: tableStyles?.headerCellPadding ?? tableStyles?.cellPadding } : {}),
                ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
                ...(tableStyles?.headerTextColor ? { color: tableStyles.headerTextColor } : {}),
                ...(tableStyles?.headerCell || {}),
              }}
            >
              {rowSelection.showSelectAll !== false && onSelectAll ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                  <input
                    type="checkbox"
                    className={rowSelection.checkboxBorderColor ? styles.rowSelectionCheckbox : undefined}
                    checked={allSelected}
                    ref={(input) => {
                      if (input) {
                        input.indeterminate = indeterminate;
                      }
                    }}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    style={{
                      cursor: 'pointer',
                      ...(rowSelection.checkboxBorderColor ? {
                        ['--checkbox-border-color' as string]: rowSelection.checkboxBorderColor,
                      } as React.CSSProperties : {}),
                    }}
                  />
                  {rowSelection.columnTitle != null && (() => {
                    const title = rowSelection.columnTitle!;
                    const defaultLabel = '選擇';
                    const content = typeof title === 'function' ? title({ defaultLabel }) : title;
                    return typeof content === 'string' ? <span>{content}</span> : content;
                  })()}
                </div>
              ) : (
                (() => {
                  const renderer = columnHeaderRenderers?.rowSelection;
                  if (renderer) {
                    const res = typeof renderer === 'function' ? renderer({ defaultLabel: '選擇' }) : renderer;
                    if (res != null) return res;
                  }
                  const title = rowSelection.columnTitle;
                  const defaultLabel = '選擇';
                  const content = typeof title === 'function' ? title({ defaultLabel }) : (title ?? defaultLabel);
                  return content != null ? (typeof content === 'string' ? <span>{content}</span> : content) : <span>{defaultLabel}</span>;
                })()
              )}
            </div>
            <div
              className={styles.ganttTable_HeaderSeparator}
              style={{
                height: (tableStyles?.headerHeight ?? headerHeight) * 0.5,
                marginTop: (tableStyles?.headerHeight ?? headerHeight) * 0.25,
              }}
            />
          </React.Fragment>
        )}
        {/* 未读列 */}
        {unreadColumn?.show && (
          <React.Fragment>
            <div
              className={`${styles.ganttTable_HeaderItem} ${styles.ganttTable_HeaderItem_unread}`}
              style={{
                minWidth: unreadColumn.width || "40px",
                maxWidth: unreadColumn.width || "40px",
                textAlign: 'center',
                ...(tableStyles?.headerCellPadding ?? tableStyles?.cellPadding ? { padding: tableStyles?.headerCellPadding ?? tableStyles?.cellPadding } : {}),
                ...(tableStyles?.headerTextColor ? { color: tableStyles.headerTextColor } : {}),
                ...(tableStyles?.headerCell || {}),
              }}
            >
              {(() => {
                const custom = renderHeader('unread', unreadColumn.title || "未读");
                if (typeof custom === 'string') return <span>{custom}</span>;
                return custom;
              })()}
            </div>
            <div
              className={styles.ganttTable_HeaderSeparator}
              style={{
                height: (tableStyles?.headerHeight ?? headerHeight) * 0.5,
                marginTop: (tableStyles?.headerHeight ?? headerHeight) * 0.25,
              }}
            />
          </React.Fragment>
        )}
        {/* 任務標題列 */}
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: nameColumnWidth || rowWidth,
            maxWidth: nameColumnWidth || rowWidth,
            ...(tableStyles?.headerCellPadding ?? tableStyles?.cellPadding ? { padding: tableStyles?.headerCellPadding ?? tableStyles?.cellPadding } : {}),
            ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
            ...(tableStyles?.headerTextColor ? { color: tableStyles.headerTextColor } : {}),
            ...(tableStyles?.headerCell || {}),
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            {(() => {
              const nameRenderer = columnHeaderRenderers?.name ?? taskTitleHeaderRender;
              if (nameRenderer) {
                let content: React.ReactNode;
                if (typeof nameRenderer === 'function') {
                  const taskTitle = i18n?.taskTitle || "任務標題";
                  content = columnHeaderRenderers?.name
                    ? (nameRenderer as (p: { expandCollapseNode: React.ReactNode; defaultLabel: string }) => React.ReactNode)({ expandCollapseNode, defaultLabel: taskTitle })
                    : taskTitleHeaderRender!({ expandCollapseNode, titleText: taskTitle });
                } else {
                  content = nameRenderer;
                }
                if (content) return content;
              }
              return (
                <React.Fragment>
                  {expandCollapseNode}
                  <span>{i18n?.taskTitle || "任務標題"}</span>
                </React.Fragment>
              );
            })()}
          </div>
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: (tableStyles?.headerHeight ?? headerHeight) * 0.5,
            marginTop: (tableStyles?.headerHeight ?? headerHeight) * 0.25,
          }}
        />
        
        {/* 狀態列 */}
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: "100px",
            maxWidth: "100px",
            textAlign: 'center',
            ...(tableStyles?.headerCellPadding ?? tableStyles?.cellPadding ? { padding: tableStyles?.headerCellPadding ?? tableStyles?.cellPadding } : {}),
            ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
            ...(tableStyles?.headerTextColor ? { color: tableStyles.headerTextColor } : {}),
            ...(tableStyles?.headerCell || {}),
          }}
        >
          {(() => {
            const custom = renderHeader('status', i18n?.status || '狀態');
            if (typeof custom === 'string') return <span>{custom}</span>;
            return custom;
          })()}
        </div>
        <div
          className={styles.ganttTable_HeaderSeparator}
          style={{
            height: (tableStyles?.headerHeight ?? headerHeight) * 0.5,
            marginTop: (tableStyles?.headerHeight ?? headerHeight) * 0.25,
          }}
        />
        
        {/* 負責人列 */}
        <div
          className={styles.ganttTable_HeaderItem}
          style={{
            minWidth: "100px",
            maxWidth: "100px",
            textAlign: 'center',
            ...(tableStyles?.headerCellPadding ?? tableStyles?.cellPadding ? { padding: tableStyles?.headerCellPadding ?? tableStyles?.cellPadding } : {}),
            ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
            ...(tableStyles?.headerTextColor ? { color: tableStyles.headerTextColor } : {}),
            ...(tableStyles?.headerCell || {}),
          }}
        >
          {(() => {
            const custom = renderHeader('assignee', i18n?.assignee || '負責人');
            if (typeof custom === 'string') return <span>{custom}</span>;
            return custom;
          })()}
        </div>
        {showOperationsColumn && (
          <React.Fragment>
            <div
              className={styles.ganttTable_HeaderSeparator}
              style={{
                height: (tableStyles?.headerHeight ?? headerHeight) * 0.5,
                marginTop: (tableStyles?.headerHeight ?? headerHeight) * 0.25,
              }}
            />
            {/* 操作列 */}
            <div
              className={styles.ganttTable_HeaderItem}
              style={{
                minWidth: operationsColumnWidth ?? "120px",
                maxWidth: operationsColumnWidth ?? "120px",
                textAlign: 'center',
                ...(tableStyles?.headerCellPadding ?? tableStyles?.cellPadding ? { padding: tableStyles?.headerCellPadding ?? tableStyles?.cellPadding } : {}),
                ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
                ...(tableStyles?.headerTextColor ? { color: tableStyles.headerTextColor } : {}),
                ...(tableStyles?.headerCell || {}),
              }}
            >
              {(() => {
                const custom = renderHeader('operations', operationsColumnLabel ?? "操作");
                if (typeof custom === 'string') return <span>{custom}</span>;
                return custom;
              })()}
            </div>
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
