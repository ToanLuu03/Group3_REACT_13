import { Form } from "antd";
import styled from "styled-components";

export const LoginContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`;

export const TitleStyled = styled.h1``;

export const TitleScreenStyled = styled.h2``;

export const ImageStyled = styled.img`
  width: 400px;
  height: 400px;
`;

export const ErrorMessage = styled.p`
  color: red;
`;

export const FormStyled = styled(Form)`
  width: 80%;

  :last-child {
    display: flex;
    justify-content: center;
  }
`;
