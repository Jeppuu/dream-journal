import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#c6a0f6", // laventeli
    },
    secondary: {
      main: "#8aadf4", // sinertävä yö
    },
    background: {
      default: "#24273a", // Catppuccin Macchiato base
      paper: "#20223aff",
    },
    text: {
      primary: "#cad3f5",
      secondary: "#b8c0e0",
    },
  },
  typography: {
    fontFamily: "'Nunito', 'Roboto', sans-serif",
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "uppercase",
          width: "90%",
        },
      },
    },
  },
});

export default theme;
