import formatDate from "../../../../utils/formatDate";
import {
  DatetimeStyled,
  QuestionItemContainerStyled,
  ShowButtonStyled,
  TitleStyled,
} from "./QuestionItem.styled";

const QuestionItem = ({ id, author, timestamp, onClick }) => {
  return (
    <QuestionItemContainerStyled
      actions={[
        <ShowButtonStyled
          type="primary"
          ghost
          onClick={(e) => {
            e.preventDefault();
            onClick?.(id);
          }}
        >
          Show
        </ShowButtonStyled>,
      ]}
    >
      <TitleStyled>{author}</TitleStyled>
      <DatetimeStyled>{formatDate(timestamp)}</DatetimeStyled>
    </QuestionItemContainerStyled>
  );
};

export default QuestionItem;
