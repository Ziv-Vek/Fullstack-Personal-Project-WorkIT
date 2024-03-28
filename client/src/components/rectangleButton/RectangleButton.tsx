import { Link } from "react-router-dom";
import classes from "./rectangleButton.module.scss";

type ButtonProps = {
  targetUrl: string;
  innerText: string;
};

const RectangleButton = ({ targetUrl, innerText }: ButtonProps) => {
  return (
    <Link to={targetUrl}>
      <button className={classes.btn}>{innerText}</button>
    </Link>
  );
};

export default RectangleButton;
