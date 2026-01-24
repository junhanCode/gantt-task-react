import React, { useEffect, useRef, useState } from "react";
import { BarTask } from "../../types/bar-task";
import { GanttContentMoveAction } from "../../types/gantt-task-actions";
import { Bar } from "./bar/bar";
import { BarSmall } from "./bar/bar-small";
import { Milestone } from "./milestone/milestone";
import { Project } from "./project/project";
import style from "./task-list.module.css";

export type TaskItemProps = {
  task: BarTask;
  arrowIndent: number;
  taskHeight: number;
  isProgressChangeable: boolean;
  isDateChangeable: boolean;
  isDelete: boolean;
  isSelected: boolean;
  rtl: boolean;
  viewType?: "default" | "oaTask";
  enableTaskDrag?: boolean;
  enableTaskResize?: boolean;
  isTaskDraggable?: (task: BarTask, action?: 'move' | 'start' | 'end' | 'actualStart' | 'actualEnd' | 'progress') => boolean;
  onEventStart: (
    action: GanttContentMoveAction,
    selectedTask: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => any;
};

export const TaskItem: React.FC<TaskItemProps> = props => {
  const {
    task,
    arrowIndent,
    isDelete,
    taskHeight,
    isSelected,
    rtl,
    onEventStart,
  } = {
    ...props,
  };
  const textRef = useRef<SVGTextElement>(null);
  const [taskItem, setTaskItem] = useState<JSX.Element>(<div />);
  const [isTextInside, setIsTextInside] = useState(true);
  const [isTextOverflow, setIsTextOverflow] = useState(false);

  useEffect(() => {
    // oaTask模式下，所有任务类型都使用Bar组件（单条显示）
    if (props.viewType === "oaTask") {
      setTaskItem(<Bar {...props} viewType={props.viewType} />);
      return;
    }
    
    switch (task.typeInternal) {
      case "milestone":
        setTaskItem(<Milestone {...props} />);
        break;
      case "project":
        setTaskItem(<Project {...props} />);
        break;
      case "smalltask":
        setTaskItem(<BarSmall {...props} />);
        break;
      default:
        setTaskItem(<Bar {...props} viewType={props.viewType} />);
        break;
    }
  }, [task, isSelected, props.viewType]);

  useEffect(() => {
    if (textRef.current) {
      const textWidth = textRef.current.getBBox().width;
      const barWidth = task.x2 - task.x1;
      setIsTextInside(textWidth < barWidth);
      setIsTextOverflow(textWidth > barWidth);
    }
  }, [textRef, task]);

  const getX = () => {
    const width = task.x2 - task.x1;
    const hasChild = task.barChildren.length > 0;
    if (isTextInside) {
      return task.x1 + width * 0.5;
    }
    if (rtl && textRef.current) {
      return (
        task.x1 -
        textRef.current.getBBox().width -
        arrowIndent * +hasChild -
        arrowIndent * 0.2
      );
    } else {
      return task.x1 + width + arrowIndent * +hasChild + arrowIndent * 0.2;
    }
  };

  return (
    <g
      onKeyDown={e => {
        switch (e.key) {
          case "Delete": {
            if (isDelete) onEventStart("delete", task, e);
            break;
          }
        }
        e.stopPropagation();
      }}
      onMouseEnter={e => {
        onEventStart("mouseenter", task, e);
      }}
      onMouseLeave={e => {
        onEventStart("mouseleave", task, e);
      }}
      onDoubleClick={e => {
        onEventStart("dblclick", task, e);
      }}
      onClick={e => {
        onEventStart("click", task, e);
      }}
      onFocus={() => {
        onEventStart("select", task);
      }}
    >
      {taskItem}
      {/* 当文本在条形图内时，如果溢出则添加tooltip */}
      {isTextInside ? (
        <g>
          <text
            x={getX()}
            y={task.y + taskHeight * 0.5}
            className={style.barLabel}
            ref={textRef}
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {task.name}
          </text>
          {/* SVG tooltip - 当文本溢出时显示完整名称 */}
          {isTextOverflow && <title>{task.name}</title>}
        </g>
      ) : (
        <text
          x={getX()}
          y={task.y + taskHeight * 0.5}
          className={style.barLabel && style.barLabelOutside}
          ref={textRef}
        >
          {task.name}
        </text>
      )}
    </g>
  );
};
