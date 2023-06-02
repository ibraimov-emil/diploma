import React, { createContext } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { ContextProvider } from "./contexts/ContextProvider";
import { AuthContextProvider } from "./contexts/authContext";
import { QueryClient, QueryClientProvider } from "react-query";
import { SocketContextProvider } from "./contexts/SocketContext";
const queryClient = new QueryClient();

const root = createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <SocketContextProvider>
      <ContextProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ContextProvider>
    </SocketContextProvider>
  </AuthContextProvider>
);
