import LoginPage from "./LoginPage";
import { renderWithProviders } from "../../utils/test-utils";
import { fireEvent, waitFor } from "@testing-library/react";

describe("Login", () => {
  it("render login", async () => {
    const { container } = renderWithProviders(<LoginPage />);
    expect(container).toBeDefined();
    expect(container).toMatchSnapshot();
  });

  it("validation login form", async () => {
    const { getByRole, getByText } = renderWithProviders(<LoginPage />);
    const submitButton = getByRole("button", { name: /Submit/i });
    fireEvent.submit(submitButton);
    await waitFor(() => {
      const userError = getByText(/Please enter your User!/i);
      const passwordError = getByText(/Please enter your Password!/i);
      expect(userError).toBeTruthy();
      expect(passwordError).toBeTruthy();
    });
  });

  it("show errormessage when the username field is empty", async () => {
    const { getByRole, findByText, getByPlaceholderText } = renderWithProviders(
      <LoginPage />
    );

    const password = getByPlaceholderText(/Password/i);
    const submitButton = getByRole("button", { name: /Submit/i });

    fireEvent.change(password, { target: { value: "testusernamewrong" } });
    fireEvent.submit(submitButton);

    const errorMessage = await findByText("Please enter your User!");
    expect(errorMessage).toBeTruthy();
  });

  it("show errormessage when the password field is empty", async () => {
    const { getByRole, findByText, getByPlaceholderText } = renderWithProviders(
      <LoginPage />
    );

    const username = getByPlaceholderText(/User/i);
    const submitButton = getByRole("button", { name: /Submit/i });

    fireEvent.change(username, { target: { value: "testuserwrong" } });
    fireEvent.submit(submitButton);

    const errorMessage = await findByText("Please enter your Password!");
    expect(errorMessage).toBeTruthy();
  });
});
