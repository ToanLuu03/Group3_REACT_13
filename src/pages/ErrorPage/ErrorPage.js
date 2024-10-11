import { ErrorPageContainerStyled } from "./ErrorPage.styled";

const ErrorPage = () => {
  return (
    <ErrorPageContainerStyled
      status="404"
      title="404"
      subTitle="Sorry, the page you visited does not exist."
      style={{ alignItems: "center", justifyContent: "center" }}
    />
  );
};

export default ErrorPage;
