import { Card } from "antd";
import styled from "styled-components";

export const HomeContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
`;

export const CardStyled = styled(Card)`
  border-radius: 4px;
  width: 80%;
`;
