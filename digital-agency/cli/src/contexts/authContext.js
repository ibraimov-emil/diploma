import { createContext } from "react";
import UserStore from "../store/UserStore";

export const user = new UserStore();
export const AuthContext = createContext(user);

export const AuthContextProvider = ({ children }) => {
  return (
    <AuthContext.Provider value={{ user }}>
      {children}
    </AuthContext.Provider>
  );
};
