import React from "react";
import { ViewMode } from "gantt-task-react";
import {
  Card,
  Switch,
  Radio,
  Checkbox,
  Space,
  InputNumber,
  Typography,
  Divider,
  Row,
  Col,
} from "antd";

const { Text } = Typography;

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

/** Default column widths for each view mode */
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

/** Derive timeColumnWidths prop from config (hidden columns use "0px") */
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

const ColorSwatch: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
}> = ({ label, value, onChange }) => (
  <Space size={4} align="center">
    <div style={{ position: "relative", width: 18, height: 18, display: "inline-block", flexShrink: 0 }}>
      <div
        style={{
          width: 18,
          height: 18,
          borderRadius: 3,
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
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          opacity: 0,
          cursor: "pointer",
          padding: 0,
          border: "none",
        }}
      />
    </div>
    <Text style={{ fontSize: 12 }}>{label}</Text>
  </Space>
);

interface Props {
  config: GanttConfig;
  onChange: (config: GanttConfig) => void;
}

export const GanttConfigurator: React.FC<Props> = ({ config, onChange }) => {
  const update = (partial: Partial<GanttConfig>) => onChange({ ...config, ...partial });

  return (
    <Card size="small" style={{ marginBottom: 16 }}>
      <Row gutter={[0, 10]}>
        {/* View Mode */}
        <Col span={24}>
          <Space direction="vertical" size={4} style={{ width: "100%" }}>
            <Text type="secondary" style={{ fontSize: 12 }}>视图模式</Text>
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
          </Space>
        </Col>

        <Col span={24}>
          <Divider style={{ margin: "4px 0" }} />
        </Col>

        {/* Second row: Column Visibility | Display Options | Size | Bar Colors */}
        <Col span={24}>
          <Row align="middle" wrap>
            {/* Column Visibility */}
            <Col>
              <Space direction="vertical" size={4}>
                <Text type="secondary" style={{ fontSize: 12 }}>列显示</Text>
                <Space wrap size={[8, 4]}>
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
              </Space>
            </Col>

            <Divider type="vertical" style={{ height: 52, margin: "0 16px" }} />

            {/* Display Options */}
            <Col>
              <Space direction="vertical" size={4}>
                <Text type="secondary" style={{ fontSize: 12 }}>显示选项</Text>
                <Space size={8} align="center">
                  <Switch
                    size="small"
                    checked={config.showTaskList}
                    onChange={v => update({ showTaskList: v })}
                  />
                  <Text style={{ fontSize: 13 }}>任务列表</Text>
                </Space>
              </Space>
            </Col>

            <Divider type="vertical" style={{ height: 52, margin: "0 16px" }} />

            {/* Size */}
            <Col>
              <Space direction="vertical" size={4}>
                <Text type="secondary" style={{ fontSize: 12 }}>尺寸</Text>
                <Space size={12}>
                  <Space size={4} align="center">
                    <Text style={{ fontSize: 12 }}>甘特高度</Text>
                    <InputNumber
                      size="small"
                      min={100}
                      max={2000}
                      value={config.ganttHeight}
                      onChange={v => v != null && update({ ganttHeight: v })}
                      style={{ width: 70 }}
                    />
                  </Space>
                  <Space size={4} align="center">
                    <Text style={{ fontSize: 12 }}>列宽</Text>
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
              </Space>
            </Col>

            <Divider type="vertical" style={{ height: 52, margin: "0 16px" }} />

            {/* Bar Colors */}
            <Col>
              <Space direction="vertical" size={4}>
                <Text type="secondary" style={{ fontSize: 12 }}>条形颜色</Text>
                <Space size={12} wrap>
                  <ColorSwatch
                    label="进度"
                    value={config.barProgressColor}
                    onChange={v =>
                      update({ barProgressColor: v, barProgressSelectedColor: v })
                    }
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
                    onChange={v =>
                      update({ barActualColor: v, barActualSelectedColor: v })
                    }
                  />
                  <ColorSwatch
                    label="延误"
                    value={config.barDelayColor}
                    onChange={v => update({ barDelayColor: v })}
                  />
                </Space>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};
