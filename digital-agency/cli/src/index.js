import React, { createContext } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ContextProvider } from "./contexts/ContextProvider";
import { AuthContextProvider } from "./contexts/authContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { SocketContextProvider } from "./contexts/SocketContext";
import {Provider} from "react-redux";
import { store } from "./components/Chats/Redux/store";
const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <SocketContextProvider>
      <ContextProvider>
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
          <App />
            </Provider>
        </QueryClientProvider>
      </ContextProvider>
    </SocketContextProvider>
  </AuthContextProvider>
);
