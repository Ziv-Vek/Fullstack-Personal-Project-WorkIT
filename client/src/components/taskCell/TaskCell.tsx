import { useCallback, useEffect, useRef, useState } from "react";
import classes from "../taskCell/taskCell.module.scss";
import SingleFieldForm from "../singleFieldForm/SingleFieldForm";
import { FieldDataType } from "../tasksPanel/TasksPanel";

type TaskCellProps = {
  taskId: string;
  cellValue?: string | number | boolean;
  fieldId: string;
  inputType?: FieldDataType;
  onValueUpdate: (
    value: string | number | boolean,
    taskId: string,
    fieldId: string
  ) => void;
};

const TaskCell = ({
  taskId,
  cellValue,
  fieldId,
  inputType,
  onValueUpdate,
}: TaskCellProps) => {
  const [isShowForm, setIsShowForm] = useState(false);
  const inputRef = useRef<HTMLDivElement>(null);

  const onCellClickHandler = useCallback(() => {
    setIsShowForm((curr) => !curr);
  }, []);

  const onValueChange = useCallback(
    (newValue: string | number | Date | boolean) => {
      onValueUpdate(newValue, taskId, fieldId);
      setIsShowForm(false);
    },
    [taskId, fieldId, onValueUpdate]
  );

  useEffect(() => {
    const handleClickOutside = (eve: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(eve.target as Node)) {
        setIsShowForm(false);
      }
    };

    if (isShowForm) document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isShowForm]);

  const getValueToRender = () => {};

  const valueToRender = getValueToRender();

  return (
    <div className={classes.cell} ref={inputRef}>
      {isShowForm ? (
        <SingleFieldForm
          onSubmitHandler={onValueChange}
          placeHolderText={`${cellValue}` ?? ""}
          toolTipText=""
          isToolTipAvailable={false}
          inputType={inputType}
          isButtonAvailable={false}
        />
      ) : (
        <p className={classes.cellValue} onClick={onCellClickHandler}>
          {cellValue ? cellValue : ""}
        </p>
      )}
    </div>
  );
};

export default TaskCell;

/* <p className={classes.cellValue}>{(cellValue ??= "")}</p> */
