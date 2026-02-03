import React, { useEffect, useMemo, useState } from "react";
import { EventOption } from "../../types/public-types";
import { BarTask } from "../../types/bar-task";
import { Arrow } from "../other/arrow";
import { handleTaskBySVGMouseEvent } from "../../helpers/bar-helper";
import { isKeyboardEvent } from "../../helpers/other-helper";
import { getVirtualRange, shouldUseVirtualScroll } from "../../helpers/virtual-scroll-helper";
import { TaskItem } from "../task-item/task-item";
import {
  BarMoveAction,
  GanttContentMoveAction,
  GanttEvent,
} from "../../types/gantt-task-actions";

export type TaskGanttContentProps = {
  tasks: BarTask[];
  dates: Date[];
  ganttEvent: GanttEvent;
  selectedTask: BarTask | undefined;
  rowHeight: number;
  columnWidth: number;
  timeStep: number;
  svg?: React.RefObject<SVGSVGElement>;
  svgWidth: number;
  taskHeight: number;
  arrowColor: string;
  arrowIndent: number;
  showArrows?: boolean;
  hideTaskName?: boolean;
  fontSize: string;
  fontFamily: string;
  rtl: boolean;
  viewType?: "default" | "oaTask";
  enableTaskDrag?: boolean;
  enableTaskResize?: boolean;
  isTaskDraggable?: (task: BarTask, action?: 'move' | 'start' | 'end' | 'actualStart' | 'actualEnd' | 'progress') => boolean;
  setGanttEvent: (value: GanttEvent) => void;
  setFailedTask: (value: BarTask | null) => void;
  setSelectedTask: (taskId: string) => void;
  scrollY?: number;
  containerHeight?: number;
} & EventOption;

