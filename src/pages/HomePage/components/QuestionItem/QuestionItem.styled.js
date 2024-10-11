import { Button, Card } from "antd";
import styled from "styled-components";

export const QuestionItemContainerStyled = styled(Card)`
  border-radius: 4px;

  .ant-card-actions > li {
    margin: 12px;
  }
  .ant-card-body {
    padding: 0;
    text-align: center;
  }
`;

export const ShowButtonStyled = styled(Button)`
  height: 32px;
  width: 100%;
  border-color: green !important;
  color: green !important;
  border-radius: 4px;
`;

export const TitleStyled = styled.p`
  color: black;
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 0px;
`;

export const DatetimeStyled = styled.p`
  color: gray;
  font-size: 14px;
  margin-top: 0px;
`;
