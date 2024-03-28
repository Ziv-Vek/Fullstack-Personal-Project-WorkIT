import classes from "./signUp.module.scss";
import TopNavBar from "../../components/topNavBar/TopNavBar";
import FormBox from "../../components/formBox/FormBox";
import SignUpForm, {
  SignupFormData,
} from "../../components/signUpForm/SignUpForm";
import { useCallback, useContext } from "react";
import { axiosClient } from "../../utils/apiClient";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const navigate = useNavigate();

  const signUpUser = useCallback(
    async (signupData: SignupFormData): Promise<void> => {
      console.log("sign up user in client");

      try {
        const body = {
          name: signupData.fullname,
          email: signupData.email,
          password: signupData.password,
        };

        await axiosClient.put(`/signup`, body);
        alert("You registered successfully! please log-in to continue");

        await new Promise((res) => setTimeout(res, 200));
        navigate("/");
      } catch (error) {
        console.log("Error during signup, error: " + JSON.stringify(error));
      }
    },
    [navigate]
  );

  return (
    <>
      <TopNavBar
        textBeforeBtn={"Already have a user at TaskIT?"}
        btnInnerText="Login"
        btnUrlRoute="/login"
      />
      <div className={classes.container}>
        <FormBox>
          <SignUpForm
            formHeader={"Let's be productive!"}
            signUpUser={signUpUser}
          />
        </FormBox>
      </div>
    </>
  );
}

export default SignUp;
