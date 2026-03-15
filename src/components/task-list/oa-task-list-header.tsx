import React from "react";
import { I18nTexts } from "../../i18n";
import styles from "./task-list-header.module.css";
import { GanttColumnConfig } from "../../types/public-types";

const MIN_COL_WIDTH = 50;

const startResize = (
  e: React.MouseEvent,
  colKey: string,
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
  /** 状态列宽度（可通过拖拽调整） */
  statusColumnWidth?: string;
  /** 负责人列宽度（可通过拖拽调整） */
  assigneeColumnWidth?: string;
  /** 列宽拖拽回调，列 key + 新宽度(px) */
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
  statusColumnWidth,
  assigneeColumnWidth,
  onColumnResize,
  columns,
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

  const handle = (colKey: string) =>
    onColumnResize ? (
      <div
        className={styles.resizeHandle}
        onMouseDown={(e) => startResize(e, colKey, onColumnResize)}
      />
    ) : null;

  const hPx = tableStyles?.headerHeight ?? headerHeight;

  // 遗留模式下的默认列列表（不含系统列 rowSelection/unread），含标题回退
  const legacyColumns: GanttColumnConfig[] = [
    { key: "name",     title: i18n?.taskTitle ?? "任務標題", width: nameColumnWidth    ?? rowWidth,    align: "left"   },
    { key: "status",   title: i18n?.status    ?? "狀態",     width: statusColumnWidth  ?? "100px",     align: "center" },
    { key: "assignee", title: i18n?.assignee  ?? "負責人",   width: assigneeColumnWidth ?? "100px",    align: "center" },
    ...(showOperationsColumn
      ? [{ key: "operations", title: (operationsColumnLabel ?? i18n?.operations ?? "操作") as React.ReactNode, width: operationsColumnWidth ?? "120px", align: "center" as const }]
      : []),
  ];

  const resolvedColumns = columns ?? legacyColumns;

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

  const separator = (
    <div
      className={styles.ganttTable_HeaderSeparator}
      style={{ height: hPx * 0.5, marginTop: hPx * 0.25 }}
    />
  );

  /** 渲染单个普通列的标题内容 */
  const renderColTitle = (col: GanttColumnConfig): React.ReactNode => {
    if (col.renderTitle) return col.renderTitle();
    // 对已知列使用 columnHeaderRenderers 回退
    const legacyRenderer = columnHeaderRenderers?.[col.key as keyof NonNullable<typeof columnHeaderRenderers>];
    if (legacyRenderer) {
      const defaultLabel = String(col.title ?? col.key);
      const res = typeof legacyRenderer === "function"
        ? (legacyRenderer as (p: { defaultLabel: string }) => React.ReactNode)({ defaultLabel })
        : legacyRenderer;
      if (res != null) return res;
    }
    return <span>{col.title ?? col.key}</span>;
  };

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
        className={`${styles.ganttTable_Header} oa-task-list-header-row`}
        style={{
          height: hPx,
          ...(tableStyles?.headerBackgroundColor ? { backgroundColor: tableStyles.headerBackgroundColor } : {}),
        }}
      >
        {/* 系统列：多选框（不受 columns 控制） */}
        {rowSelection && (
          <React.Fragment>
            <div
              className={styles.ganttTable_HeaderItem}
              style={{
                minWidth: rowSelection.columnWidth || "50px",
                maxWidth: rowSelection.columnWidth || "50px",
                textAlign: "center",
                ...(tableStyles?.headerCellPadding ?? tableStyles?.cellPadding ? { padding: tableStyles?.headerCellPadding ?? tableStyles?.cellPadding } : {}),
                ...(tableStyles?.borderColor ? { borderRightColor: tableStyles.borderColor } : {}),
                ...(tableStyles?.headerTextColor ? { color: tableStyles.headerTextColor } : {}),
                ...(tableStyles?.headerCell || {}),
              }}
            >
              {rowSelection.showSelectAll !== false && onSelectAll ? (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                  <input
                    type="checkbox"
                    className={rowSelection.checkboxBorderColor ? styles.rowSelectionCheckbox : undefined}
                    checked={allSelected}
                    ref={(input) => { if (input) input.indeterminate = indeterminate ?? false; }}
                    onChange={(e) => onSelectAll(e.target.checked)}
                    style={{
                      cursor: "pointer",
                      ...(rowSelection.checkboxBorderColor
                        ? { ["--checkbox-border-color" as string]: rowSelection.checkboxBorderColor } as React.CSSProperties
                        : {}),
                    }}
                  />
                  {rowSelection.columnTitle != null && (() => {
                    const title = rowSelection.columnTitle!;
                    const content = typeof title === "function" ? title({ defaultLabel: "選擇" }) : title;
                    return typeof content === "string" ? <span>{content}</span> : content;
                  })()}
                </div>
              ) : (
                (() => {
                  const renderer = columnHeaderRenderers?.rowSelection;
                  if (renderer) {
                    const res = typeof renderer === "function" ? renderer({ defaultLabel: "選擇" }) : renderer;
                    if (res != null) return res;
                  }
                  const title = rowSelection.columnTitle;
                  const content = typeof title === "function" ? title({ defaultLabel: "選擇" }) : (title ?? "選擇");
                  return typeof content === "string" ? <span>{content}</span> : content;
                })()
              )}
            </div>
            {separator}
          </React.Fragment>
        )}

        {/* 系统列：未读（不受 columns 控制） */}
        {unreadColumn?.show && (
          <React.Fragment>
            <div
              className={`${styles.ganttTable_HeaderItem} ${styles.ganttTable_HeaderItem_unread}`}
              style={{
                minWidth: unreadColumn.width || "40px",
                maxWidth: unreadColumn.width || "40px",
                textAlign: "center",
                ...(tableStyles?.headerCellPadding ?? tableStyles?.cellPadding ? { padding: tableStyles?.headerCellPadding ?? tableStyles?.cellPadding } : {}),
                ...(tableStyles?.headerTextColor ? { color: tableStyles.headerTextColor } : {}),
                ...(tableStyles?.headerCell || {}),
              }}
            >
              {(() => {
                const custom = renderHeader("unread", unreadColumn.title || "未读");
                return typeof custom === "string" ? <span>{custom}</span> : custom;
              })()}
            </div>
            {separator}
          </React.Fragment>
        )}

        {/* 数据列（由 columns 驱动） */}
        {resolvedColumns.map((col, i) => (
          <React.Fragment key={col.key}>
            {i > 0 && separator}
            <div
              className={styles.ganttTable_HeaderItem}
              style={commonCellStyle(col)}
            >
              {col.key === "name" ? (
                // name 列：始终包含展开/折叠节点
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  {col.renderTitle ? col.renderTitle() : (() => {
                    const nameRenderer = columnHeaderRenderers?.name ?? taskTitleHeaderRender;
                    if (nameRenderer) {
                      const taskTitle = String(col.title ?? i18n?.taskTitle ?? "任務標題");
                      const content = typeof nameRenderer === "function"
                        ? columnHeaderRenderers?.name
                          ? (nameRenderer as (p: { expandCollapseNode: React.ReactNode; defaultLabel: string }) => React.ReactNode)({ expandCollapseNode, defaultLabel: taskTitle })
                          : taskTitleHeaderRender!({ expandCollapseNode, titleText: taskTitle })
                        : nameRenderer;
                      if (content) return <React.Fragment>{content}</React.Fragment>;
                    }
                    return (
                      <React.Fragment>
                        {expandCollapseNode}
                        <span>{col.title ?? i18n?.taskTitle ?? "任務標題"}</span>
                      </React.Fragment>
                    );
                  })()}
                </div>
              ) : (
                renderColTitle(col)
              )}
              {handle(col.key)}
            </div>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
