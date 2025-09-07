import { Box, Button } from "@mui/material";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

import Column from "./Column/Column";

const ListColumns = ({ columns }) => {
  console.log("Render-ListColumns");
  /*
  - SortableContext yêu cầu items là một mảng [id1, id2, id3]
  - Nếu không đúng dạng thì vẫn kéo thả được nhưng không có animation
  */
  return (
    <SortableContext
      items={columns?.map((column) => column._id)}
      strategy={horizontalListSortingStrategy}
    >
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
        {columns?.map((column) => (
          <Column key={column?._id} column={column} />
        ))}
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
    </SortableContext>
  );
};

export default ListColumns;
