import classes from "./login.module.scss";
import TopNavBar from "../../components/topNavBar/TopNavBar";
import FormBox from "../../components/formBox/FormBox";
import LoginForm, { LoginFormData } from "../../components/loginForm/LoginForm";
import { useCallback, useContext } from "react";
import { axiosClient } from "../../utils/apiClient";
import { useNavigate } from "react-router-dom";
import { AuthContext, getUserDataFromToken } from "../../contexts/AuthProvider";

function Login() {
  const { state: authState, dispatch: dispatchAuth } = useContext(AuthContext);

  const navigate = useNavigate(); 

  async function loginUser(submittedData: LoginFormData) {
    try {
      const res = await axiosClient.post("/login", {
        email: submittedData.email,
        password: submittedData.password,
      });
      if (res.status == 200) {
        const accessToken = res.data?.accessToken;
        const refreshToken = res.data?.refreshToken;

        window.localStorage.setItem("accessToken", accessToken);
        window.localStorage.setItem("refreshToken", refreshToken);
        dispatchAuth(getUserDataFromToken(accessToken));
        navigate("/space");
      }
    } catch (error) {
      alert("Login error: " + JSON.stringify(error));
    }
  }

  return (
    <>
      <TopNavBar
        textBeforeBtn={"Don't have an account in TaskIT?"}
        btnInnerText="Sign up"
        btnUrlRoute="/sign-up"
      />
      <div className={classes.container}>
        <FormBox>
          <LoginForm
            formHeader={"One more step to productivity!"}
            loginUser={loginUser}
          />
        </FormBox>
      </div>
    </>
  );
}

export default Login;
