import { useCallback, useState, MouseEvent } from "react";
import classes from "./inlineAddFieldButton.module.scss";
import FloatingWindow from "../floatingWindow/FloatingWindow";
import { FieldDataType } from "../tasksPanel/TasksPanel";

type InlineAddFieldButtonProps = {
  onNewFieldClick: (field: string) => void;
};

const InlineAddFieldButton = ({
  onNewFieldClick,
}: InlineAddFieldButtonProps) => {
  const [renderWindow, setRenderWindow] = useState(false);

  const toggleWindow = useCallback(() => {
    setRenderWindow((curr) => !curr);
  }, []);

  const onFieldClicked = (eve: MouseEvent<HTMLElement>) => {
    if (eve.currentTarget.dataset.fieldType)
      onNewFieldClick(eve.currentTarget.dataset.fieldType);
  };

  return (
    <div className={classes.container}>
      <div className={classes["container__abs"]}>
        <div className={classes.btn}>
          <p
            id="inlineAddFieldBtn"
            onClick={toggleWindow}
            className={classes["btn__text"]}>
            +
          </p>
        </div>

        {renderWindow ? (
          <div id="fieldType innerSelectionWindow">
            <FloatingWindow onWindowClose={toggleWindow}>
              <ul className={classes["container__abs__list"]}>
                {Object.values(FieldDataType).map((value, index) => (
                  <li
                    key={index}
                    className={classes["container__abs__item"]}
                    id={`fieldType ${value}`}
                    data-field-type={value}
                    onClick={onFieldClicked}>
                    {value}
                  </li>
                ))}
              </ul>
            </FloatingWindow>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default InlineAddFieldButton;
