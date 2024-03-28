import { useCallback } from "react";
import classes from "./companyNameLogo.module.scss";

const CompanyNameLogo = () => {
  const onLogoClicked = useCallback(() => {
    window.location.pathname = "/";
  }, []);
  return (
    <p className={classes.text} onClick={onLogoClicked}>
      TaskIT
    </p>
  );
};

export default CompanyNameLogo;
