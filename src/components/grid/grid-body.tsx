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
  rtl: boolean;
  viewType?: ViewType;
  scrollY?: number;
  containerHeight?: number;
};
export const GridBody: React.FC<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  todayColor,
  rtl,
  viewType = "default",
  scrollY = 0,
  containerHeight,
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
    gridRows.push(
      <rect
        key={"Row" + task.id}
        x="0"
        y={y}
        width={svgWidth}
        height={rowHeight}
        className={styles.gridRow}
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
  let today: ReactChild = <rect />;
  let currentTimeLine: ReactChild = <line />;
  
  // 计算当前时间轴位置（oaTask模式）
  const getCurrentTimeX = () => {
    if (viewType !== "oaTask" || !dates || dates.length < 2) return -1;
    
    const idx = dates.findIndex((d, i) => 
      now.valueOf() >= d.valueOf() && 
      i + 1 < dates.length && 
      now.valueOf() < dates[i + 1].valueOf()
    );
    
    if (idx < 0) return -1;
    
    const start = dates[idx].valueOf();
    const end = dates[idx + 1].valueOf();
    const ratio = (now.valueOf() - start) / (end - start);
    return (idx + ratio) * columnWidth;
  };
  
  const currentTimeX = getCurrentTimeX();
  const totalHeight = tasks.length * rowHeight;
  
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
      />
    );
    if (
      (i + 1 !== dates.length &&
        date.getTime() < now.getTime() &&
        dates[i + 1].getTime() >= now.getTime()) ||
      // if current date is last
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
        <rect
          x={tickX}
          y={0}
          width={columnWidth}
          height={totalHeight}
          fill={todayColor}
        />
      );
    }
    // rtl for today
    if (
      rtl &&
      i + 1 !== dates.length &&
      date.getTime() >= now.getTime() &&
      dates[i + 1].getTime() < now.getTime()
    ) {
      today = (
        <rect
          x={tickX + columnWidth}
          y={0}
          width={columnWidth}
          height={totalHeight}
          fill={todayColor}
        />
      );
    }
    tickX += columnWidth;
  }
  // oaTask模式的当前时间轴
  if (viewType === "oaTask" && currentTimeX >= 0) {
    currentTimeLine = (
      <line
        key="currentTimeLine"
        x1={currentTimeX}
        y1={0}
        x2={currentTimeX}
        y2={totalHeight}
        stroke="#FFB592"
        strokeWidth={2}
      />
    );
  }
  
  return (
    <g className="gridBody">
      <g className="rows">{gridRows}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="ticks">{ticks}</g>
      <g className="today">{today}</g>
      {viewType === "oaTask" && <g className="currentTimeLine">{currentTimeLine}</g>}
    </g>
  );
};
