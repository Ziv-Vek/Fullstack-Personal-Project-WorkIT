import classes from "./floatingWindow.module.scss";
import { ReactNode, useEffect, useRef } from "react";

type FloatingWindowProps = {
  children: ReactNode;
  onWindowClose: () => void;
};

const FloatingWindow = ({ children, onWindowClose }: FloatingWindowProps) => {
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (eve: MouseEvent) => {
      if (
        windowRef.current &&
        !windowRef.current.contains(eve.target as Node)
      ) {
        onWindowClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onWindowClose]);

  return (
    <div className={classes.window} ref={windowRef}>
      {children}
    </div>
  );
};

export default FloatingWindow;
