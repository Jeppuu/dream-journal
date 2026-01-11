import React, { createContext, useContext, useState } from "react";
import { Snackbar, Alert, type AlertColor } from "@mui/material";

type ToastOptions = {
  message: string;
  severity?: AlertColor;
  duration?: number;
};

const ToastContext = createContext<(opts: ToastOptions) => void>(() => {});

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor | undefined>(undefined);
  const [duration, setDuration] = useState(3000);

  const showToast = ({ message, severity = "info", duration = 3000 }: ToastOptions) => {
    setMessage(message);
    setSeverity(severity);
    setDuration(duration);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  return (
    <ToastContext.Provider value={showToast}>
      {children}
      <Snackbar open={open} autoHideDuration={duration} onClose={handleClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
        <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </ToastContext.Provider>
  );
};

export const useToast = () => useContext(ToastContext);

export default ToastContext;
