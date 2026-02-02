import React from "react";
import styles from "./calendar.module.css";

type TopPartOfCalendarProps = {
  value: string;
  x1Line: number;
  y1Line: number;
  y2Line: number;
  xText: number;
  yText: number;
  /** 是否垂直居中（yText 为区域中心时使用） */
  verticalCenter?: boolean;
};

export const TopPartOfCalendar: React.FC<TopPartOfCalendarProps> = ({
  value,
  x1Line,
  y1Line,
  y2Line,
  xText,
  yText,
  verticalCenter = false,
}) => {
  return (
    <g className="calendarTop">
      <line
        x1={x1Line}
        y1={y1Line}
        x2={x1Line}
        y2={y2Line}
        className={styles.calendarTopTick}
        key={value + "line"}
      />
      <text
        key={value + "text"}
        y={yText}
        x={xText}
        className={verticalCenter ? styles.calendarTopTextVerticalCenter : styles.calendarTopText}
        {...(verticalCenter && { dominantBaseline: "middle" })}
      >
        {value}
      </text>
    </g>
  );
};
