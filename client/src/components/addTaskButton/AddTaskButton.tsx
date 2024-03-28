import classes from "./addTaskButton.module.scss";

type AddTaskButtonProps = {
  onClickHandler: () => void;
};

const AddTaskButton = ({ onClickHandler }: AddTaskButtonProps) => {
  return (
    <button className={classes.button} onClick={() => onClickHandler()}>
      New Task
    </button>
  );
};

export default AddTaskButton;
