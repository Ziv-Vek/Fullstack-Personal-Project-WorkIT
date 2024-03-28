import classes from "../taskCell/taskCell.module.scss";
import SingleFieldForm from "../singleFieldForm/SingleFieldForm";
import { TaskCellProps } from "../taskCellFactory/TaskCellFactory";
import { useCommonCell, useContextMenu } from "../../hooks";


const StringCell = ({
  taskId,
  cellValue,
  fieldId,
  onValueUpdate,
  onDeleteTask,
}: TaskCellProps) => {
  const {
    inputRef,
    isShowForm,
    onCellClickHandler,
    onValueChange: onValueSubmit,
  } = useCommonCell(cellValue, taskId, fieldId, onValueUpdate);

  const { callingItem, ContextMenuInstance, onOpenContext, renderContextMenu } =
    useContextMenu();

  return (
    <div
      ref={callingItem}
      onContextMenu={(eve: any) =>
        onOpenContext("Delete Task", eve, onDeleteTask, { targetId: taskId })
      }>
      <div className={classes.cell} ref={inputRef}>
        {isShowForm ? (
          <SingleFieldForm
            onSubmitHandler={onValueSubmit}
            placeHolderText={`${cellValue}` ?? ""}
            inputType="text"
            toolTipText=""
            isToolTipAvailable={false}
            isButtonAvailable={false}
          />
        ) : (
          <p className={classes.cellValue} onClick={onCellClickHandler}>
            {cellValue ? `${cellValue}` : ""}
          </p>
        )}
      </div>
      {renderContextMenu ? <ContextMenuInstance /> : ""}
    </div>
  );
};

export default StringCell;
