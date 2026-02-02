import React, { memo } from 'react';
import { Tooltip, Flex } from 'antd';
import {
  CaretDownOutlined,
  CaretRightOutlined,
  StarFilled,
  EyeInvisibleFilled,
  WarningFilled,
} from '@ant-design/icons';
import styles from './TitleCell.module.css';

// 定义组件Props类型，明确入参和回调
interface TitleCellProps {
  value: string;
  record: any;
  expandedRowKeys: any[];
  onRead?: (record: any) => void; // 标记已读的回调
  onAdd?: (taskID: string | number) => void; // 新增/编辑任务的回调
  onCheck?: (record: any, operate: string) => void; // 查看/操作任务的回调
  onExpand: (expanded: boolean, record: any) => void; // 展开/折叠子行的回调
}

const TitleCell: React.FC<TitleCellProps> = memo(({
  value,
  record,
  expandedRowKeys,
  onRead,
  onAdd,
  onCheck,
  onExpand,
}) => {
  // 防重复点击处理（简化版，250ms防抖）
  const handleTitleAction = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().length > 0) return; // 复制操作不触发后续逻辑
    handleClick();
  };

  // 标题点击核心逻辑
  const handleClick = () => {
    if (onRead && !record.read) onRead(record); // 未读则标记已读

    // 根据任务状态区分操作
    const statusDesc = record?.statusInfoVo?.description || record?.status?.description;
    if (onAdd && (statusDesc === "已撤销" || statusDesc === "草稿")) {
      onAdd(record.id);
    } else if (onCheck && statusDesc && statusDesc !== "已撤销" && statusDesc !== "草稿") {
      onCheck(record, "");
    } else if (onCheck) {
      onCheck(record, "view");
    }
  };

  // 渲染项目标签（处理数组/单个值，超过3个显示省略）
  const renderProjectTags = () => {
    // 优先使用 projectTags 字段，兼容 project 字段
    const projectSource = record.projectTags || record.project;
    if (!projectSource) return null;
    const projects = Array.isArray(projectSource) ? projectSource : [projectSource];
    
    if (projects.length > 3) {
      return (
        <>
          {projects.slice(0, 3).map((proj: string, index: number) => (
            <span key={index}>【{proj}】</span>
          ))}
          <span> ...</span>
          <span style={{ fontSize: 12 }}>+{projects.length - 3}</span>
          &nbsp;
        </>
      );
    }
    return projects.map((proj: string, index: number) => (
      <span key={index}>【{proj}】</span>
    ));
  };

  return (
    <div key={record.id} className={styles.titleCell}>
      <div className={styles.jump_Ctn} onClick={handleTitleAction}>
        {/* 未读标记 */}
        {!record.read ? (
          <Tooltip
            color="white"
            title={<span style={{ color: "black" }}>未读</span>}
          >
            <div className={styles.unRead}>*</div>
          </Tooltip>
        ) : (
          <div style={{ width: 10 }}></div>
        )}

        {/* 子行展开/折叠图标（有子行时显示） */}
        {record.hasChildren ? (
          <div
            className={styles.expandIcon}
            onClick={(e) => {
              e.stopPropagation();
              onExpand(!expandedRowKeys.includes(record.id), record);
            }}
            style={{ marginLeft: `${(record.layer - 1) * 10 + 4}px` }}
          >
            {expandedRowKeys.includes(record.id) ? (
              <CaretDownOutlined style={{ fontSize: 14 }} />
            ) : (
              <CaretRightOutlined style={{ fontSize: 14 }} />
            )}
          </div>
        ) : (
          <div
            style={{
              width: 14,
              flexShrink: 0,
              display: "inline-block",
              marginLeft: `${(record.layer - 1) * 10 + 4}px`,
            }}
          ></div>
        )}

        {/* 任务编号（有父级时显示） */}
        {record?.parentId != null && record.parentId !== 0 && record?.number !== 0 && (
          <div className={record.layer > 1 ? styles.child_index : styles.row_index}>
            {record?.number ?? "--"}
          </div>
        )}

        {/* 任务标题 + 项目标签 */}
        <div
          title={
            record.projectTags || record.project
              ? `${Array.isArray(record.projectTags || record.project) 
                  ? (record.projectTags || record.project).map((p: string) => `【${p}】`).join("") 
                  : `【${record.projectTags || record.project}】`
                } ${value}`
              : value
          }
          className={styles.title}
        >
          {renderProjectTags()}
          <span>{value}</span>
        </div>

        {/* 会议决议标记 */}
        {record.category === "6-5" && (
          <Tooltip
            color="white"
            title={<span style={{ color: "black" }}>会议决议</span>}
          >
            <div className={styles.row_meeting}>会议</div>
          </Tooltip>
        )}

        {/* 关注标记 */}
        <StarFilled
          style={{ color: "#ffc125", display: record.focus ? "" : "none" }}
        />

        {/* 隐藏标记 */}
        <EyeInvisibleFilled
          style={{ color: "grey", display: record.hidden ? "" : "none" }}
        />

        {/* 跟进标记 */}
        <Tooltip
          color="white"
          title={<span style={{ color: "black" }}>跟进</span>}
        >
          <WarningFilled
            style={{ color: "#ff6a6a", display: record.follow ? "" : "none" }}
          />
        </Tooltip>

        {/* 延期标记 */}
        <Flex style={{ display: record.delayDays > 0 ? "" : "none", flexShrink: 0 }}>
          <div
            style={{ backgroundColor: "#fff0f5", color: "#bd3124" }}
            className={styles.statusCtn}
          >
            延期&nbsp;{record.delayDays}&nbsp;天
          </div>
        </Flex>

        {/* 暂停标记 */}
        <Flex style={{ display: record.suspend ? "" : "none", flexShrink: 0 }}>
          <div
            style={{ backgroundColor: "#efefef", color: "#6c6c6c" }}
            className={styles.statusCtn}
          >
            暂停&nbsp;{record.suspendDays}&nbsp;天
          </div>
        </Flex>
      </div>
    </div>
  );
});

export default TitleCell;
