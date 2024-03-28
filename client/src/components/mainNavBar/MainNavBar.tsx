import CompanyLogo from "../companyLogo/CompanyLogo";
import CompanyNameLogo from "../companyNameLogo/CompanyNameLogo";
import RectangleButton from "../rectangleButton/RectangleButton";
import classes from "./mainNavBar.module.scss";

function MainNavBar() {
  return (
    <div className={classes["nav-bar"]}>
      <div className={classes["nav-bar__group"]}>
        <CompanyLogo logoHeight={78} />
        <CompanyNameLogo />
      </div>
      <div className={classes["nav-bar__group"]}>
        <RectangleButton targetUrl="/sign-up" innerText="Get Started" />
        <RectangleButton targetUrl="/login" innerText="Log in" />
      </div>
    </div>
  );
}

export default MainNavBar;
