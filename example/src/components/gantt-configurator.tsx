import React from "react";
import { ViewMode } from "gantt-task-react";
import {
  Card,
  Radio,
  Checkbox,
  Space,
  InputNumber,
  Typography,
  Divider,
} from "antd";

const { Text } = Typography;

// ─── Types & constants ────────────────────────────────────────────────────────

export interface GanttConfig {
  viewMode: ViewMode;
  showTaskList: boolean;
  ganttHeight: number;
  columnWidth: number;
  // Column visibility
  showPlannedStart: boolean;
  showPlannedEnd: boolean;
  showDuration: boolean;
  showActualStart: boolean;
  showActualEnd: boolean;
  // Bar colors
  barProgressColor: string;
  barProgressSelectedColor: string;
  barBackgroundColor: string;
  barBackgroundSelectedColor: string;
  barActualColor: string;
  barActualSelectedColor: string;
  barDelayColor: string;
  projectProgressColor: string;
  projectProgressSelectedColor: string;
  projectBackgroundColor: string;
  projectBackgroundSelectedColor: string;
}

/** Default column widths per view mode */
export const VIEW_MODE_COLUMN_WIDTHS: Record<ViewMode, number> = {
  [ViewMode.Hour]: 65,
  [ViewMode.QuarterDay]: 65,
  [ViewMode.HalfDay]: 65,
  [ViewMode.Day]: 65,
  [ViewMode.DayShift]: 65,
  [ViewMode.Week]: 250,
  [ViewMode.Month]: 300,
  [ViewMode.QuarterYear]: 300,
  [ViewMode.Year]: 350,
};

export const DEFAULT_GANTT_CONFIG: GanttConfig = {
  viewMode: ViewMode.DayShift,
  showTaskList: true,
  ganttHeight: 298,
  columnWidth: VIEW_MODE_COLUMN_WIDTHS[ViewMode.DayShift],
  showPlannedStart: true,
  showPlannedEnd: true,
  showDuration: true,
  showActualStart: true,
  showActualEnd: true,
  barProgressColor: "#2196F3",
  barProgressSelectedColor: "#1976D2",
  barBackgroundColor: "#e0e0e0",
  barBackgroundSelectedColor: "#d0d0d0",
  barActualColor: "#4CAF50",
  barActualSelectedColor: "#45a049",
  barDelayColor: "#FF9800",
  projectProgressColor: "#2196F3",
  projectProgressSelectedColor: "#1976D2",
  projectBackgroundColor: "#e0e0e0",
  projectBackgroundSelectedColor: "#d0d0d0",
};

/** Derive timeColumnWidths prop — hidden columns get "0px" */
export const getTimeColumnWidths = (config: GanttConfig) => ({
  plannedStart: config.showPlannedStart ? "170px" : "0px",
  plannedEnd: config.showPlannedEnd ? "170px" : "0px",
  plannedDuration: config.showDuration ? "120px" : "0px",
  actualStart: config.showActualStart ? "170px" : "0px",
  actualEnd: config.showActualEnd ? "170px" : "0px",
});

const VIEW_MODE_OPTIONS = [
  { label: "小时", value: ViewMode.Hour },
  { label: "1/4天", value: ViewMode.QuarterDay },
  { label: "半天", value: ViewMode.HalfDay },
  { label: "天", value: ViewMode.Day },
  { label: "天+班次", value: ViewMode.DayShift },
  { label: "周", value: ViewMode.Week },
  { label: "月", value: ViewMode.Month },
  { label: "季度", value: ViewMode.QuarterYear },
  { label: "年", value: ViewMode.Year },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Clickable color swatch backed by a native <input type="color"> */
const ColorSwatch: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, value, onChange }) => (
  <Space size={5} align="center">
    <div style={{ position: "relative", width: 16, height: 16, display: "inline-block", flexShrink: 0 }}>
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: 2,
          backgroundColor: value,
          border: "1px solid #d9d9d9",
          cursor: "pointer",
        }}
      />
      <input
        type="color"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          cursor: "pointer",
          padding: 0,
          border: "none",
        }}
      />
    </div>
    <Text style={{ fontSize: 13, color: "rgba(0,0,0,0.65)" }}>{label}</Text>
  </Space>
);

// ─── Shared styles ────────────────────────────────────────────────────────────

