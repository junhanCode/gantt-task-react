import React from "react";
import styles from "./bar.module.css";

type BarProgressHandleProps = {
  progressPoint: { x: number; y: number };
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
};
export const BarProgressHandle: React.FC<BarProgressHandleProps> = ({
  progressPoint,
  onMouseDown,
}) => {
  const points = `${progressPoint.x},${progressPoint.y - 5} ${progressPoint.x - 5},${progressPoint.y} ${progressPoint.x + 5},${progressPoint.y}`;
  
  return (
    <polygon
      className={styles.barHandle}
      points={points}
      onMouseDown={onMouseDown}
    />
  );
};
