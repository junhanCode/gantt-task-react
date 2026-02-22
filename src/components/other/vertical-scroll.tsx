import React, { SyntheticEvent, useRef, useEffect } from "react";
import styles from "./vertical-scroll.module.css";

export const VerticalScroll: React.FC<{
  scroll: number;
  ganttHeight: number;
  ganttFullHeight: number;
  headerHeight: number;
  rtl: boolean;
  onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
}> = ({
  scroll,
  ganttHeight,
  ganttFullHeight,
  headerHeight,
  rtl,
  onScroll,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  // Track programmatic scrollTop assignments so we can ignore their echo events
  const isProgrammaticScroll = useRef(false);

  useEffect(() => {
    if (scrollRef.current && scrollRef.current.scrollTop !== scroll) {
      isProgrammaticScroll.current = true;
      scrollRef.current.scrollTop = scroll;
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
      style={{
        height: ganttHeight,
        marginTop: headerHeight,
        marginLeft: rtl ? "" : "-1rem",
      }}
      className={styles.scroll}
      onScroll={handleScroll}
      ref={scrollRef}
    >
      <div style={{ height: ganttFullHeight, width: 1 }} />
    </div>
  );
};
