/**
 * PMGanttDemo — 项目管理甘特图简约示例
 *
 * 功能展示：
 *  - 站点 (project) / 工序 (task) 两级结构
 *  - 计划 / 实际 开始·截止日期列
 *  - 延期天数自动计算列（红色标注）
 *  - 条形图区分计划色、实际色、延期色
 *  - 视图切换：日 / 周 / 月 / 年
 *  - 滚动到今天
 *  - 展开列：antd CaretRightOutlined（折叠）/ CaretDownOutlined（展开）
 */
import React, { useRef, useState } from "react";
import { Gantt, Task, ViewMode, GanttColumnConfig } from "gantt-task-react";
import { Modal, Form, Input, DatePicker, message } from "antd";
import { CaretDownOutlined, CaretRightOutlined } from "@ant-design/icons";
import dayjs, { type Dayjs } from "dayjs";
import "gantt-task-react/dist/index.css";
import planActualTooltipStyles from "./ConfigurableOATooltipContent.module.css";

/**
 * PM 演示用任务类型：包含时间轴纯日期开关。
 * 与库内 `Task.timelineUsesDatesOnly` 一致；若本地 `node_modules` 里包的 d.ts 尚未重建，用交集可避免对象字面量多余属性报错。
 */
type PMTask = Task & { timelineUsesDatesOnly?: boolean };