/** Left label column — fixed width so all rows align */
const labelStyle: React.CSSProperties = {
  width: 68,
  flexShrink: 0,
  fontSize: 13,
  color: "rgba(0,0,0,0.45)",
  userSelect: "none",
  lineHeight: "22px",
};

// ─── Main component ───────────────────────────────────────────────────────────

interface Props {
  config: GanttConfig;
  onChange: (config: GanttConfig) => void;
}

export const GanttConfigurator: React.FC<Props> = ({ config, onChange }) => {
  const update = (partial: Partial<GanttConfig>) => onChange({ ...config, ...partial });

  return (
    <Card size="small" style={{ marginBottom: 16 }}>

      {/* ── Section 1: boolean toggles (mirrors antd's Bordered / loading / … row) ── */}
      <Space wrap size={[20, 6]}>
        <Checkbox
          checked={config.showTaskList}
          onChange={e => update({ showTaskList: e.target.checked })}
        >
          任务列表
        </Checkbox>
        <Checkbox
          checked={config.showPlannedStart}
          onChange={e => update({ showPlannedStart: e.target.checked })}
        >
          计划开始
        </Checkbox>
        <Checkbox
          checked={config.showPlannedEnd}
          onChange={e => update({ showPlannedEnd: e.target.checked })}
        >
          计划结束
        </Checkbox>
        <Checkbox
          checked={config.showDuration}
          onChange={e => update({ showDuration: e.target.checked })}
        >
          工期
        </Checkbox>
        <Checkbox
          checked={config.showActualStart}
          onChange={e => update({ showActualStart: e.target.checked })}
        >
          实际开始
        </Checkbox>
        <Checkbox
          checked={config.showActualEnd}
          onChange={e => update({ showActualEnd: e.target.checked })}
        >
          实际结束
        </Checkbox>
      </Space>

      {/* Negative margin offsets the Card's 12px body padding so the divider reaches edge-to-edge */}
      <Divider style={{ margin: "10px -12px" }} />

      {/* ── Section 2: labeled option rows (mirrors antd's Size / Scroll / Pagination rows) ── */}
      <Space direction="vertical" size={8} style={{ display: "flex" }}>

        {/* 视图模式 */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={labelStyle}>视图模式</span>
          <Radio.Group
            optionType="button"
            buttonStyle="solid"
            size="small"
            value={config.viewMode}
            onChange={e => {
              const vm = e.target.value as ViewMode;
              update({ viewMode: vm, columnWidth: VIEW_MODE_COLUMN_WIDTHS[vm] });
            }}
            options={VIEW_MODE_OPTIONS}
          />
        </div>

        {/* 尺寸 */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={labelStyle}>尺寸</span>
          <Space size={20}>
            <Space size={6} align="center">
              <Text style={{ fontSize: 13, color: "rgba(0,0,0,0.65)" }}>甘特高度</Text>
              <InputNumber
                size="small"
                min={100}
                max={2000}
                value={config.ganttHeight}
                onChange={v => v != null && update({ ganttHeight: v })}
                style={{ width: 72 }}
              />
            </Space>
            <Space size={6} align="center">
              <Text style={{ fontSize: 13, color: "rgba(0,0,0,0.65)" }}>列宽</Text>
              <InputNumber
                size="small"
                min={40}
                max={600}
                value={config.columnWidth}
                onChange={v => v != null && update({ columnWidth: v })}
                style={{ width: 65 }}
              />
            </Space>
          </Space>
        </div>

        {/* 条形颜色 */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={labelStyle}>条形颜色</span>
          <Space size={20}>
            <ColorSwatch
              label="进度"
              value={config.barProgressColor}
              onChange={v => update({ barProgressColor: v, barProgressSelectedColor: v })}
            />
            <ColorSwatch
              label="计划"
              value={config.barBackgroundColor}
              onChange={v =>
                update({
                  barBackgroundColor: v,
                  barBackgroundSelectedColor: v,
                  projectBackgroundColor: v,
                  projectBackgroundSelectedColor: v,
                })
              }
            />
            <ColorSwatch
              label="实际"
              value={config.barActualColor}
              onChange={v => update({ barActualColor: v, barActualSelectedColor: v })}
            />
            <ColorSwatch
              label="延误"
              value={config.barDelayColor}
              onChange={v => update({ barDelayColor: v })}
            />
          </Space>
        </div>

      </Space>
    </Card>
  );
};
