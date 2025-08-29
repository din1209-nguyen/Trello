import { Box } from "@mui/material";
import ThemeMode from "../ThemeMode";

const AppBar = () => {
  return (
    <Box
      sx={{
        backgroundColor: "primary.light",
        width: "100%",
        height: (theme) => theme.var.appBarHeight,
        display: "flex",
        alignContent: "center",
      }}
    >
      <ThemeMode />
    </Box>
  );
};

export default AppBar;
