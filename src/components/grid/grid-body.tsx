import React, { ReactChild } from "react";
import { Task } from "../../types/public-types";
import styles from "./grid.module.css";

export type GridBodyProps = {
  tasks: Task[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  rtl: boolean;
};

export type TodayOverlayProps = {
  dates: Date[];
  columnWidth: number;
  totalHeight: number;
};

export const TodayOverlay: React.FC<TodayOverlayProps> = ({
  dates,
  columnWidth,
  totalHeight,
}) => {
  const now = new Date();

  if (!dates || dates.length < 2) return null;

  const idx = dates.findIndex(
    (d, i) =>
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
        strokeWidth={1}
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
}) => {
  let y = 0;
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
  for (const task of tasks) {
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

  let tickX = 0;
  const ticks: ReactChild[] = [];
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    ticks.push(
      <line
        key={date.getTime()}
        x1={tickX}
        y1={0}
        x2={tickX}
        y2={y}
        className={styles.gridTick}
      />
    );
    tickX += columnWidth;
  }
  return (
    <g className="gridBody">
      <g className="rows">{gridRows}</g>
      <g className="rowLines">{rowLines}</g>
      <g className="ticks">{ticks}</g>
      <g className="today"><rect /></g>
    </g>
  );
};
