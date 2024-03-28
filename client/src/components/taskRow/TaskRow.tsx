import { ReactNode, useEffect } from "react";
import classes from "./taskRow.module.scss";

type TaskRowProps = {
  children: ReactNode;
  taskId: string;
  taskOrder: number;
};

const TaskRow = ({ children, taskId, taskOrder }: TaskRowProps) => {
  

  return <div className={classes.row}>{children}</div>;
};

export default TaskRow;
