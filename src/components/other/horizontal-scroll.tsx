import React, { SyntheticEvent, useRef, useEffect } from "react";
import styles from "./horizontal-scroll.module.css";

export const HorizontalScroll: React.FC<{
  scroll: number;
  svgWidth: number;
  taskListWidth: number;
  rtl: boolean;
  onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
}> = ({ scroll, svgWidth, taskListWidth, rtl, onScroll }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Track programmatic scrollLeft assignments so we can ignore their echo events
  const isProgrammaticScroll = useRef(false);

  useEffect(() => {
    if (scrollRef.current && scrollRef.current.scrollLeft !== scroll) {
      isProgrammaticScroll.current = true;
      scrollRef.current.scrollLeft = scroll;
    }
  }, [scroll]);

  const handleScroll = (event: SyntheticEvent<HTMLDivElement>) => {
    if (isProgrammaticScroll.current) {
      isProgrammaticScroll.current = false;
      return;
    }
    onScroll(event);
  };

  return (
    <div
      dir="ltr"
      style={{
        margin: rtl
          ? `0px ${taskListWidth}px 0px 0px`
          : `0px 0px 0px ${taskListWidth}px`,
      }}
      className={styles.scrollWrapper}
      onScroll={handleScroll}
      ref={scrollRef}
    >
      <div style={{ width: svgWidth }} className={styles.scroll} />
    </div>
  );
};
