import { createContext } from "react";
import UserStore from "../store/UserStore";

export const AuthContext = createContext(null);

export const AuthContextProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{ user: new UserStore() }}>
      {children}
    </AuthContext.Provider>
  );
};
