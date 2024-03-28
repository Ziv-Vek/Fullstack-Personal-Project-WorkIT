import {
  validateEmail,
  validatePassword,
  validateFullName,
} from "../../utils/validations";
import React, { useState, FormEvent, ChangeEvent } from "react";
import classes from "./signUpForm.module.scss";

export interface SignupFormData {
  fullname: string;
  email: string;
  password: string;
}

type SignupFormProps = {
  formHeader: string;
  signUpUser: (data: SignupFormData) => void;
};

const SignUpForm = ({
  formHeader,
  signUpUser: handleSignUp,
}: SignupFormProps) => {
  const [signupData, setSignupData] = useState<SignupFormData>({
    fullname: "",
    email: "",
    password: "",
  });

  function handleInputChange(eve: ChangeEvent<HTMLInputElement>) {
    const { name, value } = eve.target;

    setSignupData((data) => {
      return { ...data, [name]: value };
    });
  }

  const handleSubmit = (eve: FormEvent<HTMLFormElement>) => {
    eve.preventDefault();

    if (!validateEmail(signupData.email)) {
      console.log("email not valid");
      return;
    }

    if (!validatePassword(signupData.password)) {
      console.log("password not valid");
      return;
    }

    if (!validateFullName(signupData.fullname)) {
      console.log("Full name not valid");
      return;
    }

    handleSignUp(signupData);
  };

  return (
    <div className={classes.container}>
      <p className={classes.header}>{formHeader}</p>
      <form onSubmit={handleSubmit} className={classes.form}>
        <p className={classes["form__field-header"]}>Full Name</p>
        <input
          name="fullname"
          type="text"
          placeholder="John Doe"
          value={signupData.fullname}
          onChange={handleInputChange}
          required 
          className={classes["form__field-input"]}
        />
        <p className={classes["form__field-header"]}>Email</p>
        <input
          name="email"
          type="text"
          placeholder="example@site.com"
          value={signupData.email}
          onChange={handleInputChange}
          required
          className={classes["form__field-input"]}
        />
        <p className={classes["form__field-header"]}>Password</p>
        <input
          name="password"
          type="password"
          placeholder="Minimum 5 characters"
          value={signupData.password}
          onChange={handleInputChange}
          required
          className={classes["form__field-input"]}
        />
        <button type="submit" className={classes['form__button']}>Start with WorkIT</button>
      </form>
    </div>
  );
};

export default SignUpForm;
