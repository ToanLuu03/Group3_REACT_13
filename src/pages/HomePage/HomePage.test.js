import HomePage from "./HomePage";
import { renderWithProviders } from "../../utils/test-utils";
/**
 * @jest-environment jsdom
 */
describe("Home", () => {
  it("render home", async () => {
    const { container } = renderWithProviders(<HomePage />);
    expect(container).toBeDefined();
    expect(container).toMatchSnapshot();
  });
});
