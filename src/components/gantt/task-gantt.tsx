import React, { useRef, useEffect } from "react";
import { GridProps, Grid } from "../grid/grid";
import { CalendarProps, Calendar } from "../calendar/calendar";
import { TaskGanttContentProps, TaskGanttContent } from "./task-gantt-content";
import { GanttEvent } from "../../types/gantt-task-actions";
import styles from "./gantt.module.css";

type DragIndicator = { x: number; label: string };

const getDragIndicators = (ganttEvent: GanttEvent | undefined): DragIndicator[] => {
  if (!ganttEvent?.changedTask) return [];
  const { action, changedTask } = ganttEvent;
  const fmt = (d: Date) => `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;

  switch (action) {
    case "end": {
      const d = changedTask.plannedEnd || changedTask.end;
      return [{ x: changedTask.x2, label: fmt(d) }];
    }
    case "start": {
      const d = changedTask.plannedStart || changedTask.start;
      return [{ x: changedTask.x1, label: fmt(d) }];
    }
    case "actualEnd":
      return changedTask.actualEnd
        ? [{ x: changedTask.actualX2, label: fmt(changedTask.actualEnd) }]
        : [];
    case "actualStart":
      return changedTask.actualStart
        ? [{ x: changedTask.actualX1, label: fmt(changedTask.actualStart) }]
        : [];
    case "move": {
      const s = changedTask.plannedStart || changedTask.start;
      const e = changedTask.plannedEnd || changedTask.end;
      return [
        { x: changedTask.x1, label: fmt(s) },
        { x: changedTask.x2, label: fmt(e) },
      ];
    }
    default:
      return [];
  }
};

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
  scrollY: number;
  scrollX: number;
  ganttEvent?: GanttEvent;
};
export const TaskGantt: React.FC<TaskGanttProps> = ({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight,
  scrollY,
  scrollX,
  ganttEvent,
}) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
  const newBarProps = { ...barProps, svg: ganttSVGRef };

  const dragIndicators = getDragIndicators(ganttEvent);
  const headerHeight = calendarProps.headerHeight;
  const svgWidth = gridProps.svgWidth;
  const gridHeight = barProps.rowHeight * barProps.tasks.length;
  const BADGE_W = 82;
  const BADGE_H = 22;

  useEffect(() => {
    if (horizontalContainerRef.current && horizontalContainerRef.current.scrollTop !== scrollY) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  useEffect(() => {
    if (verticalGanttContainerRef.current && verticalGanttContainerRef.current.scrollLeft !== scrollX) {
      verticalGanttContainerRef.current.scrollLeft = scrollX;
    }
  }, [scrollX]);

  return (
    <div
      className={styles.ganttVerticalContainer}
      ref={verticalGanttContainerRef}
      dir="ltr"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={svgWidth}
        height={headerHeight}
        fontFamily={barProps.fontFamily}
      >
        <Calendar {...calendarProps} />
      </svg>
      <div
        ref={horizontalContainerRef}
        className={styles.horizontalContainer}
        style={
          ganttHeight
            ? { height: ganttHeight, width: svgWidth }
            : { width: svgWidth }
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={svgWidth}
          height={gridHeight}
          fontFamily={barProps.fontFamily}
          ref={ganttSVGRef}
        >
          <Grid {...gridProps} />
          <TaskGanttContent {...newBarProps} />
          {dragIndicators.map((ind, i) => {
            const bx = Math.max(BADGE_W / 2, Math.min(svgWidth - BADGE_W / 2, ind.x));
            return (
              <g key={i} style={{ pointerEvents: "none" }}>
                <line
                  x1={ind.x} y1={0} x2={ind.x} y2={gridHeight}
                  stroke="#4a90e2" strokeWidth={1} strokeDasharray="5,3"
                  opacity={0.35}
                />
                <rect
                  x={bx - BADGE_W / 2}
                  y={4}
                  width={BADGE_W} height={BADGE_H} rx={BADGE_H / 2}
                  fill="#4a90e2"
                />
                <text
                  x={bx} y={4 + BADGE_H / 2}
                  textAnchor="middle" dominantBaseline="middle"
                  fill="white" fontSize="11" fontWeight="600"
                  fontFamily={barProps.fontFamily}
                >
                  {ind.label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