export const TaskGanttContent: React.FC<TaskGanttContentProps> = ({
  tasks,
  dates,
  ganttEvent,
  selectedTask,
  rowHeight,
  columnWidth,
  timeStep,
  svg,
  taskHeight,
  arrowColor,
  arrowIndent,
  showArrows = true,
  hideTaskName = true,
  fontFamily,
  fontSize,
  rtl,
  viewType = "default",
  enableTaskDrag = false,
  enableTaskResize = true,
  isTaskDraggable,
  setGanttEvent,
  setFailedTask,
  setSelectedTask,
  scrollY = 0,
  containerHeight,
  onDateChange,
  onProgressChange,
  onDoubleClick,
  onClick,
  onDelete,
  onTaskDragEnd,
  onTaskDragComplete,
}) => {
  const point = svg?.current?.createSVGPoint();
  const [xStep, setXStep] = useState(0);
  const [initEventX1Delta, setInitEventX1Delta] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  // create xStep
  useEffect(() => {
    const dateDelta =
      dates[1].getTime() -
      dates[0].getTime() -
      dates[1].getTimezoneOffset() * 60 * 1000 +
      dates[0].getTimezoneOffset() * 60 * 1000;
    const newXStep = (timeStep * columnWidth) / dateDelta;
    setXStep(newXStep);
  }, [columnWidth, dates, timeStep]);

  useEffect(() => {
    const handleMouseMove = async (event: MouseEvent) => {
      if (!ganttEvent.changedTask || !point || !svg?.current) return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse()
      );

      const { isChanged, changedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        ganttEvent.action as BarMoveAction,
        ganttEvent.changedTask,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl,
        dates,
        columnWidth
      );
      if (isChanged) {
        setGanttEvent({ action: ganttEvent.action, changedTask });
        // 拖动过程中实时更新视觉效果
        if (onDateChange) {
          try {
            await onDateChange(changedTask, changedTask.barChildren);
          } catch (error) {
            console.error("Error updating task during drag:", error);
          }
        }
      }
    };

    const handleMouseUp = async (event: MouseEvent) => {
      const { action, originalSelectedTask, changedTask } = ganttEvent;
      if (!changedTask || !point || !svg?.current || !originalSelectedTask)
        return;
      event.preventDefault();

      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg?.current.getScreenCTM()?.inverse()
      );
      const { changedTask: newChangedTask } = handleTaskBySVGMouseEvent(
        cursor.x,
        action as BarMoveAction,
        changedTask,
        xStep,
        timeStep,
        initEventX1Delta,
        rtl,
        dates,
        columnWidth
      );

      const isNotLikeOriginal =
        originalSelectedTask.start !== newChangedTask.start ||
        originalSelectedTask.end !== newChangedTask.end ||
        originalSelectedTask.progress !== newChangedTask.progress ||
        originalSelectedTask.actualStart?.getTime() !== newChangedTask.actualStart?.getTime() ||
        originalSelectedTask.actualEnd?.getTime() !== newChangedTask.actualEnd?.getTime() ||
        originalSelectedTask.plannedStart?.getTime() !== newChangedTask.plannedStart?.getTime() ||
        originalSelectedTask.plannedEnd?.getTime() !== newChangedTask.plannedEnd?.getTime();

      // remove listeners
      svg.current.removeEventListener("mousemove", handleMouseMove);
      svg.current.removeEventListener("mouseup", handleMouseUp);
      setGanttEvent({ action: "" });
      setIsMoving(false);

      // custom operation start
      let operationSuccess = true;
      if (
        (action === "move" || action === "end" || action === "start" || action === "actualStart" || action === "actualEnd") &&
        isNotLikeOriginal
      ) {
        // 调用 onTaskDragEnd 进行API验证（如果提供的话）
        if (onTaskDragEnd) {
          try {
            const result = await onTaskDragEnd(
              newChangedTask,
              newChangedTask.barChildren
            );
            operationSuccess = result !== undefined ? Boolean(result) : true;
          } catch (error) {
            console.error("onTaskDragEnd 调用失败:", error);
            operationSuccess = false;
          }
        }
        
        // 如果没有 onTaskDragEnd 或者 API 验证成功，确保状态已更新
        // （如果拖动过程中已经调用了 onDateChange，这里就不需要再调用了）
        // 但如果 onTaskDragEnd 返回 false，我们需要恢复原始状态
        if (!operationSuccess) {
          // 恢复到原始状态
          if (onDateChange) {
            try {
              await onDateChange(originalSelectedTask, originalSelectedTask.barChildren);
            } catch (error) {
              console.error("恢复原始状态失败:", error);
            }
          }
        }
      } else if (onProgressChange && isNotLikeOriginal) {
        try {
          const result = await onProgressChange(
            newChangedTask,
            newChangedTask.barChildren
          );
          if (result !== undefined) {
            operationSuccess = result;
          }
        } catch (error) {
          operationSuccess = false;
        }
      }

      // If operation is failed - return old state
      if (!operationSuccess) {
        setFailedTask(originalSelectedTask);
      }
      
      // 触发拖动完成事件（无论成功或失败）
      if (onTaskDragComplete && isNotLikeOriginal && action) {
        try {
          onTaskDragComplete(
            operationSuccess ? newChangedTask : originalSelectedTask,
            operationSuccess ? newChangedTask.barChildren : originalSelectedTask.barChildren,
            action as 'move' | 'start' | 'end' | 'actualStart' | 'actualEnd' | 'progress'
          );
        } catch (error) {
          console.error("onTaskDragComplete 回调执行失败:", error);
        }
      }
    };

    if (
      !isMoving &&
      (ganttEvent.action === "move" ||
        ganttEvent.action === "end" ||
        ganttEvent.action === "start" ||
        ganttEvent.action === "actualStart" ||
        ganttEvent.action === "actualEnd" ||
        ganttEvent.action === "progress") &&
      svg?.current
    ) {
      svg.current.addEventListener("mousemove", handleMouseMove);
      svg.current.addEventListener("mouseup", handleMouseUp);
      setIsMoving(true);
    }
  }, [
    ganttEvent,
    xStep,
    initEventX1Delta,
    onProgressChange,
    timeStep,
    onDateChange,
    onTaskDragEnd,
    onTaskDragComplete,
    svg,
    isMoving,
    point,
    rtl,
    setFailedTask,
    setGanttEvent,
    dates,
    columnWidth,
  ]);

  /**
   * Method is Start point of task change
   */
  const handleBarEventStart = async (
    action: GanttContentMoveAction,
    task: BarTask,
    event?: React.MouseEvent | React.KeyboardEvent
  ) => {
    if (!event) {
      if (action === "select") {
        setSelectedTask(task.id);
      }
    }
    // Keyboard events
    else if (isKeyboardEvent(event)) {
      if (action === "delete") {
        if (onDelete) {
          try {
            const result = await onDelete(task);
            if (result !== undefined && result) {
              setGanttEvent({ action, changedTask: task });
            }
          } catch (error) {
            console.error("Error on Delete. " + error);
          }
        }
      }
    }
    // Mouse Events
    else if (action === "mouseenter") {
      if (!ganttEvent.action) {
        setGanttEvent({
          action,
          changedTask: task,
          originalSelectedTask: task,
        });
      }
    } else if (action === "mouseleave") {
      if (ganttEvent.action === "mouseenter") {
        setGanttEvent({ action: "" });
      }
    } else if (action === "dblclick") {
      !!onDoubleClick && onDoubleClick(task);
    } else if (action === "click") {
      !!onClick && onClick(task);
    }
    // Change task event start
    else if (action === "move") {
      // 检查是否允许移动
      if (isTaskDraggable && !isTaskDraggable(task, 'move')) {
        return;
      }
      if (!svg?.current || !point) return;
      point.x = event.clientX;
      const cursor = point.matrixTransform(
        svg.current.getScreenCTM()?.inverse()
      );
      setInitEventX1Delta(cursor.x - task.x1);
      setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
    } else if (action === "start" || action === "end" || action === "actualStart" || action === "actualEnd") {
      // 检查是否允许该操作
      if (isTaskDraggable && !isTaskDraggable(task, action)) {
        return;
      }
      setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
    } else {
      setGanttEvent({
        action,
        changedTask: task,
        originalSelectedTask: task,
      });
    }
  };

  const useVirtual = shouldUseVirtualScroll(tasks.length) && !!containerHeight && containerHeight > 0;
  const virtualRange = useMemo(() => {
    if (!useVirtual) return null;
    return getVirtualRange(scrollY, containerHeight, rowHeight, tasks.length);
  }, [useVirtual, scrollY, containerHeight, rowHeight, tasks.length]);

  const visibleTasks = useMemo(() => {
    if (!virtualRange) return tasks;
    return tasks.slice(virtualRange.startIndex, virtualRange.endIndex + 1);
  }, [tasks, virtualRange]);

  const visibleSet = useMemo(() => {
    if (!virtualRange) return null;
    const set = new Set<number>();
    for (let i = virtualRange.startIndex; i <= virtualRange.endIndex; i++) set.add(i);
    return set;
  }, [virtualRange]);

  return (
    <g className="content">
      {showArrows !== false && (
        <g className="arrows" fill={arrowColor} stroke={arrowColor}>
          {tasks.map((task, taskIdx) => {
            return task.barChildren.map(child => {
              if (visibleSet && (!visibleSet.has(taskIdx) || !visibleSet.has(child.index))) return null;
              return (
                <Arrow
                  key={`Arrow from ${task.id} to ${tasks[child.index].id}`}
                  taskFrom={task}
                  taskTo={tasks[child.index]}
                  rowHeight={rowHeight}
                  taskHeight={taskHeight}
                  arrowIndent={arrowIndent}
                  rtl={rtl}
                />
              );
            });
          })}
        </g>
      )}
      <g className="bar" fontFamily={fontFamily} fontSize={fontSize}>
        {visibleTasks.map(task => {
          // 判断任务是否可以拖动/调整（基础判断）
          const canDragBase = isTaskDraggable ? isTaskDraggable(task) : true;
          const isDateChangeableForTask = (!!onDateChange || !!onTaskDragEnd) && !task.isDisabled && !task.disableDrag && canDragBase;
          const isProgressChangeableForTask = !!onProgressChange && !task.isDisabled && !task.disableDrag && canDragBase;
          
          return (
            <TaskItem
              task={task}
              arrowIndent={arrowIndent}
              taskHeight={taskHeight}
              isProgressChangeable={isProgressChangeableForTask}
              isDateChangeable={isDateChangeableForTask}
              isDelete={!task.isDisabled}
              enableTaskDrag={enableTaskDrag}
              enableTaskResize={enableTaskResize}
              hideTaskName={hideTaskName}
              onEventStart={handleBarEventStart}
              key={task.id}
              isSelected={!!selectedTask && task.id === selectedTask.id}
              rtl={rtl}
              viewType={viewType}
              isTaskDraggable={isTaskDraggable}
            />
          );
        })}
      </g>
    </g>
  );
};
