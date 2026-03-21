import React from "react";
import { Gantt, Task, ViewMode } from "gantt-task-react";
import "gantt-task-react/dist/index.css";

/**
 * timelineHeaderCellRender 示例
 * 展示如何自定义日/周/月模式下的时间轴表头渲染
 */

const tasks: Task[] = [
  {
    id: "Task 1",
    name: "任务 1",
    type: "task",
    start: new Date(2024, 1, 1),
    end: new Date(2024, 1, 15),
    plannedStart: new Date(2024, 1, 1),
    plannedEnd: new Date(2024, 1, 15),
    progress: 45,
  },
  {
    id: "Task 2",
    name: "任务 2",
    type: "task",
    start: new Date(2024, 1, 10),
    end: new Date(2024, 1, 28),
    plannedStart: new Date(2024, 1, 10),
    plannedEnd: new Date(2024, 1, 28),
    progress: 60,
  },
];

const TimelineHeaderExample: React.FC = () => {
  const [viewMode, setViewMode] = React.useState<ViewMode>(ViewMode.Day);

  const modeLabel =
    viewMode === ViewMode.Day ? "日" : viewMode === ViewMode.Week ? "周" : "月";

  return (
    <div style={{ padding: 20 }}>
      <h1>timelineHeaderCellRender 示例</h1>
      
      <div style={{ marginBottom: 20 }}>
        <button onClick={() => setViewMode(ViewMode.Day)}>日视图</button>
        <button onClick={() => setViewMode(ViewMode.Week)} style={{ marginLeft: 10 }}>周视图</button>
        <button onClick={() => setViewMode(ViewMode.Month)} style={{ marginLeft: 10 }}>月视图</button>
      </div>

      <div style={{ marginBottom: 20, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 4 }}>
        <strong>当前模式：{modeLabel}</strong>
        <div style={{ fontSize: 12, marginTop: 5 }}>
          {viewMode === ViewMode.Day && "• 上层(top): 周标签 | 下层(bottom): 日期"}
          {viewMode === ViewMode.Week && "• 上层(top): 年月标签 | 下层(bottom): 周标签"}
          {viewMode === ViewMode.Month && "• 上层(top): 年份标签 | 下层(bottom): 月份标签"}
        </div>
      </div>

      <Gantt
        tasks={tasks}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        columnWidth={
          viewMode === ViewMode.Day ? 80 : viewMode === ViewMode.Week ? 250 : 300
        }
        
        /**
         * 自定义时间轴表头渲染
         * 支持日/周/月所有模式，通过 level 参数区分上下层
         */
        timelineHeaderCellRender={({ date, defaultLabel, level, viewMode: vm }) => {
          let displayLabel = defaultLabel;
          let customStyle: React.CSSProperties = { fontSize: 12, fill: "#333" };
          
          if (vm === ViewMode.Day) {
            if (level === "bottom") {
              displayLabel = `${date.getDate()}`;
              const dayOfWeek = date.getDay();
              if (dayOfWeek === 0 || dayOfWeek === 6) {
                customStyle.fill = "#ff4d4f";
              }
            } else {
              customStyle.fontSize = 11;
              customStyle.fill = "#666";
            }
          }
          
          else if (vm === ViewMode.Week) {
            if (level === "bottom") {
              const weekNum = defaultLabel.match(/\d+/)?.[0] || "";
              displayLabel = `W${weekNum.padStart(2, '0')}`;
              customStyle.fontSize = 12;
            } else {
              customStyle.fontSize = 13;
              customStyle.fill = "#1890ff";
              customStyle.fontWeight = "bold";
            }
          }
          
          else if (vm === ViewMode.Month) {
            if (level === "bottom") {
              const month = date.getMonth() + 1;
              displayLabel = `${month}月`;
              customStyle.fontSize = 12;
            } else {
              customStyle.fontSize = 14;
              customStyle.fill = "#52c41a";
              customStyle.fontWeight = "bold";
            }
          }
          
          return (
            <text
              x={0}
              y={0}
              textAnchor="middle"
              dominantBaseline="middle"
              style={customStyle}
            >
              <title>
                {date.toLocaleDateString('zh-CN')} ({level === 'top' ? '上层' : '下层'})
              </title>
              {displayLabel}
            </text>
          );
        }}
      />

      <div style={{ marginTop: 20, padding: 10, backgroundColor: "#e6f7ff", borderRadius: 4 }}>
        <strong>说明：</strong>
        <ul style={{ fontSize: 13, lineHeight: 1.6, marginTop: 5 }}>
          <li><strong>日模式：</strong>周末日期显示为红色，上层显示周数</li>
          <li><strong>周模式：</strong>下层周标签格式为 &quot;W01&quot;，上层年月用蓝色加粗显示</li>
          <li><strong>月模式：</strong>下层月份格式为 &quot;1月&quot;，上层年份用绿色加粗显示</li>
          <li><strong>悬浮提示：</strong>鼠标悬停在时间单元格上可以看到完整日期和层级信息</li>
        </ul>
      </div>
    </div>
  );
};

export default TimelineHeaderExample;
