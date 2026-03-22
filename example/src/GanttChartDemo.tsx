import React, { useCallback, useEffect, useState } from "react";
import { Gantt, Task, ViewMode, GanttColumnConfig } from "gantt-task-react";
import { initTasks, generateScrollTestTasks } from "./helper";
import "gantt-task-react/dist/index.css";
import {
  Button,
  Tooltip,
  Dropdown,
  Radio,
  message,
} from "antd";
import {
  CaretDownOutlined,
  CaretRightOutlined,
  FullscreenOutlined,
  DownOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import styles from "./GanttChartDemo.module.css";
// 启用 dayjs 周插件
dayjs.extend(weekOfYear);

// 计算高度的 hook
const useCalcHeight = (offset: number) => {
  const [height, setHeight] = useState(600);

  useEffect(() => {
    const updateHeight = () => {
      setHeight(window.innerHeight - offset);
    };
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [offset]);

  return height;
};

// 全屏切换函数
const toggleFullscreen = (element: HTMLElement) => {
  if (!document.fullscreenElement) {
    element.requestFullscreen().catch((err) => {
      console.error("无法进入全屏:", err);
    });
  } else {
    document.exitFullscreen();
  }
};

// Init
const GanttChart: React.FC = () => {
  const ganttRef = React.useRef<any>(null);
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  const [tasks, setTasks] = React.useState<Task[]>(initTasks(false, 10, 3));
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>([]);
  const viewOptions = [
    { label: "日", value: ViewMode.Day },
    { label: "周", value: ViewMode.Week },
    { label: "月", value: ViewMode.Month },
  ];

  // 列宽随 viewMode
  let columnWidth = 35;
  if (view === ViewMode.QuarterYear) {
    columnWidth = 100;
  } else if (view === ViewMode.Month) {
    columnWidth = 100;
  } else if (view === ViewMode.Week) { // 新增周模式列宽
    columnWidth = 80; // 周模式列宽（可根据需求调整）
  } else if (view === ViewMode.Day) {
    columnWidth = 35;
  }

  // 获取某个任务的直接子任务
  const getDirectChildren = (parentId: string): Task[] => {
    return tasks.filter((t) => t.project === parentId);
  };

  // 获取某个任务的所有子任务（递归）
  const getAllChildren = (parentId: string): Task[] => {
    const children: Task[] = [];
    const directChildren = tasks.filter((t) => t.project === parentId);

    directChildren.forEach((child) => {
      children.push(child);
      // 递归获取子任务的子任务
      const grandChildren = getAllChildren(child.id);
      children.push(...grandChildren);
    });

    return children;
  };

  // 添加获取选择选项的函数
  const getSelectionItems = () => {
    return [
      {
        key: "SELECTION_CURRENT",
        text: "选择当前页",
        onSelect: () => {
          const keys = tasks.map(t => t.id);
          setSelectedRowKeys(keys);
        },
      },
      {
        key: "SELECTION_ALL",
        text: "选择全部",
        onSelect: () => {
          const keys = tasks.map(t => t.id);
          setSelectedRowKeys(keys);
        },
      },
      {
        key: "SELECTION_INVERT",
        text: "反选",
        onSelect: () => {
          const allKeys = tasks.map(t => t.id);
          const newSelectedKeys = allKeys.filter(
            (key) => !selectedRowKeys.includes(key)
          );
          setSelectedRowKeys(newSelectedKeys);
        },
      },
      {
        key: "SELECTION_NONE",
        text: "清空选择",
        onSelect: () => {
          setSelectedRowKeys([]);
        },
      },
    ];
  };

  // 多选列变化处理（支持级联选择）
  const handleRowSelectionChange = (
    selectedKeys: string[],
    selectedRows: Task[]
  ) => {
    console.log("原始选中的任务 IDs:", selectedKeys);
    console.log("原始选中的任务:", selectedRows);

    // 计算新增/移除的选中key
    const previousKeys = new Set(selectedRowKeys);
    const newKeys = new Set(selectedKeys);
    const addedKeys = selectedKeys.filter((key) => !previousKeys.has(key));
    const removedKeys = selectedRowKeys.filter((key) => !newKeys.has(key));

    let finalKeys = [...selectedKeys];

    // 1. 正向级联：新增父任务 → 自动选中所有子任务（保留原有逻辑）
    addedKeys.forEach((addedKey) => {
      const children = getAllChildren(addedKey);
      const childrenKeys = children.map((c) => c.id);
      childrenKeys.forEach((childKey) => {
        if (!finalKeys.includes(childKey)) finalKeys.push(childKey);
      });
    });

    // 2. 正向取消：移除父任务 → 自动取消所有子任务（保留原有逻辑）
    removedKeys.forEach((removedKey) => {
      const children = getAllChildren(removedKey);
      const childrenKeys = children.map((c) => c.id);
      finalKeys = finalKeys.filter(
        (key) => key !== removedKey && !childrenKeys.includes(key)
      );
    });

    // 3. 反向级联核心：处理子任务选中/取消 → 联动更新所有层级父任务状态
    const updateParentSelection = (keys: string[]): string[] => {
      const updatedKeys = new Set(keys);

      // 递归更新单个任务的所有父任务状态
      const updateAncestors = (taskId: string) => {
        const currentTask = tasks.find((t) => t.id === taskId);
        if (!currentTask || !currentTask.project) return;
        const parentId = currentTask.project;
        const parentTask = tasks.find((t) => t.id === parentId);
        if (!parentTask) return;

        const parentDirectChildren = getDirectChildren(parentId);
        if (parentDirectChildren.length === 0) return;

        const allChildrenSelected = parentDirectChildren.every((child) =>
          updatedKeys.has(child.id)
        );

        if (allChildrenSelected) {
          updatedKeys.add(parentId);
          updateAncestors(parentId);
        } else {
          updatedKeys.delete(parentId);
          updateAncestors(parentId);
        }
      };

      tasks.forEach((task) => updateAncestors(task.id));
      return Array.from(updatedKeys);
    };

    finalKeys = updateParentSelection(finalKeys);
    // 去重
    finalKeys = Array.from(new Set(finalKeys));

    console.log("双向级联后的任务 IDs:", finalKeys);
    setSelectedRowKeys(finalKeys);
  };

  // 输出选中的任务
  useEffect(() => {
    console.log("选中的任务:", selectedRowKeys);
  }, [selectedRowKeys]);

  const handleClick = (task: Task) => {
    console.log("On Click event Id:" + task.id);
  };

  const handleSelect = (task: Task, isSelected: boolean) => {
    console.log(task.name + " has " + (isSelected ? "selected" : "unselected"));
  };

  const handleExpanderClick = useCallback((task: Task) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
        t.id === task.id ? { ...t, hideChildren: !t.hideChildren } : t
      )
    );
  }, []);

  // 全屏切换事件
  const handleToggleFullscreen = () => {
    const taskGantteElement = document.querySelector(
      ".taskGantte"
    ) as HTMLElement;
    toggleFullscreen(taskGantteElement);
  };

  const handleTaskChange = (updatedTask: Task) => {
    setTasks(tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)));
  };

  const currentUser = React.useMemo(() => "F1669075", []);

  // 自定义判断任务是否可以拖动/调整的函数
  const isTaskDraggable = React.useCallback(
    (
      task: Task,
      action?:
        | "move"
        | "start"
        | "end"
        | "actualStart"
        | "actualEnd"
        | "progress"
    ) => {
      const taskAny = task as any;
      let canDrag = true;

      if (action === "end") {
        // 检查状态是否为"已完成"
        let isCompleted = false;
        if (task.status) {
          if (typeof task.status === "string") {
            isCompleted = task.status === "已完成";
          } else if (
            typeof task.status === "object" &&
            (task.status as any).description
          ) {
            isCompleted = (task.status as any).description === "已完成";
          }
        }

        if (isCompleted) {
          return false;
        }

        // 检查proposer是否匹配当前用户
        let isProposerMatch = false;
        if (taskAny.proposer) {
          if (
            typeof taskAny.proposer === "object" &&
            taskAny.proposer.employeeNo
          ) {
            isProposerMatch = taskAny.proposer.employeeNo === currentUser;
          }
        }

        return isProposerMatch;
      }

      return canDrag;
    },
    [currentUser]
  );

  // 列配置：用 columns 数组统一管理列顺序、宽度、标题与单元格渲染
  // （替代原 nameColumnWidth / timeColumnLabels / timeColumnWidths /
  //   columnRenderers.{name,status,assignee,operations} /
  //   operationsColumnWidth / operationsColumnLabel / showOperationsColumn /
  //   columnHeaderRenderers.{status,assignee}）
  const columns: GanttColumnConfig[] = [
    {
      key: "name",
      width: "500px",
      render: (_, task) => (
        <div className={styles.taskTitle}>
          <span>{task.name}</span>
        </div>
      ),
    },
    {
      key: "status",
      renderTitle: () => <span>状态</span>,
      render: (_, task) => {
        const statusObj = task.status as { color: string; description: string };
        return (
          <span style={{ color: statusObj?.color }}>
            {statusObj?.description || ""}
          </span>
        );
      },
    },
    {
      key: "assignee",
      renderTitle: () => <span>负责人</span>,
      render: (value, task) => (
        <span>{(value as string) || task.assignee || ""}</span>
      ),
    },
    {
      key: "plannedStart",
      title: "Planned Start",
      width: "170px",
    },
    {
      key: "plannedEnd",
      title: "Planned End",
      width: "170px",
    },
    {
      key: "actualStart",
      title: "Actual Start",
      width: "170px",
    },
    {
      key: "actualEnd",
      title: "Actual End",
      width: "170px",
    },
    {
      key: "operations",
      title: "操作",
      width: "120px",
      align: "center",
      hidden: true,
    },
  ];

  // 拖动结束事件处理器
  const handleTaskDragEnd = async (task: Task) => {
    console.log("Task drag ended:", task);
    
    // 模拟API调用
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1;
        if (success) {
          message.success("保存成功");
          setTasks((prevTasks) =>
            prevTasks.map((t) => {
              const newValue = {
                ...task,
                taskItem: {
                  ...(task as any).taskItem,
                  delayDays: (task as any).delayDays,
                },
              };
              return t.id === task.id ? newValue : t;
            })
          );
          resolve(true);
        } else {
          message.error("保存失败，已恢复原始状态");
          resolve(false);
        }
      }, 500);
    });
  };

  return (
    <div className={styles.wrapper}>
      <div className="taskGantte">
        <Gantt
          ref={ganttRef}
          tasks={tasks}
          viewMode={view}
          onClick={handleClick}
          onSelect={handleSelect}
          onExpanderClick={handleExpanderClick}
          listCellWidth="140px"
          columns={columns}
          timelineHeaderCellRender={({ date, defaultLabel, level, viewMode: vm }: any) => {
            let displayLabel = defaultLabel;
            let tooltipText = '';
            
            if (vm === ViewMode.Day) {
              if (level === "top") {
                // 顶部：周标签，悬浮提示显示该周起止日期
                const weekNum = dayjs(date).week();
                const weekStr = weekNum.toString().padStart(2, '0');
                displayLabel = `WK ${weekStr}`;
                const weekStart = dayjs(date).startOf('week');
                const weekEnd = dayjs(date).endOf('week');
                tooltipText = `${weekStart.format('YYYY/M/D')} ~ ${weekEnd.format('YYYY/M/D')}`;
              } else {
                // 底部：日期数字，悬浮提示显示完整日期
                displayLabel = `${date.getDate()}`;
                tooltipText = dayjs(date).format('YYYY/M/D');
              }
            }
            
            // 周模式：顶部显示年月 "2025 01M"，底部显示周标签 "WK01"
            if (vm === ViewMode.Week) {
              if (level === "top") {
                // 顶部：年月格式
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                displayLabel = `${year} ${month}M`;
              } else {
                // 底部：周标签，悬浮提示显示该周起止日期
                const weekNum = dayjs(date).week();
                const weekStr = weekNum.toString().padStart(2, '0');
                displayLabel = `WK${weekStr}`;
                const weekStart = dayjs(date).startOf('week');
                const weekEnd = dayjs(date).endOf('week');
                tooltipText = `${weekStart.format('YYYY/M/D')} ~ ${weekEnd.format('YYYY/M/D')}`;
              }
            }
            
            // 月模式：底部显示月份 "M1"
            if (vm === ViewMode.Month && level === "bottom") {
              const month = date.getMonth() + 1;
              displayLabel = `M${month}`;
              // 添加悬浮提示：完整年月
              tooltipText = dayjs(date).format('YYYY年M月');
            }
            
            return (
              <text
                x={0}
                y={0}
                textAnchor="middle"
                dominantBaseline="central"
                style={{ 
                  fontSize: 12, 
                  fill: "#333"
                }}
              >
                {tooltipText && <title>{tooltipText}</title>}
                {displayLabel}
              </text>
            );
          }}
          headerHeight={41}
          rowHeight={42}
          columnRenderers={{
            unread: (task: Task) => {
              const taskAny = task as any;
              if (!taskAny.unread) return null;
              return (
                <Tooltip
                  color="white"
                  title={<span style={{ color: "black" }}>未读</span>}
                >
                  <div className={styles.unRead}>*</div>
                </Tooltip>
              );
            },
          }}
          isTaskDraggable={isTaskDraggable}
          ganttHeight={useCalcHeight(328)}
          columnWidth={columnWidth}
          expandIcon={
            <CaretDownOutlined
              style={{ marginRight: "4px", fontSize: "14px" }}
            />
          }
          collapseIcon={
            <CaretRightOutlined
              style={{ marginRight: "4px", fontSize: "14px" }}
            />
          }
          showArrows={false}
          onViewModeChange={(mode) => setView(mode)}
          showTooltip={true}
          onDateChange={handleTaskChange}
          onTaskDragEnd={handleTaskDragEnd}
          rowSelection={{
            selectedRowKeys,
            onChange: handleRowSelectionChange,
            rowKey: "id",
            columnWidth: "32px",
            showSelectAll: true,
            checkboxBorderColor: "#E1E1E1",
          }}
          gridBorderWidth={1}
          gridBorderColor="#f0f0f0"
          unreadColumn={{
            show: true,
            width: "20px",
            title: " ",
          }}
          tableStyles={{
            headerHeight: 41.5,
            cellPadding: "4px",
          }}
          columnHeaderRenderers={{
            rowSelection: (
              <div onClick={(e) => e.stopPropagation()} className={styles.checkboxCtn}>
                <Dropdown
                  menu={{
                    items: getSelectionItems().map((item) => ({
                      key: item.key,
                      label: item.text,
                      onClick: () => item.onSelect(),
                    })),
                  }}
                  trigger={["click"]}
                  placement="bottomLeft"
                >
                  <DownOutlined className={styles.DownIcon} />
                </Dropdown>
              </div>
            ),
            name: ({ expandCollapseNode }: any) => (
              <>
                <div className={styles.expandCollapseNode}>{expandCollapseNode}</div>
                <div className={styles.taskTitleText}>任务标题</div>
                <div className={styles.cleanIcon}>
                  <Tooltip title="标记全部已读">
                    <Button
                      type="text"
                      style={{ fontSize: "12px" }}
                      onClick={() => {
                        setTasks(tasks.map(t => ({ ...t, unread: false } as any)));
                        message.success("已标记全部已读");
                      }}
                    >
                      🗑️
                    </Button>
                  </Tooltip>
                </div>
              </>
            ),
          }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <div className="footerbutton" style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          {/* 视图切换 Radio.Group（已包含周模式） */}
          <Radio.Group
            options={viewOptions}
            value={view}
            optionType="button"
            onChange={(e: any) => {
              setView(e.target.value);
            }}
            size="small"
          />
          
          <Button
            size="small"
            icon={<FullscreenOutlined />}
            onClick={handleToggleFullscreen}
          >
            全屏
          </Button>

          <Button
            size="small"
            onClick={() =>
              ganttRef.current?.scrollToDate(new Date(), { align: "center" })
            }
          >
            定位到今天
          </Button>

          <Button
            size="small"
            type="dashed"
            onClick={() => {
              setTasks(generateScrollTestTasks());
              // 稍等数据渲染完毕后滚动到今天，便于观察点击空白行的跳转效果
              setTimeout(() => {
                ganttRef.current?.scrollToDate(new Date(), { align: "center" });
              }, 300);
            }}
          >
            加载滚动测试数据
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GanttChart;
