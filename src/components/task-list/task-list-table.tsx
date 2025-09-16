import React from "react";
import styles from "./task-list-table.module.css";
import { Task } from "../../types/public-types";

// 统一显示为 YYYY/M/D，例如 2025/8/25
const formatYmd = (date: Date) => {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return `${y}/${m}/${d}`;
};

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: Task[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: Task) => void;
  nameColumnWidth?: string;
  timeColumnWidths?: {
    plannedStart?: string;
    plannedEnd?: string;
    actualStart?: string;
    actualEnd?: string;
  };
  timeColumnLabels?: {
    plannedStart?: string;
    plannedEnd?: string;
    actualStart?: string;
    actualEnd?: string;
  };
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  fontFamily,
  fontSize,
  // locale,
  onExpanderClick,
  nameColumnWidth,
  timeColumnWidths,
}) => {
  // const toLocaleDateString = useMemo(
  //   () => toLocaleDateStringFactory(locale),
  //   [locale]
  // );

  return (
    <div
      className={styles.taskListWrapper}
      style={{
        fontFamily: fontFamily,
        fontSize: fontSize,
      }}
    >
      {tasks.map(t => {
        let expanderSymbol = "";
        if (t.hideChildren === false) {
          expanderSymbol = "▼";
        } else if (t.hideChildren === true) {
          expanderSymbol = "▶";
        }

        return (
          <div
            className={styles.taskListTableRow}
            style={{ height: rowHeight }}
            key={`${t.id}row`}
          >
            <div
              className={styles.taskListCell}
              style={{
                minWidth: nameColumnWidth ?? rowWidth,
                maxWidth: nameColumnWidth ?? rowWidth,
              }}
              title={t.name}
            >
              <div className={styles.taskListNameWrapper}>
                <div
                  className={
                    expanderSymbol
                      ? styles.taskListExpander
                      : styles.taskListEmptyExpander
                  }
                  onClick={() => onExpanderClick(t)}
                >
                  {expanderSymbol}
                </div>
                <div>{t.name}</div>
              </div>
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: timeColumnWidths?.plannedStart ?? rowWidth,
                maxWidth: timeColumnWidths?.plannedStart ?? rowWidth,
              }}
            >
              &nbsp;{formatYmd(t.plannedStart ?? t.start)}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: timeColumnWidths?.plannedEnd ?? rowWidth,
                maxWidth: timeColumnWidths?.plannedEnd ?? rowWidth,
              }}
            >
              &nbsp;{formatYmd(t.plannedEnd ?? t.end)}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: timeColumnWidths?.actualStart ?? rowWidth,
                maxWidth: timeColumnWidths?.actualStart ?? rowWidth,
              }}
            >
              &nbsp;{formatYmd(t.actualStart ?? t.start)}
            </div>
            <div
              className={styles.taskListCell}
              style={{
                minWidth: timeColumnWidths?.actualEnd ?? rowWidth,
                maxWidth: timeColumnWidths?.actualEnd ?? rowWidth,
              }}
            >
              &nbsp;{formatYmd(t.actualEnd ?? t.end)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
