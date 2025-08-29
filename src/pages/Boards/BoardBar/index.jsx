import { Box } from "@mui/material";

const BoardBar = () => {
  return (
    <Box
      sx={{
        backgroundColor: "primary.dark",
        width: "100%",
        height: (theme) => theme.var.boardBarHeight,
        display: "flex",
        alignContent: "center",
      }}
    >
      Boar Bar
    </Box>
  );
};

export default BoardBar;
