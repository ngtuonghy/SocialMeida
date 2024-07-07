import ViewportProvider from "./viewportContext";

const ContextProvider = ({ children }) => {
  return (
    <>
      <ViewportProvider>{children}</ViewportProvider>
    </>
  );
};
export default ContextProvider;
