import { Box, Button } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import Column from "./Column/Column";

const ListColumns = () => {
  return (
    <Box
      sx={{
        bgcolor: "inherit",
        width: "100%",
        height: "100%",
        display: "flex",
        overflowX: "auto",
        overflowY: "hidden",
        "&::-webkit-scrollbar-track": { m: 2 },
      }}
    >
      <Column />
      <Column />
      {/* Box Add New */}
      <Box
        sx={{
          minWidth: "200px",
          maxWidth: "200px",
          height: "fit-content",
          mx: 2,
          borderRadius: "6px",
          bgcolor: "#ffffff3d",
        }}
      >
        <Button
          sx={{
            color: "white",
            width: "100%",
            justifyContent: "flex-start",
            py: "1",
            pl: "2.5",
          }}
          startIcon={<NoteAddIcon />}
        >
          Add new column
        </Button>
      </Box>
    </Box>
  );
};

export default ListColumns;
