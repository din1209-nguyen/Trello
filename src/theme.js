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
        primary: {
          main: "#3598fbff",
        },
        secondary: { main: "#9c27b0" },
      },
    },
    dark: {
      palette: {
        primary: { main: "#526c81ff" },
        secondary: { main: "#ce93d8" },
      },
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontSize: "0.875rem",
          // border of outlinedInput
          ".MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.primary.light,
          },
          "&:hover": {
            ".MuiOutlinedInput-notchedOutline": {
              borderColor: theme.palette.primary.main,
            },
          },
          // "& fieldset": {
          //   borderWidth: "1px !important"
          // }
        }),
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontSize: "0.875rem",
        }),
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
