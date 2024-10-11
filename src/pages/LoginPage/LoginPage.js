import React from "react";
import {
  ErrorMessage,
  FormStyled,
  ImageStyled,
  LoginContainerStyled,
  TitleScreenStyled,
  TitleStyled,
} from "./LoginPage.styled";
import { IMAGES } from "../../assets";
import { Button, Form, Input } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { authActions } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { PATH_NAME } from "../../constants/pathName";
import Loading from "../../components/Loading/Loading";

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, errorMessage } = useSelector((state) => state.auth);

  const onFinish = (values) => {
    const payload = {
      username: values.username,
      password: values.password,
    };
    dispatch(
      authActions.handleLogin({
        data: payload,
        onSuccess: () => {
          navigate(PATH_NAME.HOME, { replace: true });
        },
      })
    );
  };

  return (
    <LoginContainerStyled>
      <Loading isLoading={loading} />
      <TitleStyled>Employee Polls</TitleStyled>
      <ImageStyled src={IMAGES.LoginLogo} alt="logo"></ImageStyled>
      <TitleScreenStyled>Login</TitleScreenStyled>
      <FormStyled
        name="login_employee_form"
        onFinish={onFinish}
        onChange={() => {
          if (errorMessage) {
            dispatch(authActions.resetErrorMessage());
          }
        }}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please enter your User!" }]}
          // initialValue={"sarahedo"}
        >
          <Input placeholder="User" />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{ required: true, message: "Please enter your Password!" }]}
          // initialValue={"password123"}
        >
          <Input type="password" placeholder="Password" />
        </Form.Item>
        {errorMessage ? (
          <Form.Item>
            <ErrorMessage>{errorMessage}</ErrorMessage>
          </Form.Item>
        ) : null}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </FormStyled>
    </LoginContainerStyled>
  );
};

export default LoginPage;
