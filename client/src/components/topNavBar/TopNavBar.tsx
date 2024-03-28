import classes from "./topNavBar.module.scss";
import CompanyLogo from "../companyLogo/CompanyLogo";
import RectangleButton from "../rectangleButton/RectangleButton";
import CompanyNameLogo from "../companyNameLogo/CompanyNameLogo";

type BarProps = {
  textBeforeBtn: string | null;
  btnUrlRoute: string;
  btnInnerText: string;
};

const TopNavBar = ({ textBeforeBtn, btnUrlRoute, btnInnerText }: BarProps) => {
  return (
    <div className={classes.container}>
      <div className={classes["container__group"]}>
        <CompanyLogo logoHeight={78} />
        <CompanyNameLogo />
      </div>

      <div className={classes["container__group"]}>
        {textBeforeBtn != null ? <p className={classes['redirection-text']}>{textBeforeBtn}</p> : ""}
        <RectangleButton innerText={btnInnerText} targetUrl={btnUrlRoute} />
      </div>
    </div>
  );
};

export default TopNavBar;
