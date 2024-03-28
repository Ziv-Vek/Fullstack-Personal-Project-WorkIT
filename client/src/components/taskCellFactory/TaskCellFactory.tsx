import { FieldDataType } from "../tasksPanel/TasksPanel";
import { useCommonCell } from "../../hooks";
import classes from "../taskCell/taskCell.module.scss";
import StringCell from "../stringCell/StringCell";
import NumberCell from "../numberCell/numberCell";
import DateCell from "../dateCell/dateCell";

type TaskCellFactoryProps = {
  fieldType: "string" | "number" | "date";
};

export type TaskCellProps = {
  taskId: string;
  cellValue: string | number | Date;
  fieldId: string;
  onValueUpdate: (
    value: string | number | Date,
    taskId: string,
    fieldId: string
  ) => void;
  onDeleteTask: (taskId: string) => void;
};

const TaskCellFactory = (fieldType: "string" | "number" | "date") => {
  switch (fieldType) {
    case "string":
      return StringCell;
    case "number":
      return NumberCell;
    case "date":
      return DateCell;

    default:
      console.log("Incorrect type");
      return StringCell;
  }
};

export default TaskCellFactory;

/* switch (fieldType) {
    case 'string':
      return ({taskId, cellValue, fieldId, onValueUpdate}: CommonTaskCellProps)

    case FieldDataType.Number:
      break;

    case FieldDataType.Date:
      break;

    default:
      console.error("no matching field");
      break;
  }
  return <></>; */
