import React, { ReactChild, useMemo } from "react";
import { Task, ViewType } from "../../types/public-types";
import { addToDate } from "../../helpers/date-helper";
import { getVirtualRange, shouldUseVirtualScroll } from "../../helpers/virtual-scroll-helper";
import styles from "./grid.module.css";

export type GridBodyProps = {
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  todayLineWidth?: number;
  rtl: boolean;
  viewType?: ViewType;
  scrollY?: number;
  containerHeight?: number;
  gridBorderWidth?: number;
  gridBorderColor?: string;
  /** 双击某行空白区域时触发，参数为该行对应的任务 */
  onRowClick?: (task: Task) => void;
};

export type TodayOverlayProps = {
  dates: Date[];
  columnWidth: number;
  todayLineWidth?: number;
  viewType?: ViewType;
  totalHeight: number;
};

export const TodayOverlay: React.FC<TodayOverlayProps> = ({
  dates,
  columnWidth,
  todayLineWidth = 1,
  viewType = "default",
  totalHeight,
}) => {
  const now = new Date();

  if (viewType !== "oaTask" || !dates || dates.length < 2) return null;

  const idx = dates.findIndex((d, i) =>
    now.valueOf() >= d.valueOf() &&
    i + 1 < dates.length &&
    now.valueOf() < dates[i + 1].valueOf()
  );
  if (idx < 0) return null;

  const start = dates[idx].valueOf();
  const end = dates[idx + 1].valueOf();
  const ratio = (now.valueOf() - start) / (end - start);
  const currentTimeX = (idx + ratio) * columnWidth;

  return (
    <g className="currentTimeLineOverlay" style={{ pointerEvents: "none" }}>
      <line
        x1={currentTimeX}
        y1={0}
        x2={currentTimeX}
        y2={totalHeight}
        stroke="#FFB592"
        strokeWidth={todayLineWidth}
      />
    </g>
  );
};
export const GridBody: React.FC<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  todayColor,
  rtl,
  scrollY = 0,
  containerHeight,
  gridBorderWidth = 1,
  gridBorderColor = "#e6e4e4",
  onRowClick,
}) => {
  const useVirtual = shouldUseVirtualScroll(tasks.length) && !!containerHeight && containerHeight > 0;
  const virtualRange = useMemo(() => {
    if (!useVirtual) return null;
    return getVirtualRange(scrollY, containerHeight ?? 0, rowHeight, tasks.length);
  }, [useVirtual, scrollY, containerHeight, rowHeight, tasks.length]);

  const [startIdx, endIdx] = useMemo(() => {
    if (!virtualRange) return [0, tasks.length - 1];
    return [virtualRange.startIndex, virtualRange.endIndex];
  }, [virtualRange, tasks.length]);

  let y = startIdx * rowHeight;
  const gridRows: ReactChild[] = [];
  const rowLines: ReactChild[] = [
    <line
      key="RowLineFirst"
      x="0"
      y1={0}
      x2={svgWidth}
      y2={0}
      className={styles.gridRowLine}
    />,
  ];
  for (let i = startIdx; i <= endIdx; i++) {
    const task = tasks[i];
    const isChildTask = !!task.project;
    gridRows.push(
      <rect
        key={"Row" + task.id}
        x="0"
        y={y}
        width={svgWidth}
        height={rowHeight}
        className={isChildTask ? styles.gridRowChild : styles.gridRow}
        onDoubleClick={onRowClick ? () => onRowClick(task) : undefined}
        style={onRowClick ? { cursor: "pointer" } : undefined}
      />
    );
    rowLines.push(
      <line
        key={"RowLine" + task.id}
        x="0"
        y1={y + rowHeight}
        x2={svgWidth}
        y2={y + rowHeight}
        className={styles.gridRowLine}
      />
    );
    y += rowHeight;
  }

  const now = new Date();
  let tickX = 0;
  const ticks: ReactChild[] = [];
  const totalHeight = tasks.length * rowHeight;
  let today: ReactChild = <rect />;

  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    ticks.push(
      <line
        key={date.getTime()}
        x1={tickX}
        y1={0}
        x2={tickX}
        y2={totalHeight}
        className={styles.gridTick}
        stroke={gridBorderColor}
        strokeWidth={gridBorderWidth}
      />
    );
    if (
      (i + 1 !== dates.length &&
        date.getTime() < now.getTime() &&
        dates[i + 1].getTime() >= now.getTime()) ||
      (i !== 0 &&
        i + 1 === dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(
          date,
          date.getTime() - dates[i - 1].getTime(),
          "millisecond"
        ).getTime() >= now.getTime())
    ) {
      today = (
        <rect x={tickX} y={0} width={columnWidth} height={totalHeight} fill={todayColor} />
      );
    }
    if (
      rtl &&
      i + 1 !== dates.length &&
      date.getTime() >= now.getTime() &&
      dates[i + 1].getTime() < now.getTime()
    ) {
      today = (
        <rect x={tickX + columnWidth} y={0} width={columnWidth} height={totalHeight} fill={todayColor} />
      );
    }
    tickX += columnWidth;
  }

  return (
    <g className="gridBody">
      <g className="rows">{gridRows}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="ticks">{ticks}</g>
      <g className="today">{today}</g>
    </g>
  );
};
