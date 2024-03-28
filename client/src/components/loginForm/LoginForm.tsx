import { validateEmail, validatePassword } from "../../utils/validations";
import React, { useState, FormEvent, ChangeEvent } from "react";
import classes from "./loginForm.module.scss";

export interface LoginFormData {
  email: string;
  password: string;
}

type LoginProps = {
  formHeader: string;
  loginUser: (data: LoginFormData) => void;
};

const LoginForm = ({ formHeader, loginUser: handleLogin }: LoginProps) => {
  const [loginData, setLoginData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  function handleInputChange(eve: ChangeEvent<HTMLInputElement>) {
    const { name, value } = eve.target;

    setLoginData((data) => {
      return { ...data, [name]: value };
    });
  }

  const handleSubmit = (eve: FormEvent<HTMLFormElement>) => {
    eve.preventDefault();

    if (!validateEmail(loginData.email)) {
      console.log("email not valid");
      return;
    }

    if (!validatePassword(loginData.password)) {
      console.log("password not valid");
      return;
    }

    handleLogin(loginData);
  };

  return (
    <div className={classes.container}>
      <p className={classes.header}>{formHeader}</p>
      <form onSubmit={handleSubmit} className={classes.form}>
        <p className={classes["form__field-header"]}>Email</p>
        <input
          name="email"
          type="text"
          placeholder="example@site.com"
          value={loginData.email}
          onChange={handleInputChange}
          required
          className={classes["form__field-input"]}
        />
        <p className={classes["form__field-header"]}>Password</p>
        <input
          name="password"
          type="password"
          placeholder="Minimum 5 characters"
          value={loginData.password}
          onChange={handleInputChange}
          required
          className={classes["form__field-input"]}
        />
        <button type="submit" className={classes["form__button"]}>
          Login to WorkIT
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
