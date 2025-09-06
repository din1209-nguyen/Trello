import { createTheme } from "@mui/material/styles";

const APP_BAR_HEIGHT = "58px";
const BOARD_BAR_HEIGHT = "60px";
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`;
const COLUMN_HEADER_HEIGHT = "50px";
const COLUMN_FOOTER_HEIGHT = "56px";

const theme = createTheme({
  //cssVariables: true, // hệ thống sẽ sinh ra CSS variables vào DOM
  colorSchemeSelector: "class", // quyết định cách MUI gắn CSS variables vào DOM trong class

  var: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT,
  },

  colorSchemes: {
    light: {
      palette: {
        mode: "light",
        primary: { main: "#1976d2" },
        secondary: { main: "#9c27b0" },
      },
    },
    dark: {},
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          "*::-webkit-scrollbar": {
            width: "8px",
            height: "8px",
          },
          "*::-webkit-scrollbar-thumb": {
            backgroundColor: "#dcdde1",
            borderRadius: "8px",
          },
          "*::-webkit-scrollbar-thumb:hover": {
            backgroundColor: "white",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderWidth: "1px",
          "&:hover": {
            outline: "1.5px solid white",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          //  color: theme.palette.primary.main,
          fontSize: "0.875rem",
          // // border of outlinedInput
          // ".MuiOutlinedInput-notchedOutline": {
          //   borderColor: theme.palette.primary.light,
          // },
          // "&:hover": {
          //   ".MuiOutlinedInput-notchedOutline": {
          //     borderColor: theme.palette.primary.main,
          //   },
          // },
          "& fieldset": {
            borderWidth: "1px !important",
          },
          "&:hover fieldset": {
            borderWidth: "2px !important",
          },
          "&.Mui-focused fieldset": {
            borderWidth: "2px !important",
          },
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
    MuiTypography: {
      styleOverrides: {
        root: {
          "&.MuiTypography-body1": {
            fontSize: "0.875rem",
          },
        },
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
