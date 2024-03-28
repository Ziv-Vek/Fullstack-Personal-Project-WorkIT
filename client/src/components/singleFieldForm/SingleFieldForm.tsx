import { useState, FormEvent, ChangeEvent, useRef } from "react";
import addIcon from "../../assets/plus-button.png";
import { Tooltip } from "react-tooltip";
import { useOutsideWindowClick } from "../../hooks";
import classes from "./singleFieldForm.module.scss";

type SingleFieldFormProps = {
  placeHolderText: string;
  toolTipText: string;
  isToolTipAvailable?: boolean;
  isButtonAvailable?: boolean;
  inputType?: string;
  inputHtmlRef?: HTMLDivElement;
  onSubmitHandler: (data: string) => void;
};

const SingleFieldForm = ({
  placeHolderText,
  toolTipText,
  isToolTipAvailable = true,
  isButtonAvailable = true,
  inputType,
  onSubmitHandler,
}: SingleFieldFormProps) => {
  const [data, setData] = useState("");
  const inputRef = useRef(null);
  /* const useClickOutside = useOutsideWindowClick(
    false,
    undefined,
    onWindowClosed
  ); */

  function handleInputChange(eve: ChangeEvent<HTMLInputElement>) {
    setData(eve.target.value);
  }

  /* function onWindowClosed() {
    if (data.trim() !== "") {
      onSubmitHandler(data);
    }
  } */

  function handleSubmit(eve: FormEvent<HTMLFormElement>) {
    eve.preventDefault();
    onSubmitHandler(data);

    //setData("");
  }

  return (
    <div ref={inputRef}>
      <form onSubmit={handleSubmit} className={classes.form}>
        <input
          name="name"
          type={inputType || "text"}
          placeholder={placeHolderText}
          value={data}
          onChange={handleInputChange}
          required
        />

        {isButtonAvailable ? (
          <button
            className={classes.button}
            type="submit"
            data-tooltip-id="my-tooltip"
            data-tooltip-content={toolTipText}
            data-tooltip-place="top">
            {isToolTipAvailable ? <Tooltip id="my-tooltip" /> : ""}
            <img
              src={addIcon}
              alt="add icon"
              className={classes["button__image"]}
            />
          </button>
        ) : (
          ""
        )}
      </form>
    </div>
  );
};

export default SingleFieldForm;
