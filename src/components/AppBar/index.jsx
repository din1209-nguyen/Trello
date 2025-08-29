import { Box } from "@mui/material";
import SvgIcon from "@mui/material/SvgIcon";
import AppsIcon from "@mui/icons-material/Apps";
import ThemeMode from "../ThemeMode";
import { ReactComponent as TrelloIcon } from "~/assets/svgs/trello.svg";

const AppBar = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignContent: "center",
        width: "100%",
        height: (theme) => theme.var.appBarHeight,
      }}
    >
      <Box>
        <AppsIcon sx={{ color: "primary.main" }} />
        <SvgIcon component={TrelloIcon} inheritViewBox />
      </Box>
      <Box>
        <ThemeMode />
      </Box>
    </Box>
  );
};

export default AppBar;
