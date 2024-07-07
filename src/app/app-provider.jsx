import { Provider } from "react-redux";
import ContextProvider from "~/context";
import { store } from "~/store";
export const AppProvider = ({ children }) => {
  return (
    <ContextProvider>
      <Provider store={store}>{children}</Provider>
    </ContextProvider>
  );
};
