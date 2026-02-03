export type VirtualRange = { startIndex: number; endIndex: number; offsetY: number; visibleCount: number };

/**
 * 虛擬列表輔助：根據滾動位置和可見高度計算應渲染的項目範圍
 * @param scrollTop 當前垂直滾動位置
 * @param containerHeight 可見區域高度（必須 > 0）
 * @param rowHeight 每行高度
 * @param totalCount 總項目數
 * @param overscan 上下預渲染行數（避免快速滾動時白屏）
 */
export function getVirtualRange(
  scrollTop: number,
  containerHeight: number | undefined,
  rowHeight: number,
  totalCount: number,
  overscan = 5
): VirtualRange | null {
  if (totalCount <= 0 || !containerHeight || containerHeight <= 0) {
    return null;
  }
  const startIndex = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan);
  const visibleCount = Math.ceil(containerHeight / rowHeight);
  const endIndex = Math.min(totalCount - 1, startIndex + visibleCount + overscan * 2);
  const offsetY = startIndex * rowHeight;
  return {
    startIndex,
    endIndex,
    offsetY,
    visibleCount: Math.max(0, endIndex - startIndex + 1),
  };
}

/**
 * 是否應啟用虛擬滾動（任務數超過閾值時）
 */
export const VIRTUAL_SCROLL_THRESHOLD = 50;

export function shouldUseVirtualScroll(taskCount: number): boolean {
  return taskCount > VIRTUAL_SCROLL_THRESHOLD;
}
