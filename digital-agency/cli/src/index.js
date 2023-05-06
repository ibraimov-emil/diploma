import React, { createContext } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import UserStore from "./store/UserStore";
import DeviceStore from "./store/DeviceStore";
import { ContextProvider } from "./contexts/ContextProvider";
import { AuthContextProvider } from "./contexts/authContext";
// export const Context = createContext(null);

const root = createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <ContextProvider
      // value={{
      //   device: new DeviceStore(),
      // }}
    >
      <App />
    </ContextProvider>
  </AuthContextProvider>
);
