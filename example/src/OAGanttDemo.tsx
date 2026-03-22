import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Gantt, Task, ViewMode, GanttColumnConfig, flattenTaskTree } from "gantt-task-react";
import { initTasksTree } from "./helper";
import "gantt-task-react/dist/index.css";
import {
  Button,
  Tooltip,
  Dropdown,
  Radio,
  Switch,
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
dayjs.extend(weekOfYear);

// 计算高度的 hook
const useCalcHeight = (offset: number) => {
  const [height, setHeight] = useState(600);
  useEffect(() => {
    const updateHeight = () => setHeight(window.innerHeight - offset);
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, [offset]);
  return height;
};

// 全屏切换
const toggleFullscreen = (element: HTMLElement | null) => {
  if (!element) return;
  if (!document.fullscreenElement) {
    element.requestFullscreen().catch((err) => {
      console.error("无法进入全屏:", err);
    });
  } else {
    document.exitFullscreen();
  }
};

// 在树形任务列表中找到指定 id 的节点并更新字段（用于 expand/collapse 等事件回写）
function updateNodeInTree(tasks: Task[], id: string, updates: Partial<Task> | Record<string, any>): Task[] {
  return tasks.map(t => {
    if (t.id === id) return { ...t, ...updates };
    if ((t as any).children) {
      return { ...t, children: updateNodeInTree((t as any).children, id, updates) };
    }
    return t;
  });
}

const OAGanttDemo: React.FC = () => {
  const ganttRef = React.useRef<any>(null);
  const [view, setView] = React.useState<ViewMode>(ViewMode.Day);
  // 以树形结构存储任务（children 嵌套，类似 antd Table 数据格式）
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = React.useState<string[]>([]);
  const [noUnread, setNoUnread] = React.useState(false);
  const [readAllLoading, setReadAllLoading] = React.useState(false);
  const [useCustomBarColor, setUseCustomBarColor] = React.useState(false);

  // 从树形数据派生出平铺列表，用于 cascade 多选逻辑
  const flatTasks = useMemo(() => flattenTaskTree(tasks), [tasks]);

  const viewOptions = [
    { label: "日", value: ViewMode.Day },
    { label: "周", value: ViewMode.Week },
    { label: "月", value: ViewMode.Month },
  ];

  // 模拟接口加载数据（返回树形格式，Gantt 组件内部自动展平）
  const loadData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      // initTasksTree 返回带 children 嵌套的 Task[]（antd Table 风格）
      const data = initTasksTree(false);
      setTasks(data);
      // 判断是否有未读（遍历展平后的列表）
      const hasUnread = flattenTaskTree(data).some((t) => (t as any).unread);
      setNoUnread(!hasUnread);
      setLoading(false);
      const flat = flattenTaskTree(data);
      console.log(`✅ 数据加载完成（树形格式），共 ${data.length} 个顶层任务，展平后共 ${flat.length} 条`);
    }, 600);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 列宽配置
  let columnWidth = 35;
  if (view === ViewMode.QuarterYear) {
    columnWidth = 100;
  } else if (view === ViewMode.Month) {
    columnWidth = 100;
  } else if (view === ViewMode.Week) {
    columnWidth = 80;
  } else if (view === ViewMode.Day) {
    columnWidth = 35;
  }

  // 获取直接子任务（从展平列表中查，保证树形和平铺格式均可用）
  const getDirectChildren = useCallback(
    (parentId: string): Task[] => {
      return flatTasks.filter((t) => t.project === parentId);
    },
    [flatTasks]
  );

  // 获取所有子任务（递归）
  const getAllChildren = useCallback(
    (parentId: string): Task[] => {
      const children: Task[] = [];
      const directChildren = flatTasks.filter((t) => t.project === parentId);
      directChildren.forEach((child) => {
        children.push(child);
        const grandChildren = getAllChildren(child.id);
        children.push(...grandChildren);
      });
      return children;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [flatTasks]
  );

  // 获取当前页全部任务 id（从展平列表中取）
  const getCurrentPageAllTaskIds = (): string[] =>
    flatTasks.map((t) => t.id);

  // 下拉选择菜单
  const getSelectionItems = () => [
    {
      key: "SELECTION_CURRENT",
      text: "选择当前页",
      onSelect: () => {
        const keys = getCurrentPageAllTaskIds();
        setSelectedRowKeys(keys);
      },
    },
    {
      key: "SELECTION_ALL",
      text: "选择全部",
      onSelect: () => {
        const keys = getCurrentPageAllTaskIds();
        setSelectedRowKeys(keys);
      },
    },
    {
      key: "SELECTION_INVERT",
      text: "反选",
      onSelect: () => {
        const allKeys = getCurrentPageAllTaskIds();
        const newKeys = allKeys.filter((k) => !selectedRowKeys.includes(k));
        setSelectedRowKeys(newKeys);
      },
    },
    {
      key: "SELECTION_NONE",
      text: "清空选择",
      onSelect: () => setSelectedRowKeys([]),
    },
  ];

  // 多选级联处理
  const handleRowSelectionChange = (
    selectedKeys: string[],
    _selectedRows: Task[]
  ) => {
    const previousKeys = new Set(selectedRowKeys);
    const newKeysSet = new Set(selectedKeys);
    const addedKeys = selectedKeys.filter((k) => !previousKeys.has(k));
    const removedKeys = selectedRowKeys.filter((k) => !newKeysSet.has(k));

    let finalKeys = [...selectedKeys];

    // 正向级联：选父 → 选子
    addedKeys.forEach((addedKey) => {
      const children = getAllChildren(addedKey);
      children.forEach((c) => {
        if (!finalKeys.includes(c.id)) finalKeys.push(c.id);
      });
    });

    // 正向取消：取消父 → 取消子
    removedKeys.forEach((removedKey) => {
      const children = getAllChildren(removedKey);
      const childIds = children.map((c) => c.id);
      finalKeys = finalKeys.filter(
        (k) => k !== removedKey && !childIds.includes(k)
      );
    });

    // 反向级联：全选子 → 自动选父（递归多层）
    const updateParentSelection = (keys: string[]): string[] => {
      const updatedKeys = new Set(keys);

      const updateAncestors = (taskId: string) => {
        const currentTask = flatTasks.find((t) => t.id === taskId);
        if (!currentTask || !currentTask.project) return;
        const parentId = currentTask.project;
        const parentTask = flatTasks.find((t) => t.id === parentId);
        if (!parentTask) return;

        const directChildren = getDirectChildren(parentId);
        if (directChildren.length === 0) return;

        const allSelected = directChildren.every((c) =>
          updatedKeys.has(c.id)
        );
        if (allSelected) {
          updatedKeys.add(parentId);
          updateAncestors(parentId);
        } else {
          updatedKeys.delete(parentId);
          updateAncestors(parentId);
        }
      };

      flatTasks.forEach((task) => updateAncestors(task.id));
      return Array.from(updatedKeys);
    };

    finalKeys = updateParentSelection(finalKeys);
    finalKeys = Array.from(new Set(finalKeys));
    setSelectedRowKeys(finalKeys);
  };

  // 展开/折叠节点：在树中找到对应节点并更新 hideChildren
  const handleExpanderClick = useCallback((task: Task) => {
    setTasks((prev) =>
      updateNodeInTree(prev, task.id, { hideChildren: task.hideChildren })
    );
  }, []);

  // 日期/进度拖拽后更新对应节点
  const handleTaskChange = (updatedTask: Task) => {
    setTasks((prev) => updateNodeInTree(prev, updatedTask.id, updatedTask));
  };

  const currentUser = React.useMemo(() => "何聪", []);

  // 拖动权限控制
  const isTaskDraggable = React.useCallback(
    (
      task: Task,
      action?: "move" | "start" | "end" | "actualStart" | "actualEnd" | "progress"
    ) => {
      if (action === "progress") return false;

      const taskAny = task as any;

      // 判断是否已完成
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

      // 已完成任务：计划时间（move/start/end）均不可改，实际时间不受限
      if (isCompleted && (action === "move" || action === "start" || action === "end")) {
        return false;
      }

      if (action === "end" && !isCompleted) {
        // 只有 proposer 为当前用户才可拉伸结束时间
        let isProposerMatch = false;
        if (taskAny.proposer) {
          if (typeof taskAny.proposer === "object") {
            isProposerMatch =
              taskAny.proposer.name === currentUser ||
              taskAny.proposer.employeeNo === currentUser;
          } else if (typeof taskAny.proposer === "string") {
            isProposerMatch = taskAny.proposer === currentUser;
          }
        }
        if (!isProposerMatch && task.assignee) {
          isProposerMatch = task.assignee === currentUser;
        }
        return isProposerMatch;
      }

      return true;
    },
    [currentUser]
  );

  // 自定义任务条形图颜色：优先使用 status.color（服务端字段），其次按优先级映射
  const getTaskBarColor = React.useCallback(
    (task: Task): string | null => {
      if (!useCustomBarColor) return null;

      const taskAny = task as any;

      // 1. 优先使用 status.color（StatusInfo 对象中服务端定义的颜色）
      if (taskAny.statusInfoVo?.color) {
        return taskAny.statusInfoVo.color;
      }
      if (typeof task.status === "object" && (task.status as any)?.color) {
        return (task.status as any).color;
      }

      // 2. 按优先级（高/中/低）返回颜色
      const priorityColorMap: Record<string, string> = {
        高: "#FF6B6B",
        中: "#4ECDC4",
        低: "#95E1D3",
      };
      if (taskAny.priority && priorityColorMap[taskAny.priority]) {
        return priorityColorMap[taskAny.priority];
      }

      // 3. 返回 null，使用内置状态色
      return null;
    },
    [useCustomBarColor]
  );

  // 模拟拖动后保存接口（90% 成功率）
  const handleTaskDragEnd = async (task: Task): Promise<boolean> => {
    console.log("Task drag ended:", task);
    return new Promise<boolean>((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1;
        if (success) {
          message.success("保存成功");
          setTasks((prev) =>
            updateNodeInTree(prev, task.id, {
              ...task,
              taskItem: { ...(task as any).taskItem, delayDays: (task as any).delayDays },
            } as any)
          );
          resolve(true);
        } else {
          message.error("保存失败，已恢复原始状态");
          resolve(false);
        }
      }, 500);
    });
  };

  // 标记全部已读
  const handleMarkAllAsRead = async () => {
    setReadAllLoading(true);
    await new Promise<void>((resolve) => setTimeout(resolve, 800));
    // 递归把树中所有节点标记为已读
    const markAllRead = (nodes: Task[]): Task[] =>
      nodes.map((t) => ({
        ...t,
        unread: false,
        read: true,
        ...((t as any).children
          ? { children: markAllRead((t as any).children) }
          : {}),
      } as Task));
    setTasks((prev) => markAllRead(prev));
    setNoUnread(false);
    setReadAllLoading(false);
    message.success("已标记全部已读");
  };

  const ganttHeight = useCalcHeight(328);

  // 列配置：替代 nameColumnWidth / timeColumnLabels / timeColumnWidths /
  // columnRenderers.{name,status,assignee} / operationsColumnWidth /
  // operationsColumnLabel / showOperationsColumn / columnHeaderRenderers.{status,assignee}
  const columns: GanttColumnConfig[] = [
    {
      key: "name",
      width: "500px",
      render: (_, task) => {
        const taskAny = task as any;
        const projectTags: string[] = taskAny.projectTags || [];
        const prefix = projectTags.map((p: string) => `【${p}】`).join("");
        return (
          <div className={styles.taskTitle}>
            <span title={`${prefix}${task.name}`}>
              {prefix}
              {task.name}
            </span>
          </div>
        );
      },
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
        <Tooltip title={undefined}>
          <span>{(value as string) || task.assignee || ""}</span>
        </Tooltip>
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

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: "center", color: "#666" }}>
        加载中...
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className="taskGantte">
        <Gantt
          ref={ganttRef}
          tasks={tasks}
          viewMode={view}
          onClick={(task) => console.log("On Click event Id:" + task.id)}
          onSelect={(task, isSelected) =>
            console.log(task.name + " has " + (isSelected ? "selected" : "unselected"))
          }
          onExpanderClick={handleExpanderClick}
          listCellWidth="140px"
          columns={columns}
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
          getTaskBarColor={getTaskBarColor}
          ganttHeight={ganttHeight}
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
          timelineHeaderCellRender={({ date, defaultLabel, level, viewMode: vm }: any) => {
            let displayLabel = defaultLabel;
            let tooltipText = "";

            if (vm === ViewMode.Day) {
              if (level === "top") {
                const weekNum = dayjs(date).week();
                const weekStr = weekNum.toString().padStart(2, "0");
                displayLabel = `WK ${weekStr}`;
                const weekStart = dayjs(date).startOf("week");
                const weekEnd = dayjs(date).endOf("week");
                tooltipText = `${weekStart.format("YYYY/M/D")} ~ ${weekEnd.format("YYYY/M/D")}`;
              } else {
                displayLabel = `${date.getDate()}`;
                tooltipText = dayjs(date).format("YYYY/M/D");
              }
            }

            if (vm === ViewMode.Week) {
              if (level === "top") {
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, "0");
                displayLabel = `${year} ${month}M`;
              } else {
                const weekNum = dayjs(date).week();
                const weekStr = weekNum.toString().padStart(2, "0");
                displayLabel = `WK${weekStr}`;
                const weekStart = dayjs(date).startOf("week");
                const weekEnd = dayjs(date).endOf("week");
                tooltipText = `${weekStart.format("YYYY/M/D")} ~ ${weekEnd.format("YYYY/M/D")}`;
              }
            }

            if (vm === ViewMode.Month && level === "bottom") {
              const month = date.getMonth() + 1;
              displayLabel = `M${month}`;
              tooltipText = dayjs(date).format("YYYY年M月");
            }

            return (
              <text
                x={0}
                y={0}
                textAnchor="middle"
                dominantBaseline="central"
                style={{ fontSize: 12, fill: "#333" }}
              >
                {tooltipText && <title>{tooltipText}</title>}
                {displayLabel}
              </text>
            );
          }}
          tableStyles={{
            headerHeight: 41.5,
            cellPadding: "4px",
          }}
          columnHeaderRenderers={{
            rowSelection: (
              <div
                onClick={(e) => e.stopPropagation()}
                className={styles.checkboxCtn}
              >
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
                  {!noUnread ? (
                    <Tooltip title="暂无未读消息">
                      <Button type="text" style={{ color: "#808080", fontSize: "12px" }}>
                        🗑️
                      </Button>
                    </Tooltip>
                  ) : (
                    <Tooltip title="标记全部已读">
                      <Button
                        loading={readAllLoading}
                        type="text"
                        style={{ fontSize: "12px" }}
                        onClick={handleMarkAllAsRead}
                      >
                        🗑️
                      </Button>
                    </Tooltip>
                  )}
                </div>
              </>
            ),
          }}
        />
      </div>

      <div style={{ marginTop: "20px" }}>
        <div
          className="footerbutton"
          style={{ display: "flex", alignItems: "center", gap: "16px" }}
        >
          <Radio.Group
            options={viewOptions}
            value={view}
            optionType="button"
            onChange={(e: any) => setView(e.target.value)}
            size="small"
          />

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
            icon={<FullscreenOutlined />}
            onClick={() => {
              const el = document.querySelector(".taskGantte") as HTMLElement;
              toggleFullscreen(el);
            }}
          >
            全屏
          </Button>

          <Button size="small" type="dashed" onClick={loadData}>
            重新加载数据
          </Button>

          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#555" }}>
            <Switch
              size="small"
              checked={useCustomBarColor}
              onChange={setUseCustomBarColor}
            />
            自定义条形图颜色
          </span>

          <span style={{ color: "#1890ff", fontSize: "12px" }}>
            已选择：{selectedRowKeys.length} 个
          </span>

          {selectedRowKeys.length > 0 && (
            <Button
              size="small"
              onClick={() => setSelectedRowKeys([])}
            >
              清空选择
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OAGanttDemo;
