import { ReactNode } from "react";
import classes from "./formBox.module.scss";

type FormBoxProps = {
  children: ReactNode;
};

const FormBox = ({ children }: FormBoxProps) => {
  return <div className={classes.box}>{children}</div>;
};
export default FormBox;
