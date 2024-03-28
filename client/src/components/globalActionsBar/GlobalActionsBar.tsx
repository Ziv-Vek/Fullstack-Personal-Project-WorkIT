import CompanyLogo from "../companyLogo/CompanyLogo";
import classes from "./globalActionsBar.module.scss";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthProvider";
import UserSettingsIcon from "../userSettingsIcon/UserSettingsIcon";

const GlobalActionsBar = () => {
  const { state: authState, logout } = useContext(AuthContext);

  return (
    <div className={classes.container}>
      <div className={classes["container__group"]}>
        <CompanyLogo logoWidth={50} logoHeight={40} useNegative={true}/>
      </div>
      <div className={classes["container__group"]}>
        <button onClick={logout} className={classes["logout-btn"]}>
          Log out
        </button>
        <UserSettingsIcon />
      </div>
    </div>
  );
};

export default GlobalActionsBar;

{
  /* <div className={classes["actions-bar__group"]}>
        
        </div> */
}
