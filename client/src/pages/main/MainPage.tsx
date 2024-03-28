import { Link } from "react-router-dom";
import MainNavBar from "../../components/mainNavBar/MainNavBar";
import RectangleButton from "../../components/rectangleButton/RectangleButton";
import classes from "./mainPage.module.scss";

function MainPage() {
  return (
    <>
      <MainNavBar />
      <div className={classes["headers-container"]}>
        <h1 className={classes["main-header"]}>
          <span className={classes["main-header__one"]}>One</span> app,{" "}
          <span className={classes["main-header__one"]}>One</span> place, <br />
          organized, efficient, smart
        </h1>
        <div className={classes['secondary-container']}>
          <h2 className={classes["secondary-header"]}>
            <span className={classes["secondary-header--bold"]}>
              Get everyone and everything in sync
            </span>
          </h2>
          <h2 className={classes["secondary-text"]}>
            in a single platform designed to
          </h2>
          <h2 className={classes["secondary-text"]}>
            manage your work pipelines, <br />
            projects and milestones.
          </h2>
        </div>
        <RectangleButton
          styles={"button-29"}
          innerText="Get Started. It's FREE ->"
          targetUrl="/sign-up"
        />
        <p className={classes.declaration}>**This is a portfolio demonstration project by Ziv Vekstein**</p>
      </div>
    </>
  );
}

export default MainPage;
