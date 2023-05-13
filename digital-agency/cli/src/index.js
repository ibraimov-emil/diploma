import React, { createContext } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
// import "bootstrap/dist/css/bootstrap.min.css";
import UserStore from "./store/UserStore";
import DeviceStore from "./store/DeviceStore";
import { ContextProvider } from "./contexts/ContextProvider";
import { AuthContextProvider } from "./contexts/authContext";
import {QueryClient, QueryClientProvider} from "react-query";
// export const Context = createContext(null);
const queryClient = new QueryClient()

const root = createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <ContextProvider
      // value={{
      //   device: new DeviceStore(),
      // }}
    >
        <QueryClientProvider client={queryClient}>
      <App />
        </QueryClientProvider>
    </ContextProvider>
  </AuthContextProvider>
);
