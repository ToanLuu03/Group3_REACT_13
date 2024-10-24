import { Provider } from "react-redux";
import { store } from "./redux/store";
import { RouterProvider } from "react-router-dom";
import { router } from "./routers/routers";

const App = () => {
  return (
    <Provider store={store}>
      {/* RouterProvider bao bọc toàn bộ ứng dụng */}
      <RouterProvider router={router} fallbackElement={<div>Loading...</div>} />
    </Provider>
  );
};

export default App;
