/**
 * 国际化配置
 * 支持繁体中文(zh-TW)和英文(en)
 */

export type Language = 'zh-TW' | 'en';

export interface I18nTexts {
  // OA 任务模式时间轴
  week: string; // "周" / "Week"
  weekLabel: (weekNum: string) => string; // "第X周" / "Week 02"
  
  // 视图模式切换
  dayView: string; // "日" / "Day"
  weekView: string; // "周" / "Week"
  monthView: string; // "月" / "Month"
  quarterView: string; // "季" / "Quarter"
  yearView: string; // "年" / "Year"
  
  // 表头标题
  taskTitle: string; // "任務標題" / "Task Title"
  operations: string; // "操作" / "Operations"
  status: string; // "狀態" / "Status"
  assignee: string; // "負責人" / "Assignee"
  
  // 时间列标题
  plannedStart: string; // "計劃開始" / "Planned Start"
  plannedEnd: string; // "計劃結束" / "Planned End"
  plannedDuration: string; // "計劃時長" / "Planned Duration"
  actualStart: string; // "實際開始" / "Actual Start"
  actualEnd: string; // "實際結束" / "Actual End"
  
  // 操作按钮
  add: string; // "新增" / "Add"
  edit: string; // "編輯" / "Edit"
  delete: string; // "刪除" / "Delete"
  
  // 其他
  selectAll: string; // "全選" / "Select All"
  unread: string; // "未讀" / "Unread"
  day: string; // "日" / "day"
  days: string; // "天" / "days"
  
  // 月份名称
  monthNames: string[]; // ["一月", "二月", ...] / ["January", "February", ...]
  monthNamesShort: string[]; // ["1月", "2月", ...] / ["Jan", "Feb", ...]
  
  // 月份标签函数（可自定义格式）
  monthLabel?: (monthIndex: number) => string; // monthIndex: 0-11, 如 (month) => `M${month + 1}`
  
  // 周模式母表头的年月标签函数（可自定义格式）
  yearMonthLabel?: (year: number, monthIndex: number) => string; // 如 (year, month) => `${year} ${month + 1}Mon`
  
  // 季度标签
  quarterLabel: (quarter: number) => string; // "Q1" / "Q1"
}

const zhTW: I18nTexts = {
  week: '周',
  weekLabel: (weekNum: string) => `Week ${weekNum.padStart(2, '0')}`,  // Week 01, Week 02
  
  dayView: '日',
  weekView: '周',
  monthView: '月',
  quarterView: '季',
  yearView: '年',
  
  taskTitle: '任務標題',
  operations: '操作',
  status: '狀態',
  assignee: '負責人',
  
  plannedStart: '計劃開始',
  plannedEnd: '計劃結束',
  plannedDuration: '計劃時長',
  actualStart: '實際開始',
  actualEnd: '實際結束',
  
  add: '新增',
  edit: '編輯',
  delete: '刪除',
  
  selectAll: '全選',
  unread: '未讀',
  day: '日',
  days: '天',
  
  monthNames: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
  monthNamesShort: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
  
  // 月份标签：M1, M2, ..., M7, M12 格式（可自定义）
  monthLabel: (monthIndex: number) => `M${monthIndex + 1}`,
  
  // 周模式母表头年月标签：2026 11Mon（可自定义）
  yearMonthLabel: (year: number, monthIndex: number) => `${year} ${String(monthIndex + 1).padStart(2, '0')}Mon`,
  
  quarterLabel: (quarter: number) => `Q${quarter}`,
};

const en: I18nTexts = {
  week: 'Week',
  weekLabel: (weekNum: string) => `Week ${weekNum.padStart(2, '0')}`, // Week 02
  
  dayView: 'Day',
  weekView: 'Week',
  monthView: 'Month',
  quarterView: 'Quarter',
  yearView: 'Year',
  
  taskTitle: 'Task Title',
  operations: 'Operations',
  status: 'Status',
  assignee: 'Assignee',
  
  plannedStart: 'Planned Start',
  plannedEnd: 'Planned End',
  plannedDuration: 'Planned Duration',
  actualStart: 'Actual Start',
  actualEnd: 'Actual End',
  
  add: 'Add',
  edit: 'Edit',
  delete: 'Delete',
  
  selectAll: 'Select All',
  unread: 'Unread',
  day: 'day',
  days: 'days',
  
  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  
  // 月份标签：默认使用短名称，如需要可改成 (monthIndex) => `M${monthIndex + 1}`
  monthLabel: (monthIndex: number) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex],
  
  // 周模式母表头年月标签：2026 11Mon（可自定义）
  yearMonthLabel: (year: number, monthIndex: number) => {
    const monthShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][monthIndex];
    return `${year} ${String(monthIndex + 1).padStart(2, '0')}${monthShort}`;
  },
  
  quarterLabel: (quarter: number) => `Q${quarter}`,
};

/**
 * 获取指定语言的文本
 */
export const getI18nTexts = (language: Language = 'zh-TW'): I18nTexts => {
  return language === 'en' ? en : zhTW;
};
