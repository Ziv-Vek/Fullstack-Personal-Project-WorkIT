import { useCallback, useEffect, useRef, useState } from "react";
import classes from "../taskCell/taskCell.module.scss";
import SingleFieldForm from "../singleFieldForm/SingleFieldForm";
import { TaskCellProps } from "../taskCellFactory/TaskCellFactory";
import { useCommonCell } from "../../hooks";

/* type TaskCellProps = {
  taskId: string;
  cellValue?: string;
  fieldId: string;
  onValueUpdate: (value: string, taskId: string, fieldId: string) => void;
}; */

const DateCell = ({
  taskId,
  cellValue,
  fieldId,
  onValueUpdate,
}: TaskCellProps) => {
  const { inputRef, isShowForm, onCellClickHandler, onValueChange } =
    useCommonCell(cellValue, taskId, fieldId, onValueUpdate);

  return (
    <div className={classes.cell} ref={inputRef}>
      {isShowForm ? (
        <SingleFieldForm
          onSubmitHandler={onValueChange}
          placeHolderText={`${cellValue}` ?? ""}
          inputType="date"
          toolTipText=""
          isToolTipAvailable={false}
          isButtonAvailable={true}
        />
      ) : (
        <p className={classes.cellValue} onClick={onCellClickHandler}>
          {cellValue ? `${cellValue}` : ""}
        </p>
      )}
    </div>
  );
};

export default DateCell;
