import { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Menu,
  MenuItem,
  ListItemText,
  ListItemIcon,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";

import {
  ExpandMore,
  ExpandLess,
  ContentCut,
  DeleteForever,
  Cloud,
  ContentCopy,
  ContentPaste,
  AddCard,
  DragHandle,
} from "@mui/icons-material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import ListCards from "./ListCards/ListCards";
import { mapOrder } from "~/utils/sorts";

const Column = ({ column }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column._id, data: { ...column } });

  /*
    transform: CSS.Transform.toString(transform)
    Nếu dùng Transform sẽ bị lỗi scale do thuộc tính transform
    
=>  transform: CSS.Translate.toString(transform)
    Translate sẽ bỏ qua scale
  */
  const dndKitColumnStyle = {
    // touchAction: "none"
    transform: CSS.Translate.toString(transform),
    transition,
    // chiều cao phải luôn max 100% vì nếu không sẽ bị lỗi (chồng chất) lúc kéo column ngắn qua 1 column dài.
    // kết hợp {...listeners} nằm ở Box chứ không phải ở div ngoài cùng để tránh trường hợp kéo vào vùng xanh
    height: "100%",
    // làm mờ phần tử
    opacity: isDragging ? 0.5 : undefined,
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    // nếu chiều cao các column khác nhau sẽ bị bug chồng chất, cho nên thêm thẻ div vào sẽ fix được chiều cao của các column
    <div ref={setNodeRef} style={dndKitColumnStyle} {...attributes}>
      <Box
        {...listeners}
        sx={{
          minWidth: "300px",
          maxWidth: "300px",
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#333643" : "#ebecf9",
          ml: 2,
          borderRadius: "6px",
          height: "fit-content",
          maxHeight: (theme) =>
            `calc(${theme.var.boardContentHeight} - ${theme.spacing(5)})`,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            height: (theme) => theme.var.columnHeaderHeight,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontSize: "1.1rem", fontWeight: "bold", cursor: "pointer" }}
          >
            {column.title || "Need a title"}
          </Typography>
          <Box>
            <Tooltip title="More options">
              <IconButton
                id="basic-column-dropdown"
                aria-controls={open ? "basic-menu-column-dropdown" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                sx={{ color: "text.primary" }}
              >
                {open ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Tooltip>
            <Menu
              id="basic-menu-column-dropdown"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              slotProps={{
                list: {
                  "aria-labelledby": "basic-column-dropdown",
                },
              }}
            >
              <MenuItem>
                <ListItemIcon>
                  <AddCard fontSize="small" />
                </ListItemIcon>
                <ListItemText>Add new card</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCut fontSize="small" />
                </ListItemIcon>
                <ListItemText>Cut</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentCopy fontSize="small" />
                </ListItemIcon>
                <ListItemText>Copy</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <ContentPaste fontSize="small" />
                </ListItemIcon>
                <ListItemText>Paste</ListItemText>
              </MenuItem>
              <Divider />
              <MenuItem>
                <ListItemIcon>
                  <DeleteForever fontSize="small" />
                </ListItemIcon>
                <ListItemText>Romove this column</ListItemText>
              </MenuItem>
              <MenuItem>
                <ListItemIcon>
                  <Cloud fontSize="small" />
                </ListItemIcon>
                <ListItemText>Archive this column</ListItemText>
              </MenuItem>
            </Menu>
          </Box>
        </Box>

        {/* Listcards */}
        <ListCards
          cards={mapOrder(column?.cards, column?.cardOrderIds, "_id")}
        />

        {/* Footer */}
        <Box
          sx={{
            height: (theme) => theme.var.columnFooterHeight,
            p: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Button startIcon={<AddCard />}>Add new card</Button>
          <Tooltip title="Drag to move">
            <DragHandle sx={{ cursor: "pointer" }} />
          </Tooltip>
        </Box>
      </Box>
    </div>
  );
};

export default Column;
