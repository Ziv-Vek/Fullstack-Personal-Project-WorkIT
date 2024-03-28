import styles from "./userSettingsIcon.module.scss";
import { AuthContext } from "../../contexts/AuthProvider";
import { useCallback, useContext, useEffect, useState } from "react";

const UserSettingsIcon = () => {
  const { state: authState } = useContext(AuthContext);
  const [initials, setInitials] = useState("");

  const userInitials = useCallback(() => {
    const nameArr = authState.name?.split(" ");
    if (nameArr && nameArr.length > 1) {
      setInitials(() => `${nameArr[0][0]} ${nameArr[nameArr.length - 1][0]}`);
    } else if (nameArr && nameArr.length == 1) {
      setInitials(() => `${nameArr[0][0]}`);
    } else {
      setInitials(" ");
    }
  }, [authState.name]);

  useEffect(() => {
    if (authState.isLoggedIn) {
      userInitials();
    }
  }, []);

  const handleClick = useCallback(() => {
    console.log("click in UserSettingIcon!");
  }, []);

  return (
    <button className={styles.btn} onClick={handleClick}>
      {initials}
    </button>
  );
};

export default UserSettingsIcon;
//<p className={styles["btn__text"]}>{initials}</p>{/*  */}
