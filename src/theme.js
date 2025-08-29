import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  cssVariables: true, // hệ thống sẽ sinh ra CSS variables vào DOM
  colorSchemeSelector: "class", // quyết định cách MUI gắn CSS variables vào DOM trong class

  var: {
    appBarHeight: "48px",
    boardBarHeight: "58px",
  },

  colorSchemes: {
    light: {
      palette: {
        primary: { main: "#1976d2" },
        secondary: { main: "#9c27b0" },
      },
    },
    dark: {
      palette: {
        primary: { main: "#90caf9" },
        secondary: { main: "#ce93d8" },
      },
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    h1: {
      fontSize: "2rem",
      fontWeight: 700,
    },
  },
});

export default theme;
