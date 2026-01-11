import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./styles/theme.ts";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <ToastProvider>
          <CssBaseline />
          <App />
        </ToastProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>
);
