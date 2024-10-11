import { Provider } from "react-redux";
import { store } from "./redux/store";
import { RouterProvider } from "react-router-dom";
import { router } from "./routers/routers";

const App = () => {
  return (
    <Provider store={store}>
      <RouterProvider router={router} fallbackElement={< ></>} />
    </Provider>
  );
};

export default App;
