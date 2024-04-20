import { createContext, useContext } from "react";

const GlobalContext = createContext({
  name: "",
  setName: () => {}
});

export const useGlobalContext = () => useContext(GlobalContext);

export default GlobalContext;