/** PM 演示任务条悬浮层：任务名、计划 / 实际 / 延期（内联于此文件，避免独立模块未同步导致编译失败） */
const PM_DAY_MS = 1000 * 60 * 60 * 24;
const pmToEndOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
function pmFmtDate(d: Date | undefined | null): string {
  if (!d || isNaN(d.getTime())) return "-";
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function pmDelayDescription(task: Task): string {
  const plannedEnd = task.plannedEnd || task.end;
  if (!plannedEnd || isNaN(plannedEnd.getTime())) return "-";
  const deadlineEOD = pmToEndOfDay(plannedEnd);
  const effectiveEnd = task.actualEnd ? pmToEndOfDay(task.actualEnd) : pmToEndOfDay(new Date());
  const days = Math.ceil((effectiveEnd.getTime() - deadlineEOD.getTime()) / PM_DAY_MS);
  if (days <= 0) return "未延期";
  return `延期 ${days} 天`;
}
const PMGanttPlanActualTooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {
  const plannedStart = task.plannedStart || task.start;
  const plannedEnd = task.plannedEnd || task.end;
  const actualStart = task.actualStart || task.start;
  const actualEnd = task.actualEnd;
  const planStr =
    plannedStart && plannedEnd && !isNaN(plannedStart.getTime()) && !isNaN(plannedEnd.getTime())
      ? `${pmFmtDate(plannedStart)} ~ ${pmFmtDate(plannedEnd)}`
      : "-";
  const actualStr = actualEnd
    ? `${pmFmtDate(actualStart)} ~ ${pmFmtDate(actualEnd)}`
    : `${pmFmtDate(actualStart)} ~ —`;
  const s = planActualTooltipStyles;
  return (
    <div className={s.oaTooltipContainer} style={{ fontSize, fontFamily }}>
      <div className={s.oaTooltipTitle}>{task.name}</div>
      <div className={s.oaTooltipDivider} />
      <div className={s.oaTooltipRow}>
        <span className={s.oaTooltipLabel}>计划时间</span>
        <span className={s.oaTooltipValue}>{planStr}</span>
      </div>
      <div className={s.oaTooltipRow}>
        <span className={s.oaTooltipLabel}>实际时间</span>
        <span className={s.oaTooltipValue}>{actualStr}</span>
      </div>
      <div className={s.oaTooltipRow}>
        <span className={s.oaTooltipLabel}>延期时间</span>
        <span className={s.oaTooltipValue}>{pmDelayDescription(task)}</span>
      </div>
    </div>
  );
};

// ─── 原始数据结构（与后端接口字段一一对应）────────────────────

interface DateFields {
  planStart: string;
  planEnd: string;
  actualStart: string;
  actualEnd: string;
}

interface StationItem extends DateFields {
  stationId: number;
  stationItemId: number;
  stationItemName: string;
}

interface StationData {
  stationInfo: { stationId: number; stationName: string } & DateFields;
  stationItems: StationItem[];
}

// ─── 写死的 Mock 数据（与原始业务数据完全一致，日期为空字符串）──

const MOCK_DATA: StationData[] = [
  {
    stationInfo: { stationId: 19, stationName: "1", planStart: "", planEnd: "", actualStart: "", actualEnd: "" },
    stationItems: [
      { stationId: 19, stationItemId: 55, stationItemName: "1",  planStart: "", planEnd: "", actualStart: "", actualEnd: "" },
      { stationId: 19, stationItemId: 56, stationItemName: "2",  planStart: "", planEnd: "", actualStart: "", actualEnd: "" },
      { stationId: 19, stationItemId: 57, stationItemName: "33", planStart: "", planEnd: "", actualStart: "", actualEnd: "" },
    ],
  },
  {
    stationInfo: { stationId: 20, stationName: "2", planStart: "", planEnd: "", actualStart: "", actualEnd: "" },
    stationItems: [
      { stationId: 20, stationItemId: 58, stationItemName: "1",  planStart: "", planEnd: "", actualStart: "", actualEnd: "" },
      { stationId: 20, stationItemId: 59, stationItemName: "2",  planStart: "", planEnd: "", actualStart: "", actualEnd: "" },
      { stationId: 20, stationItemId: 60, stationItemName: "33", planStart: "", planEnd: "", actualStart: "", actualEnd: "" },
    ],
  },
  {
    stationInfo: { stationId: 21, stationName: "11", planStart: "", planEnd: "", actualStart: "", actualEnd: "" },
    stationItems: [
      { stationId: 21, stationItemId: 61, stationItemName: "1",  planStart: "", planEnd: "", actualStart: "", actualEnd: "" },
      { stationId: 21, stationItemId: 62, stationItemName: "2",  planStart: "", planEnd: "", actualStart: "", actualEnd: "" },
      { stationId: 21, stationItemId: 63, stationItemName: "33", planStart: "", planEnd: "", actualStart: "", actualEnd: "" },
    ],
  },
];



// ─── 工具函数 ─────────────────────────────────────────────────

/** 将日期字符串解析为 Date；为空时返回 undefined */
const parseDate = (s: string): Date | undefined => {
  if (!s) return undefined;
  const d = new Date(s);
  return isNaN(d.getTime()) ? undefined : d;
};

// ─── 数据转换 ─────────────────────────────────────────────────
//
// 规则（纯映射为主，尽量不“造”数据）：
//  • 子任务（stationItems）是真正的甘特任务行，名称 = stationItemName
//  • 优先使用接口里的 planStart/planEnd/actualStart/actualEnd
//  • 如果接口日期缺失，仅在必要时做一个最小兜底：
//      - start = 第一条有值的日期（actualStart > plannedStart）或今天
//      - end   = 第一条有值的结束日期（actualEnd > plannedEnd）或 start + 1 天
//  • 父任务（stationInfo）仅做分组，start/end = 所有子任务最小开始 / 最大结束，
//    如果子任务没有任何有效日期，父任务就不画条，只保留一行（用今天为 start/end）

const buildTasks = (data: StationData[]): PMTask[] => {
  const result: PMTask[] = [];
  const ONE_DAY = 24 * 60 * 60 * 1000;

  data.forEach(station => {
    const parentId = `station-${station.stationInfo.stationId}`;

    const children: PMTask[] = station.stationItems.map(item => {
      // 原始时间字段（只做解析，不做推算），完全映射你的 plan/actual 字段
      const rawPlannedStart = parseDate(item.planStart);
      const rawPlannedEnd   = parseDate(item.planEnd);
      const rawActualStart  = parseDate(item.actualStart);
      const rawActualEnd    = parseDate(item.actualEnd);

      const hasAnyTime = !!(rawPlannedStart || rawPlannedEnd || rawActualStart || rawActualEnd);

      // 甘特内部必须有 start/end 才能正常渲染：
      //  - 有时间：按真实时间计算 start/end（优先 actual，再用 planned）
      //  - 全为空：用今天/明天兜底，但把条形图颜色设为透明，只当“占位行”
      const start =
        rawActualStart ||
        rawPlannedStart ||
        new Date(); // 都没有时兜底今天

      const end =
        rawActualEnd ||
        rawPlannedEnd ||
        new Date(start.getTime() + ONE_DAY); // 至少 1 天

      const child: PMTask = {
        id: `item-${item.stationItemId}`,
        name: `📍 ${item.stationItemName}`,
        type: "task",
        start,
        end,
        // 这里的 planned/actual 字段只保留“原始值”（可能为 undefined），不给它补时间
        plannedStart: rawPlannedStart,
        plannedEnd: rawPlannedEnd,
        actualStart: rawActualStart,
        actualEnd: rawActualEnd,
        // PM：条形与延期仅认计划/实际四个时间，与 OA 状态无关
        timelineUsesDatesOnly: true,
        // 简单按是否有 actualEnd 给一个进度示意：有 actualEnd 认为 100%，否则 0%
        progress: rawActualEnd ? 100 : 0,
        project: parentId,
        styles: {
          // 有时间 → 正常配色；全空 → 条形图透明，只展示表格行
          backgroundColor: hasAnyTime ? "#FFF3E0" : "transparent",
          progressColor: hasAnyTime ? "#FF9800" : "transparent",
          backgroundSelectedColor: hasAnyTime ? "#FFE0B2" : "transparent",
        },
      };

      // 额外挂在 Task 上的“原始时间字段”，仅供表格列渲染使用（通过 any 绕开类型检查）
      (child as any).planStartRaw = rawPlannedStart || undefined;
      (child as any).planEndRaw = rawPlannedEnd || undefined;
      (child as any).actualStartRaw = rawActualStart || undefined;
      (child as any).actualEndRaw = rawActualEnd || undefined;

      return child;
    });

    // 计算父任务的时间范围（根据子任务）
    let minStart: Date | undefined;
    let maxEnd: Date | undefined;
    children.forEach(t => {
      if (!minStart || t.start.getTime() < minStart.getTime()) {
        minStart = t.start;
      }
      if (!maxEnd || t.end.getTime() > maxEnd.getTime()) {
        maxEnd = t.end;
      }
    });

    const now = new Date();
    const si = station.stationInfo;
    const parentRawPlannedStart = parseDate(si.planStart);
    const parentRawPlannedEnd = parseDate(si.planEnd);
    const parentRawActualStart = parseDate(si.actualStart);
    const parentRawActualEnd = parseDate(si.actualEnd);
    const parent: PMTask = {
      id: parentId,
      name: `🏭 ${station.stationInfo.stationName}`,
      type: "project",
      start:
        parentRawActualStart ||
        parentRawPlannedStart ||
        minStart ||
        now,
      end:
        parentRawActualEnd ||
        parentRawPlannedEnd ||
        maxEnd ||
        new Date(now.getTime() + ONE_DAY),
      plannedStart: parentRawPlannedStart,
      plannedEnd: parentRawPlannedEnd,
      actualStart: parentRawActualStart,
      actualEnd: parentRawActualEnd,
      timelineUsesDatesOnly: true,
      progress: parentRawActualEnd ? 100 : 0,
      hideChildren: false,
      styles: {
        backgroundColor: "#E3F2FD",
        progressColor: "#2196F3",
        backgroundSelectedColor: "#BBDEFB",
      },
    };

    (parent as any).planStartRaw = parentRawPlannedStart || undefined;
    (parent as any).planEndRaw = parentRawPlannedEnd || undefined;
    (parent as any).actualStartRaw = parentRawActualStart || undefined;
    (parent as any).actualEndRaw = parentRawActualEnd || undefined;

    result.push(parent, ...children);
  });

  return result;
};

// ─── 辅助函数 ─────────────────────────────────────────────────

const fmtDate = (v: unknown): string => {
  if (!v) return "-";
  const d = v instanceof Date ? v : new Date(v as string);
  return isNaN(d.getTime()) ? "-" : `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`;
};

type DemoViewKey = "日" | "周" | "月" | "季" | "年" | "班次6H" | "班次D/N";

const VIEW_MODES: { label: string; key: DemoViewKey; viewMode: ViewMode }[] = [
  { label: "日",      key: "日",      viewMode: ViewMode.Day },
  { label: "周",      key: "周",      viewMode: ViewMode.Week },
  { label: "月",      key: "月",      viewMode: ViewMode.Month },
  { label: "季",      key: "季",      viewMode: ViewMode.QuarterYear },
  { label: "年",      key: "年",      viewMode: ViewMode.Year },
  { label: "班次6H",  key: "班次6H",  viewMode: ViewMode.DayShift },
  { label: "班次D/N", key: "班次D/N", viewMode: ViewMode.DayShiftDN },
];

const modeToColWidth = (m: DemoViewKey): number => {
  switch (m) {
    case "年": return 350;
    case "季": return 320;
    case "月": return 300;
    case "周": return 250;
    case "班次6H":
    case "班次D/N":
      return 80;
    default:   return 65;
  }
};

// ─── 列配置 ───────────────────────────────────────────────────

const COLUMNS: GanttColumnConfig[] = [
  { key: "name",        title: "任務名稱",  width: "180px" },
  {
    key: "planStartRaw", title: "計劃開始", width: "110px", align: "center",
    render: (_v, task) => {
      const t = task as any;
      return <span style={{ fontSize: 12 }}>{fmtDate(t.planStartRaw)}</span>;
    },
  },
  {
    key: "planEndRaw",   title: "計劃截止", width: "110px", align: "center",
    render: (_v, task) => {
      const t = task as any;
      return <span style={{ fontSize: 12 }}>{fmtDate(t.planEndRaw)}</span>;
    },
  },
  {
    key: "actualStartRaw",  title: "實際開始", width: "110px", align: "center",
    render: (_v, task) => {
      const t = task as any;
      return <span style={{ fontSize: 12 }}>{fmtDate(t.actualStartRaw)}</span>;
    },
  },
  {
    key: "actualEndRaw",    title: "實際截止", width: "110px", align: "center",
    render: (_v, task) => {
      const t = task as any;
      return <span style={{ fontSize: 12 }}>{fmtDate(t.actualEndRaw)}</span>;
    },
  },
  {
    key: "delayDays",    title: "延期時間", width: "90px",  align: "center",
    render: (_v, task) => {
      const t = task as any;
      const pe = t.planEndRaw ? new Date(t.planEndRaw).getTime() : 0;
      const ae = t.actualEndRaw ? new Date(t.actualEndRaw).getTime() : 0;
      const days = Math.ceil(Math.max(0, ae - pe) / 86400_000);
      return (
        <span style={{
          fontSize: 12,
          fontWeight: days > 0 ? "bold" : "normal",
          color: days > 0 ? "#f5222d" : "#52c41a",
        }}>
          {days > 0 ? `+${days}天` : "-"}
        </span>
      );
    },
  },
  {
    key: "progress", title: "進度", width: "70px", align: "center",
    render: (v) => <span style={{ fontSize: 11, color: "#8c8c8c" }}>{v as number}%</span>,
  },
];

// ─── 主组件 ───────────────────────────────────────────────────

const PMGanttDemo: React.FC = () => {
  const ganttRef = useRef<any>(null);
  const [tasks, setTasks]         = useState<PMTask[]>(() => buildTasks(MOCK_DATA));
  const [viewModeKey, setViewModeKey]   = useState<DemoViewKey>("日");
  const currentView = VIEW_MODES.find(v => v.key === viewModeKey) || VIEW_MODES[0];
  // 兼容本地包 d.ts 可能未同步到新属性的场景
  const dualLaneDemoProps = { enableDatesOnlyDualLane: true } as any;
  // 行编辑弹框相关状态
  const [editingTask, setEditingTask] = useState<PMTask | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragSaving, setDragSaving] = useState(false);
  const [form] = Form.useForm();

  const isRowEditable = (task: PMTask) =>
    task.type === "task" || task.type === "project";

  /** Ant Design 5 DatePicker 需要 dayjs；存 Task 里可能是 Date/string，不能直接当 Dayjs 用 */
  const toFormDayjs = (value: unknown): Dayjs | undefined => {
    if (value == null || value === "") return undefined;
    const d = dayjs(value as string | Date | Dayjs);
    return d.isValid() ? d : undefined;
  };

  const handleRowDoubleClick = (task: PMTask) => {
    if (!isRowEditable(task)) return;

    setEditingTask(task);

    const t: any = task;
    const initialValues: {
      name: string;
      planStartRaw?: Dayjs;
      planEndRaw?: Dayjs;
      actualStartRaw?: Dayjs;
      actualEndRaw?: Dayjs;
    } = {
      name:
        (task.type === "project"
          ? t.name?.replace(/^🏭\s*/, "")
          : t.name?.replace(/^📍\s*/, "")) || "",
    };

    const ps = toFormDayjs(t.planStartRaw);
    const pe = toFormDayjs(t.planEndRaw);
    const as = toFormDayjs(t.actualStartRaw);
    const ae = toFormDayjs(t.actualEndRaw);
    if (ps) initialValues.planStartRaw = ps;
    if (pe) initialValues.planEndRaw = pe;
    if (as) initialValues.actualStartRaw = as;
    if (ae) initialValues.actualEndRaw = ae;

    form.setFieldsValue(initialValues);
    setEditModalOpen(true);
  };

  const handleEditCancel = () => {
    setEditModalOpen(false);
    setEditingTask(null);
    form.resetFields();
  };

  const handleEditOk = async () => {
    if (!editingTask) return;

    try {
      const values = await form.validateFields();
      setSaving(true);

      const toDate = (v?: Dayjs) => (v ? v.toDate() : undefined);

      const isProject = editingTask.type === "project";
      const namePrefix = isProject ? "🏭 " : "📍 ";

      const updatedTask: PMTask = {
        ...editingTask,
        name: `${namePrefix}${values.name}`,
        plannedStart: toDate(values.planStartRaw),
        plannedEnd: toDate(values.planEndRaw),
        actualStart: toDate(values.actualStartRaw),
        actualEnd: toDate(values.actualEndRaw),
      };

      const hasAnyTime =
        !!updatedTask.plannedStart ||
        !!updatedTask.plannedEnd ||
        !!(updatedTask as any).planStartRaw ||
        !!(updatedTask as any).planEndRaw ||
        !!updatedTask.actualStart ||
        !!updatedTask.actualEnd;

      const newTaskAny: any = {
        ...updatedTask,
        planStartRaw: updatedTask.plannedStart,
        planEndRaw: updatedTask.plannedEnd,
        actualStartRaw: updatedTask.actualStart,
        actualEndRaw: updatedTask.actualEnd,
        styles: isProject
          ? {
              ...(updatedTask.styles || {}),
              backgroundColor: "#E3F2FD",
              progressColor: "#2196F3",
              backgroundSelectedColor: "#BBDEFB",
            }
          : {
              ...(updatedTask.styles || {}),
              backgroundColor: hasAnyTime ? "#FFF3E0" : "transparent",
              progressColor: hasAnyTime ? "#FF9800" : "transparent",
              backgroundSelectedColor: hasAnyTime ? "#FFE0B2" : "transparent",
            },
        progress: updatedTask.actualEnd ? 100 : 0,
      };

      const ONE_DAY = 24 * 60 * 60 * 1000;
      if (isProject) {
        const ps = updatedTask.plannedStart;
        const pe = updatedTask.plannedEnd;
        const as = updatedTask.actualStart;
        const ae = updatedTask.actualEnd;
        newTaskAny.start = as || ps || updatedTask.start;
        newTaskAny.end = ae || pe || new Date(newTaskAny.start.getTime() + ONE_DAY);
      }

      // 模拟接口调用
      await new Promise(resolve => setTimeout(resolve, 800));

      setTasks(prev =>
        prev.map(t => (t.id === updatedTask.id ? (newTaskAny as PMTask) : t)),
      );

      message.success("已保存任务编辑");
      setEditModalOpen(false);
      setEditingTask(null);
      form.resetFields();
    } catch (e) {
      // 校验失败直接返回
    } finally {
      setSaving(false);
    }
  };

  const handleExpanderClick = (task: PMTask) => {
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, hideChildren: !t.hideChildren } : t));
  };

  const mergeTaskAndSyncRawFields = (prevTask: PMTask, nextTask: Task): PMTask => {
    const nextAny = nextTask as any;
    return {
      ...prevTask,
      ...nextTask,
      // 拖拽只更新 planned/actual 字段；左侧表格渲染用的是 *Raw 字段
      planStartRaw: nextAny.plannedStart ?? undefined,
      planEndRaw: nextAny.plannedEnd ?? undefined,
      actualStartRaw: nextAny.actualStart ?? undefined,
      actualEndRaw: nextAny.actualEnd ?? undefined,
    } as PMTask;
  };

  const handleTaskChange = (task: PMTask) => {
    setTasks(prev =>
      prev.map(t => (t.id === task.id ? mergeTaskAndSyncRawFields(t, task) : t)),
    );
  };

  /**
   * 拖拽结束：暴露事件并模拟接口调用。
   * - 成功：保持乐观更新后的状态
   * - 失败：返回 false，库会调用 onDateChange(originalSelectedTask) 回滚
   */
  const handleTaskDragEnd = async (task: PMTask, _children: PMTask[]) => {
    setDragSaving(true);
    console.log("🧩 onTaskDragEnd fired", {
      id: task.id,
      actionTask: {
        plannedStart: task.plannedStart,
        plannedEnd: task.plannedEnd,
        actualStart: task.actualStart,
        actualEnd: task.actualEnd,
      },
    });

    // 先做“乐观更新”，保证拖拽结束瞬间左侧表格也能联动（符合你的“实时联动”诉求）
    setTasks(prev =>
      prev.map(t => (t.id === task.id ? mergeTaskAndSyncRawFields(t, task) : t)),
    );

    // 模拟接口延迟
    await new Promise(resolve => setTimeout(resolve, 800));

    const success = Math.random() > 0.2;
    if (success) {
      message.success("拖拽保存成功（模拟）");
      return true;
    }

    message.error("拖拽保存失败，已回滚（模拟）");
    return false;
  };

  const handleTaskDragComplete = (
    _task: PMTask,
    _children: PMTask[],
    _action: "move" | "start" | "end" | "actualStart" | "actualEnd" | "progress",
  ) => {
    setDragSaving(false);
  };

  const columns: GanttColumnConfig[] = COLUMNS.map((col, index) => {
    // 第一列需要显示 name 文本，其它列复用原来的 render
    if (index === 0) {
      return {
        ...col,
        render: (_v, task) => {
          const t = task as Task;
          const editable = isRowEditable(t);
          return (
            <span
              style={{
                display: "block",
                width: "100%",
                height: "100%",
                fontSize: 13,
                cursor: editable ? "pointer" : "default",
              }}
              onDoubleClick={() => {
                if (editable) {
                  handleRowDoubleClick(t);
                }
              }}
            >
              {t.name}
            </span>
          );
        },
      };
    }

    // 其他列：用原始渲染内容包一层，占满单元格，并挂同一个双击事件
    return {
      ...col,
      render: (v: unknown, task: Task, colIndex: number) => {
        const editable = isRowEditable(task);
        const inner =
          typeof col.render === "function"
            ? col.render(v, task, colIndex)
            : (v as React.ReactNode);

        return (
          <span
            style={{
              display: "block",
              width: "100%",
              height: "100%",
              cursor: editable ? "pointer" : "default",
            }}
            onDoubleClick={() => {
              if (editable) {
                handleRowDoubleClick(task);
              }
            }}
          >
            {inner}
          </span>
        );
      },
    };
  });

  return (
    <div style={{ padding: "16px 0" }}>
      {/* 工具栏 */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        {VIEW_MODES.map(({ label, key }) => (
          <button
            key={key}
            onClick={() => setViewModeKey(key)}
            style={{
              padding: "4px 14px",
              border: "1px solid",
              borderRadius: 4,
              cursor: "pointer",
              fontSize: 13,
              background: viewModeKey === key ? "#1677ff" : "#fff",
              borderColor: viewModeKey === key ? "#1677ff" : "#d9d9d9",
              color: viewModeKey === key ? "#fff" : "#333",
              transition: "all .2s",
            }}
          >
            {label}
          </button>
        ))}

        <button
          onClick={() => ganttRef.current?.scrollToDate(new Date(), { align: "center", animate: true })}
          style={{
            marginLeft: 8,
            padding: "4px 14px",
            border: "1px solid #d9d9d9",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 13,
            background: "#fff",
            color: "#333",
          }}
        >
          今天
        </button>
      </div>

        {dragSaving && (
          <div style={{ marginBottom: 12, color: "#fa8c16", fontSize: 13 }}>
            拖拽保存中（模拟接口）
          </div>
        )}

      {/* 甘特图 */}
      <Gantt
        ref={ganttRef}
        {...dualLaneDemoProps}
        tasks={tasks}
        viewMode={currentView.viewMode}
        listCellWidth="155px"
        ganttHeight={460}
        columnWidth={modeToColWidth(viewModeKey)}
        rowHeight={44}
        columns={columns}
        resizableColumns
        language="zh-TW"
        showArrows
        showTooltip
        TooltipContent={PMGanttPlanActualTooltipContent}
        tableStyles={{
          borderColor: "#f0f0f0",
          headerBackgroundColor: "#fafafa",
          headerTextColor: "#595959",
          rowBackgroundColor: "#ffffff",
          // 与 rowBackgroundColor 相同，避免库内奇偶行交替色（斑马线）
          rowEvenBackgroundColor: "#ffffff",
          row: () => ({ cursor: "pointer" }),
        }}
        barActualColor="#4CAF50"
        barActualSelectedColor="#45a049"
        barDelayColor="#fbc2d5"
        barBackgroundColor="#e0e0e0"
        barBackgroundSelectedColor="#d0d0d0"
        barProgressColor="#2196F3"
        barProgressSelectedColor="#1976D2"
        projectBackgroundColor="#e0e0e0"
        projectBackgroundSelectedColor="#d0d0d0"
        projectProgressColor="#2196F3"
        projectProgressSelectedColor="#1976D2"
        arrowColor="#999"
        todayColor="rgba(255,0,0,0.1)"
        onExpanderClick={handleExpanderClick}
        expandIcon={<CaretRightOutlined style={{ fontSize: 14 }} />}
        collapseIcon={<CaretDownOutlined style={{ fontSize: 14 }} />}
        onDoubleClick={handleRowDoubleClick}
        onDateChange={handleTaskChange}
        onTaskDragEnd={handleTaskDragEnd}
        onTaskDragComplete={handleTaskDragComplete}
        onProgressChange={handleTaskChange}
        gridBorderWidth={1}
        gridBorderColor="#f0f0f0"
      />

      <Modal
        title={editingTask?.type === "project" ? "编辑站点" : "编辑任务"}
        open={editModalOpen}
        onOk={handleEditOk}
        onCancel={handleEditCancel}
        okButtonProps={{ loading: saving }}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="任务名称"
            rules={[{ required: true, message: "请输入任务名称" }]}
          >
            <Input placeholder="请输入任务名称" />
          </Form.Item>

          <Form.Item label="计划时间">
            <div style={{ display: "flex", gap: 8 }}>
              <Form.Item
                name="planStartRaw"
                style={{ flex: 1, marginBottom: 0 }}
                dependencies={["planEndRaw"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_: unknown, value?: Dayjs) {
                      const end = getFieldValue("planEndRaw") as Dayjs | undefined;
                      if (value && end && value.valueOf() > end.valueOf()) {
                        return Promise.reject(new Error("计划开始时间不能晚于计划结束时间"));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker style={{ width: "100%" }} placeholder="计划开始" />
              </Form.Item>
              <Form.Item
                name="planEndRaw"
                style={{ flex: 1, marginBottom: 0 }}
                dependencies={["planStartRaw"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_: unknown, value?: Dayjs) {
                      const start = getFieldValue("planStartRaw") as Dayjs | undefined;
                      if (start && value && value.valueOf() < start.valueOf()) {
                        return Promise.reject(new Error("计划结束时间不能早于计划开始时间"));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker style={{ width: "100%" }} placeholder="计划结束" />
              </Form.Item>
            </div>
          </Form.Item>

          <Form.Item label="实际时间">
            <div style={{ display: "flex", gap: 8 }}>
              <Form.Item
                name="actualStartRaw"
                style={{ flex: 1, marginBottom: 0 }}
                dependencies={["actualEndRaw"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_: unknown, value?: Dayjs) {
                      const end = getFieldValue("actualEndRaw") as Dayjs | undefined;
                      if (value && end && value.valueOf() > end.valueOf()) {
                        return Promise.reject(new Error("实际开始时间不能晚于实际结束时间"));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker style={{ width: "100%" }} placeholder="实际开始" />
              </Form.Item>
              <Form.Item
                name="actualEndRaw"
                style={{ flex: 1, marginBottom: 0 }}
                dependencies={["actualStartRaw"]}
                rules={[
                  ({ getFieldValue }) => ({
                    validator(_: unknown, value?: Dayjs) {
                      const start = getFieldValue("actualStartRaw") as Dayjs | undefined;
                      if (start && value && value.valueOf() < start.valueOf()) {
                        return Promise.reject(new Error("实际结束时间不能早于实际开始时间"));
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker style={{ width: "100%" }} placeholder="实际结束" />
              </Form.Item>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PMGanttDemo;
