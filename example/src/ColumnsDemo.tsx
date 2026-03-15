/**
 * ColumnsDemo —— 演示新版 columns 配置（仿 Ant Design Table）
 *
 * 主要展示：
 *  1. 通过 columns 数组控制列顺序
 *  2. hidden: true 隐藏某列
 *  3. title 自定义列头文字
 *  4. render(value, task, index) 自定义单元格渲染
 *  5. 内置列 creator（发起人），默认不显示，通过 columns 加入
 *  6. 完全自定义列（key 不在内置列表）
 */
import React, { useCallback, useEffect, useState } from "react";
import { Gantt, Task, GanttColumnConfig, ViewMode, flattenTaskTree } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { initTasksTree } from "./helper";

// 简单日期格式化
const fmt = (d?: Date | string) => {
  if (!d) return "-";
  const dt = typeof d === "string" ? new Date(d) : d;
  return `${dt.getFullYear()}/${dt.getMonth() + 1}/${dt.getDate()}`;
};

// 优先级徽标颜色
const priorityColor: Record<string, string> = {
  高: "#f5222d",
  中: "#fa8c16",
  低: "#52c41a",
};

const ColumnsDemo: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);

  // ── 列可见性开关（用于演示 hidden 控制） ───────────────────
  const [showStatus, setShowStatus] = useState(true);
  const [showAssignee, setShowAssignee] = useState(true);
  const [showCreator, setShowCreator] = useState(true);
  const [showPriority, setShowPriority] = useState(true);
  const [showOperations, setShowOperations] = useState(true);

  // ── 加载数据 ────────────────────────────────────────────────
  const loadData = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      const data = initTasksTree(false);
      // 给每个任务挂一个 priority 字段（演示自定义列）
      const withPriority = flattenTaskTree(data).map((t, i) => ({
        ...t,
        priority: (["高", "中", "低"] as const)[i % 3],
        creator: (t as any).proposer?.name ?? "张三",
      }));
      setTasks(withPriority);
      setLoading(false);
    }, 300);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // ── 多选状态 ────────────────────────────────────────────────
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([]);

  // ── 展开/折叠 ───────────────────────────────────────────────
  const handleExpanderClick = (task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  };

  // ── columns 配置（核心演示） ─────────────────────────────────
  const columns: GanttColumnConfig[] = [
    // 1. name 列：内置，自定义标题
    {
      key: "name",
      title: "任务名称",
      width: "200px",
    },

    // 2. status 列：内置，自定义 render（彩色状态标签）
    {
      key: "status",
      title: "状态",
      width: "90px",
      align: "center",
      hidden: !showStatus,
      render: (_value, task) => {
        const s = task.status;
        if (!s) return <span style={{ color: "#bbb" }}>-</span>;
        const text = typeof s === "string" ? s : s.description;
        const color = typeof s === "object" ? s.color : "#d9d9d9";
        return (
          <span
            style={{
              display: "inline-block",
              padding: "1px 8px",
              borderRadius: 10,
              background: color,
              fontSize: 12,
              color: "#000",
              whiteSpace: "nowrap",
            }}
          >
            {text}
          </span>
        );
      },
    },

    // 3. assignee 列：内置，可隐藏
    {
      key: "assignee",
      title: "负责人",
      width: "90px",
      align: "center",
      hidden: !showAssignee,
      render: (value) => (
        <span style={{ color: "#595959" }}>{value || "-"}</span>
      ),
    },

    // 4. creator 列：内置（默认不显示，需手动加入 columns）
    {
      key: "creator",
      title: "发起人",
      width: "90px",
      align: "center",
      hidden: !showCreator,
      render: (value) => (
        <span style={{ color: "#8c8c8c", fontSize: 12 }}>{value || "-"}</span>
      ),
    },

    // 5. priority 列：完全自定义列（key 不在内置列表）
    {
      key: "priority",
      title: "优先级",
      width: "70px",
      align: "center",
      hidden: !showPriority,
      render: (value) => {
        const color = priorityColor[value as string] ?? "#d9d9d9";
        return value ? (
          <span
            style={{
              display: "inline-block",
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: color,
              marginRight: 4,
            }}
          />
        ) : (
          "-"
        );
      },
      // 自定义列头（renderTitle）
      renderTitle: () => (
        <span title="任务优先级（高/中/低）">
          优先级 <span style={{ fontSize: 10, color: "#888" }}>●</span>
        </span>
      ),
    },

    // 6. plannedStart 列：用自定义 render 显示不同格式
    {
      key: "plannedStart",
      title: "计划开始",
      width: "100px",
      align: "center",
      render: (value) => (
        <span style={{ fontSize: 12 }}>{fmt(value as Date)}</span>
      ),
    },

    // 7. plannedEnd 列
    {
      key: "plannedEnd",
      title: "计划截止",
      width: "100px",
      align: "center",
      render: (value) => {
        const d = value as Date | undefined;
        if (!d) return "-";
        const isOverdue = d < new Date();
        return (
          <span style={{ fontSize: 12, color: isOverdue ? "#f5222d" : "inherit" }}>
            {fmt(d)}
          </span>
        );
      },
    },

    // 8. operations 列：内置，可隐藏
    {
      key: "operations",
      title: "操作",
      width: "100px",
      align: "center",
      hidden: !showOperations,
      render: (_, task) => (
        <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
          <button
            style={{ fontSize: 12, border: "none", background: "none", color: "#1677ff", cursor: "pointer", padding: 0 }}
            onClick={() => alert(`编辑任务：${task.name}`)}
          >
            编辑
          </button>
          <button
            style={{ fontSize: 12, border: "none", background: "none", color: "#ff4d4f", cursor: "pointer", padding: 0 }}
            onClick={() => alert(`删除任务：${task.name}`)}
          >
            删除
          </button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      {/* 说明 */}
      <div
        style={{
          marginBottom: 16,
          padding: "12px 16px",
          background: "#f0f9ff",
          border: "1px solid #91caff",
          borderRadius: 6,
          fontSize: 13,
          lineHeight: 1.8,
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: 14, marginBottom: 6, color: "#0958d9" }}>
          📋 columns 列配置演示（仿 Ant Design Table）
        </div>
        <ul style={{ margin: 0, paddingLeft: 20 }}>
          <li><b>name</b>：内置列，自定义 <code>title</code></li>
          <li><b>status</b>：内置列，自定义 <code>render</code> → 彩色状态圆角标签</li>
          <li><b>creator（发起人）</b>：内置列，默认不显示，通过 <code>columns</code> 加入</li>
          <li><b>priority（优先级）</b>：完全自定义列（key 不在内置列表），通过 <code>render</code> 显示彩色圆点，<code>renderTitle</code> 自定义列头</li>
          <li><b>plannedEnd</b>：内置列，<code>render</code> 中对逾期日期标红</li>
          <li>切换下方开关可实时演示 <code>hidden: true/false</code> 效果</li>
        </ul>
      </div>

      {/* 列可见性控制面板 */}
      <div
        style={{
          marginBottom: 12,
          padding: "10px 14px",
          background: "#fffbe6",
          border: "1px solid #ffe58f",
          borderRadius: 6,
          display: "flex",
          gap: 20,
          flexWrap: "wrap",
          alignItems: "center",
          fontSize: 13,
        }}
      >
        <span style={{ fontWeight: "bold", color: "#d46b08" }}>列显示控制：</span>
        {[
          { label: "状态列", state: showStatus, setState: setShowStatus },
          { label: "负责人列", state: showAssignee, setState: setShowAssignee },
          { label: "发起人列", state: showCreator, setState: setShowCreator },
          { label: "优先级列（自定义）", state: showPriority, setState: setShowPriority },
          { label: "操作列", state: showOperations, setState: setShowOperations },
        ].map(({ label, state, setState }) => (
          <label key={label} style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={state}
              onChange={(e) => setState(e.target.checked)}
            />
            {label}
          </label>
        ))}
        {selectedRowKeys.length > 0 && (
          <span style={{ marginLeft: "auto", color: "#1677ff" }}>
            已选 {selectedRowKeys.length} 项
          </span>
        )}
      </div>

      {/* Gantt 图表 */}
      {loading ? (
        <div style={{ textAlign: "center", padding: 40, color: "#999" }}>加载中...</div>
      ) : (
        <Gantt
          tasks={tasks}
          viewType="oaTask"
          viewMode={ViewMode.Day}
          oaTaskViewMode="日"
          listCellWidth="155px"
          ganttHeight={420}
          columnWidth={35}
          rowHeight={44}
          // ── 新 columns 配置 ────────────────────────────────
          columns={columns}
          // ── 多选列 ────────────────────────────────────────
          rowSelection={{
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys),
            rowKey: "id",
            columnWidth: "44px",
            showSelectAll: true,
          }}
          // ── 事件 ──────────────────────────────────────────
          onExpanderClick={handleExpanderClick}
          onDateChange={(task) => {
            setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
          }}
          // ── 样式 ──────────────────────────────────────────
          tableStyles={{
            // headerHeight 不单独设置，与右侧时间轴全局 headerHeight（默认50）保持一致
            borderColor: "#f0f0f0",
            headerBackgroundColor: "#fafafa",
            headerTextColor: "#595959",
          }}
          resizableColumns
          language="zh-TW"
        />
      )}
    </div>
  );
};

export default ColumnsDemo;
