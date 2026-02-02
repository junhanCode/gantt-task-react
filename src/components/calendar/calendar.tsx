import React, { ReactChild } from "react";
import { ViewMode, ViewType, OATaskViewMode } from "../../types/public-types";
import { TopPartOfCalendar } from "./top-part-of-calendar";
import {
  getCachedDateTimeFormat,
  getDaysInMonth,
  getLocalDayOfWeek,
  getLocaleMonth,
  getWeekNumberISO8601,
} from "../../helpers/date-helper";
import { DateSetup } from "../../types/date-setup";
import styles from "./calendar.module.css";

export type CalendarProps = {
  dateSetup: DateSetup;
  locale: string;
  viewMode: ViewMode;
  rtl: boolean;
  headerHeight: number;
  columnWidth: number;
  fontFamily: string;
  fontSize: string;
  viewType?: ViewType;
  oaTaskViewMode?: OATaskViewMode;
};

export const Calendar: React.FC<CalendarProps> = ({
  dateSetup,
  locale,
  viewMode,
  rtl,
  headerHeight,
  columnWidth,
  fontFamily,
  fontSize,
  viewType = "default",
  oaTaskViewMode = "日",
}) => {
  // 获取当前时间（用于绘制当前时间轴）
  const getCurrentTimeX = () => {
    const now = new Date();
    const dates = dateSetup.dates;
    if (!dates || dates.length < 2) return -1;
    
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
  const getCalendarValuesForYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const bottomValue = date.getFullYear();
      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (
        i === 0 ||
        date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getFullYear() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getFullYear()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={headerHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForQuarterYear = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      // const bottomValue = getLocaleMonth(date, locale);
      const quarter = "Q" + Math.floor((date.getMonth() + 3) / 3);
      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {quarter}
        </text>
      );
      if (
        i === 0 ||
        date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getMonth() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getMonth()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={Math.abs(xText)}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForMonth = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    for (let i = 0; i < dateSetup.dates.length; i++) {
      const date = dateSetup.dates[i];
      const bottomValue = getLocaleMonth(date, locale);
      bottomValues.push(
        <text
          key={bottomValue + date.getFullYear()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (
        i === 0 ||
        date.getFullYear() !== dateSetup.dates[i - 1].getFullYear()
      ) {
        const topValue = date.getFullYear().toString();
        let xText: number;
        if (rtl) {
          xText = (6 + i + date.getMonth() + 1) * columnWidth;
        } else {
          xText = (6 + i - date.getMonth()) * columnWidth;
        }
        topValues.push(
          <TopPartOfCalendar
            key={topValue}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={xText}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForWeek = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    let weeksCount: number = 1;
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = dates.length - 1; i >= 0; i--) {
      const date = dates[i];
      let topValue = "";
      if (i === 0 || date.getMonth() !== dates[i - 1].getMonth()) {
        // top
        topValue = `${getLocaleMonth(date, locale)}, ${date.getFullYear()}`;
      }
      // bottom
      const bottomValue = `W${getWeekNumberISO8601(date)}`;

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );

      if (topValue) {
        // if last day is new month
        if (i !== dates.length - 1) {
          topValues.push(
            <TopPartOfCalendar
              key={topValue}
              value={topValue}
              x1Line={columnWidth * i + weeksCount * columnWidth}
              y1Line={0}
              y2Line={topDefaultHeight}
              xText={columnWidth * i + columnWidth * weeksCount * 0.5}
              yText={topDefaultHeight * 0.9}
            />
          );
        }
        weeksCount = 0;
      }
      weeksCount++;
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = `${getLocalDayOfWeek(date, locale, "short")}, ${date
        .getDate()
        .toString()}`;

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * i + columnWidth * 0.5}
          className={styles.calendarBottomText}
        >
          {bottomValue}
        </text>
      );
      if (
        i + 1 !== dates.length &&
        date.getMonth() !== dates[i + 1].getMonth()
      ) {
        const topValue = getLocaleMonth(date, locale);

        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={columnWidth * (i + 1)}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={
              columnWidth * (i + 1) -
              getDaysInMonth(date.getMonth(), date.getFullYear()) *
                columnWidth *
                0.5
            }
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }
    return [topValues, bottomValues];
  };

  const getCalendarValuesForPartOfDay = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const ticks = viewMode === ViewMode.HalfDay ? 2 : 4;
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: "numeric",
      }).format(date);

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>
      );
      if (i === 0 || date.getDate() !== dates[i - 1].getDate()) {
        const topValue = `${getLocalDayOfWeek(
          date,
          locale,
          "short"
        )}, ${date.getDate()} ${getLocaleMonth(date, locale)}`;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + date.getFullYear()}
            value={topValue}
            x1Line={columnWidth * i + ticks * columnWidth}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * i + ticks * columnWidth * 0.5}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  const getCalendarValuesForDayShift = () => {
    const bgValues: ReactChild[] = [];
    const textValues: ReactChild[] = [];
    const dates = dateSetup.dates;
    const topDefaultHeight = headerHeight / 3; // 三层：日期、星期、班次
    const totalWidth = columnWidth * dates.length;

    // 辅助：获取班次名
    const shiftName = (date: Date) => {
      const hour = date.getHours();
      if (hour % 24 === 0) return "D1"; // 00:00
      if (hour % 24 === 6) return "D2"; // 06:00
      if (hour % 24 === 12) return "N1"; // 12:00
      return "N2"; // 18:00
    };

    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const isNewDay = i === 0 || date.getDate() !== dates[i - 1].getDate();
      const isSunday = date.getDay() === 0;

      // 顶部：日期（年/月/日）
      if (isNewDay) {
        // 一个自然日占 4 列
        const daySpan = 4;
        const xStart = columnWidth * i;
        const xCenter = xStart + columnWidth * daySpan * 0.5;
        const topValue = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
        // 周日背景色（背景层）
        if (isSunday) {
          bgValues.push(
            <rect
              key={`sunbg-${date.getTime()}`}
              x={xStart}
              y={0}
              width={daySpan * columnWidth}
              height={headerHeight}
              className={styles.calendarSunBg}
            />
          );
        }
        textValues.push(
          <g key={`day-${date.toDateString()}`}>
            <TopPartOfCalendar
              value={topValue}
              x1Line={xStart + daySpan * columnWidth}
              y1Line={0}
              y2Line={headerHeight}
              xText={xCenter}
              yText={topDefaultHeight * 0.75}
            />
          </g>
        );

        // 中部：星期（Sun/Mon...），每天只显示一次，跨 4 列居中
        const midValue = getLocalDayOfWeek(date, locale, "short");
        textValues.push(
          <text
            key={`dow-day-${date.getTime()}`}
            y={topDefaultHeight + topDefaultHeight * 0.75}
            x={xCenter}
            className={styles.calendarTopText}
          >
            {midValue}
          </text>
        );
      }

      // 底部：班次 D1 D2 N1 N2
      const sName = shiftName(date);
      const isNight = sName === "N1" || sName === "N2";
      if (isNight) {
        bgValues.push(
          <rect
            key={`shiftbg-${date.getTime()}`}
            x={columnWidth * i}
            y={topDefaultHeight * 2}
            width={columnWidth}
            height={topDefaultHeight}
            className={styles.calendarShiftNightBg}
          />
        );
      }
      // 竖向：只在底部班次层绘制每列分隔线，避免中部（跨4列）出现四条边框
      bgValues.push(
        <line
          key={`vsep-bottom-${i}`}
          x1={columnWidth * i}
          y1={topDefaultHeight * 2}
          x2={columnWidth * i}
          y2={headerHeight}
          className={styles.calendarTopTick}
        />
      );
      // 每天开始处（每4列）绘制贯穿三层的竖线，形成中部合并单元的边界
      if (i % 4 === 0) {
        bgValues.push(
          <line
            key={`vsep-daystart-${i}`}
            x1={columnWidth * i}
            y1={0}
            x2={columnWidth * i}
            y2={headerHeight}
            className={styles.calendarTopTick}
          />
        );
      }
      textValues.push(
        <text
          key={`shifttext-${date.getTime()}`}
          y={topDefaultHeight * 2 + topDefaultHeight * 0.75}
          x={columnWidth * i + columnWidth * 0.5}
          className={isNight ? styles.calendarShiftNightText : styles.calendarBottomText}
        >
          {sName}
        </text>
      );
    }

    // 横向：三个表头行之间的分隔线（上/中、 中/下）
    bgValues.push(
      <line
        key="hsep-1"
        x1={0}
        y1={topDefaultHeight}
        x2={totalWidth}
        y2={topDefaultHeight}
        className={styles.calendarTopTick}
      />
    );
    bgValues.push(
      <line
        key="hsep-2"
        x1={0}
        y1={topDefaultHeight * 2}
        x2={totalWidth}
        y2={topDefaultHeight * 2}
        className={styles.calendarTopTick}
      />
    );

    // 返回顺序：文字层在上、背景层在下。组件最终渲染顺序是先 bottomValues 再 topValues
    // 因此此处将文字作为 topValues，背景作为 bottomValues 返回
    return [textValues, bgValues];
  };

  const getCalendarValuesForHour = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const topDefaultHeight = headerHeight * 0.5;
    const dates = dateSetup.dates;
    for (let i = 0; i < dates.length; i++) {
      const date = dates[i];
      const bottomValue = getCachedDateTimeFormat(locale, {
        hour: "numeric",
      }).format(date);

      bottomValues.push(
        <text
          key={date.getTime()}
          y={headerHeight * 0.8}
          x={columnWidth * (i + +rtl)}
          className={styles.calendarBottomText}
          fontFamily={fontFamily}
        >
          {bottomValue}
        </text>
      );
      if (i !== 0 && date.getDate() !== dates[i - 1].getDate()) {
        const displayDate = dates[i - 1];
        const topValue = `${getLocalDayOfWeek(
          displayDate,
          locale,
          "long"
        )}, ${displayDate.getDate()} ${getLocaleMonth(displayDate, locale)}`;
        const topPosition = (date.getHours() - 24) / 2;
        topValues.push(
          <TopPartOfCalendar
            key={topValue + displayDate.getFullYear()}
            value={topValue}
            x1Line={columnWidth * i}
            y1Line={0}
            y2Line={topDefaultHeight}
            xText={columnWidth * (i + topPosition)}
            yText={topDefaultHeight * 0.9}
          />
        );
      }
    }

    return [topValues, bottomValues];
  };

  // oaTask模式的时间轴渲染
  const getOATaskCalendarValues = () => {
    const topValues: ReactChild[] = [];
    const bottomValues: ReactChild[] = [];
    const bgValues: ReactChild[] = [];
    const dates = dateSetup.dates;
    const topDefaultHeight = headerHeight * 0.5;
    const totalWidth = columnWidth * dates.length;
    
    if (oaTaskViewMode === "日") {
      // 日模式：子母表头，母表头是第xx周，子表头是那周，周日为每周第一天，周日那条置灰色
      const weekMap = new Map<string, { weekNum: string; dates: Date[] }>();
      
      dates.forEach((date) => {
        // 获取周日（每周第一天）
        const dayOfWeek = date.getDay();
        const sunday = new Date(date);
        sunday.setDate(date.getDate() - dayOfWeek);
        
        const weekKey = `${sunday.getFullYear()}-W${getWeekNumberISO8601(sunday)}`;
        if (!weekMap.has(weekKey)) {
          weekMap.set(weekKey, { weekNum: getWeekNumberISO8601(sunday), dates: [] });
        }
        weekMap.get(weekKey)!.dates.push(date);
      });
      
      // 生成表头
      let currentWeekKey = "";
      dates.forEach((date, i) => {
        const dayOfWeek = date.getDay();
        const isSunday = dayOfWeek === 0;
        const sunday = new Date(date);
        sunday.setDate(date.getDate() - dayOfWeek);
        const weekKey = `${sunday.getFullYear()}-W${getWeekNumberISO8601(sunday)}`;
        
        // 子表头区域的竖向分隔线（每列都有，只在下半部分）
        bgValues.push(
          <line
            key={`vsep-bottom-${i}`}
            x1={columnWidth * i}
            y1={topDefaultHeight}
            x2={columnWidth * i}
            y2={headerHeight}
            className={styles.calendarTopTick}
          />
        );
        
        // 周日背景置灰色
        if (isSunday) {
          bgValues.push(
            <rect
              key={`sunbg-${date.getTime()}`}
              x={columnWidth * i}
              y={topDefaultHeight}
              width={columnWidth}
              height={topDefaultHeight}
              fill="#E6E6E6"
            />
          );
        }
        
        // 子表头：日期（垂直居中：子表头区域中心为 headerHeight * 0.75）
        const dayLabel = `${date.getDate()}`;
        bottomValues.push(
          <text
            key={`day-${date.getTime()}`}
            y={headerHeight * 0.75}
            x={columnWidth * i + columnWidth * 0.5}
            className={styles.calendarBottomTextVerticalCenter}
            fill={isSunday ? "#999" : "#000"}
          >
            {dayLabel}
          </text>
        );
        
        // 母表头：周数（每周第一天显示）
        if (weekKey !== currentWeekKey && isSunday) {
          currentWeekKey = weekKey;
          const weekNum = getWeekNumberISO8601(sunday);
          const weekDates = weekMap.get(weekKey)!.dates;
          const weekStartX = columnWidth * i;
          const weekEndX = columnWidth * (i + weekDates.length);
          const weekCenterX = (weekStartX + weekEndX) / 2;
          
          // 周开始处的分隔线
          bgValues.push(
            <line
              key={`vsep-top-start-${weekKey}`}
              x1={weekStartX}
              y1={0}
              x2={weekStartX}
              y2={topDefaultHeight}
              className={styles.calendarTopTick}
            />
          );
          
          topValues.push(
            <g key={`week-${weekKey}`}>
              <text
                y={topDefaultHeight * 0.7}
                x={weekCenterX}
                className={styles.calendarTopText}
              >
                第{weekNum}周
              </text>
            </g>
          );
        }
        
        // 周结束处的分隔线（在周的最后一天或下一个日期是不同周时绘制）
        const isLastDate = i === dates.length - 1;
        const isNextDateDifferentWeek = !isLastDate && dates[i + 1].getDay() === 0;
        if (isLastDate || isNextDateDifferentWeek) {
          const weekEndX = columnWidth * (i + 1);
          bgValues.push(
            <line
              key={`vsep-top-end-${weekKey}-${i}`}
              x1={weekEndX}
              y1={0}
              x2={weekEndX}
              y2={topDefaultHeight}
              className={styles.calendarTopTick}
            />
          );
        }
      });
      
      // 横向分隔线
      bgValues.push(
        <line
          key="hsep-day"
          x1={0}
          y1={topDefaultHeight}
          x2={totalWidth}
          y2={topDefaultHeight}
          className={styles.calendarTopTick}
        />
      );
    } else if (oaTaskViewMode === "月") {
      // 月模式：母表头是年份，子表头是英文的月
      const monthMap = new Map<string, { year: number; month: number; startIdx: number; endIdx: number }>();
      
      // 找出每个月的开始和结束位置
      dates.forEach((date, i) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthKey = `${year}-${month}`;
        
        if (!monthMap.has(monthKey)) {
          monthMap.set(monthKey, { year, month, startIdx: i, endIdx: i });
        } else {
          const monthInfo = monthMap.get(monthKey)!;
          monthInfo.endIdx = i;
        }
      });
      
      // 找出每年的开始和结束位置
      const yearMap = new Map<number, { startIdx: number; endIdx: number }>();
      dates.forEach((date, i) => {
        const year = date.getFullYear();
        if (!yearMap.has(year)) {
          yearMap.set(year, { startIdx: i, endIdx: i });
        } else {
          const yearInfo = yearMap.get(year)!;
          yearInfo.endIdx = i;
        }
      });
      
      // 生成表头
      dates.forEach((date, i) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const monthKey = `${year}-${month}`;
        const monthInfo = monthMap.get(monthKey)!;
        const isMonthStart = i === monthInfo.startIdx;
        const isYearStart = i === yearMap.get(year)!.startIdx;
        
        // 子表头区域的竖向分隔线（每列都有，只在下半部分）
        bgValues.push(
          <line
            key={`vsep-bottom-${i}`}
            x1={columnWidth * i}
            y1={topDefaultHeight}
            x2={columnWidth * i}
            y2={headerHeight}
            className={styles.calendarTopTick}
          />
        );
        
        // 母表头区域的竖向分隔线（只在年份边界处）
        if (isYearStart) {
          const yearInfo = yearMap.get(year)!;
          const yearStartX = columnWidth * yearInfo.startIdx;
          // 年份开始处的分隔线
          bgValues.push(
            <line
              key={`vsep-top-start-${year}`}
              x1={yearStartX}
              y1={0}
              x2={yearStartX}
              y2={topDefaultHeight}
              className={styles.calendarTopTick}
            />
          );
        }
        // 年份结束处的分隔线（在年份最后一个日期或下一个日期是不同年份时绘制）
        const isYearEnd = i === dates.length - 1 || (i < dates.length - 1 && dates[i + 1].getFullYear() !== year);
        if (isYearEnd) {
          const yearInfo = yearMap.get(year)!;
          const yearEndX = columnWidth * (yearInfo.endIdx + 1);
          bgValues.push(
            <line
              key={`vsep-top-end-${year}-${i}`}
              x1={yearEndX}
              y1={0}
              x2={yearEndX}
              y2={topDefaultHeight}
              className={styles.calendarTopTick}
            />
          );
        }
        
        // 子表头：英文月份（每个月的第一天显示，垂直居中）
        if (isMonthStart) {
          const monthLabel = getLocaleMonth(date, locale);
          const monthSpan = monthInfo.endIdx - monthInfo.startIdx + 1;
          const monthCenterX = columnWidth * monthInfo.startIdx + (columnWidth * monthSpan) / 2;
          bottomValues.push(
            <text
              key={`month-${monthKey}`}
              y={headerHeight * 0.75}
              x={monthCenterX}
              className={styles.calendarBottomTextVerticalCenter}
            >
              {monthLabel}
            </text>
          );
        }
        
        // 母表头：年份（每年的第一个月显示，垂直居中）
        if (isYearStart) {
          const yearInfo = yearMap.get(year)!;
          const yearStartX = columnWidth * yearInfo.startIdx;
          const yearEndX = columnWidth * (yearInfo.endIdx + 1);
          const yearCenterX = (yearStartX + yearEndX) / 2;
          const yearLabel = `${year}`;
          
          topValues.push(
            <g key={`year-${year}`}>
              <TopPartOfCalendar
                value={yearLabel}
                x1Line={yearStartX}
                y1Line={0}
                y2Line={topDefaultHeight}
                xText={yearCenterX}
                yText={topDefaultHeight * 0.5}
                verticalCenter
              />
            </g>
          );
        }
      });
      
      // 横向分隔线（母表头和子表头之间的分隔线）
      bgValues.push(
        <line
          key="hsep-month"
          x1={0}
          y1={topDefaultHeight}
          x2={totalWidth}
          y2={topDefaultHeight}
          className={styles.calendarTopTick}
        />
      );
    } else if (oaTaskViewMode === "季") {
      // 季模式：母表头是年份，子表头是Q1-Q4
      const quarterMap = new Map<string, { year: number; quarter: number; startIdx: number; endIdx: number }>();
      
      // 找出每个季度的开始和结束位置
      dates.forEach((date, i) => {
        const year = date.getFullYear();
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        const quarterKey = `${year}-Q${quarter}`;
        
        if (!quarterMap.has(quarterKey)) {
          quarterMap.set(quarterKey, { year, quarter, startIdx: i, endIdx: i });
        } else {
          const quarterInfo = quarterMap.get(quarterKey)!;
          quarterInfo.endIdx = i;
        }
      });
      
      // 找出每年的开始和结束位置
      const yearMap = new Map<number, { startIdx: number; endIdx: number }>();
      dates.forEach((date, i) => {
        const year = date.getFullYear();
        if (!yearMap.has(year)) {
          yearMap.set(year, { startIdx: i, endIdx: i });
        } else {
          const yearInfo = yearMap.get(year)!;
          yearInfo.endIdx = i;
        }
      });
      
      // 生成表头
      dates.forEach((date, i) => {
        const year = date.getFullYear();
        const quarter = Math.floor(date.getMonth() / 3) + 1;
        const quarterKey = `${year}-Q${quarter}`;
        const quarterInfo = quarterMap.get(quarterKey)!;
        const isQuarterStart = i === quarterInfo.startIdx;
        const isYearStart = i === yearMap.get(year)!.startIdx;
        
        // 子表头区域的竖向分隔线（每列都有，只在下半部分）
        bgValues.push(
          <line
            key={`vsep-bottom-${i}`}
            x1={columnWidth * i}
            y1={topDefaultHeight}
            x2={columnWidth * i}
            y2={headerHeight}
            className={styles.calendarTopTick}
          />
        );
        
        // 母表头区域的竖向分隔线（只在年份边界处）
        if (isYearStart) {
          const yearInfo = yearMap.get(year)!;
          const yearStartX = columnWidth * yearInfo.startIdx;
          // 年份开始处的分隔线
          bgValues.push(
            <line
              key={`vsep-top-start-${year}`}
              x1={yearStartX}
              y1={0}
              x2={yearStartX}
              y2={topDefaultHeight}
              className={styles.calendarTopTick}
            />
          );
        }
        // 年份结束处的分隔线（在年份最后一个日期或下一个日期是不同年份时绘制）
        const isYearEnd = i === dates.length - 1 || (i < dates.length - 1 && dates[i + 1].getFullYear() !== year);
        if (isYearEnd) {
          const yearInfo = yearMap.get(year)!;
          const yearEndX = columnWidth * (yearInfo.endIdx + 1);
          bgValues.push(
            <line
              key={`vsep-top-end-${year}-${i}`}
              x1={yearEndX}
              y1={0}
              x2={yearEndX}
              y2={topDefaultHeight}
              className={styles.calendarTopTick}
            />
          );
        }
        
        // 子表头：季度（每个季度的第一天显示，垂直居中）
        if (isQuarterStart) {
          const quarterLabel = `Q${quarter}`;
          const quarterSpan = quarterInfo.endIdx - quarterInfo.startIdx + 1;
          const quarterCenterX = columnWidth * quarterInfo.startIdx + (columnWidth * quarterSpan) / 2;
          bottomValues.push(
            <text
              key={`quarter-${quarterKey}`}
              y={headerHeight * 0.75}
              x={quarterCenterX}
              className={styles.calendarBottomTextVerticalCenter}
            >
              {quarterLabel}
            </text>
          );
        }
        
        // 母表头：年份（每年的第一个季度显示，垂直居中）
        if (isYearStart) {
          const yearInfo = yearMap.get(year)!;
          const yearStartX = columnWidth * yearInfo.startIdx;
          const yearEndX = columnWidth * (yearInfo.endIdx + 1);
          const yearCenterX = (yearStartX + yearEndX) / 2;
          const yearLabel = `${year}`;
          
          topValues.push(
            <g key={`year-${year}`}>
              <TopPartOfCalendar
                value={yearLabel}
                x1Line={yearStartX}
                y1Line={0}
                y2Line={topDefaultHeight}
                xText={yearCenterX}
                yText={topDefaultHeight * 0.5}
                verticalCenter
              />
            </g>
          );
        }
      });
      
      // 横向分隔线（母表头和子表头之间的分隔线）
      bgValues.push(
        <line
          key="hsep-quarter"
          x1={0}
          y1={topDefaultHeight}
          x2={totalWidth}
          y2={topDefaultHeight}
          className={styles.calendarTopTick}
        />
      );
    }
    
    // 返回顺序：文字层在上、背景层在下
    // 将bgValues和bottomValues合并，因为Calendar组件期望的是[topValues, bottomValues]
    return [topValues, [...bgValues, ...bottomValues]];
  };

  let topValues: ReactChild[] = [];
  let bottomValues: ReactChild[] = [];
  
  if (viewType === "oaTask") {
    [topValues, bottomValues] = getOATaskCalendarValues();
  } else {
    switch (dateSetup.viewMode) {
      case ViewMode.Year:
        [topValues, bottomValues] = getCalendarValuesForYear();
        break;
      case ViewMode.QuarterYear:
        [topValues, bottomValues] = getCalendarValuesForQuarterYear();
        break;
      case ViewMode.Month:
        [topValues, bottomValues] = getCalendarValuesForMonth();
        break;
      case ViewMode.Week:
        [topValues, bottomValues] = getCalendarValuesForWeek();
        break;
      case ViewMode.Day:
        [topValues, bottomValues] = getCalendarValuesForDay();
        break;
      case ViewMode.QuarterDay:
      case ViewMode.HalfDay:
        [topValues, bottomValues] = getCalendarValuesForPartOfDay();
        break;
      case ViewMode.DayShift:
        [topValues, bottomValues] = getCalendarValuesForDayShift();
        break;
      case ViewMode.Hour:
        [topValues, bottomValues] = getCalendarValuesForHour();
    }
  }
  
  return (
    <g className="calendar" fontSize={fontSize} fontFamily={fontFamily}>
      <rect
        x={0}
        y={0}
        width={columnWidth * dateSetup.dates.length}
        height={headerHeight}
        className={styles.calendarHeader}
      />
      {bottomValues} {topValues}
      {/* 当前时间轴（oaTask模式） */}
      {viewType === "oaTask" && currentTimeX >= 0 && (
        <line
          x1={currentTimeX}
          y1={0}
          x2={currentTimeX}
          y2={headerHeight}
          stroke="#FFB592"
          strokeWidth={2}
        />
      )}
    </g>
  );
};
