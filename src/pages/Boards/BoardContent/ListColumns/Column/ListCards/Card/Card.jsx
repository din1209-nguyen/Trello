import {
  Typography,
  Button,
  Card as MuiCard,
  CardActions,
  CardContent,
  CardMedia,
} from "@mui/material";

import { Group, Comment, Attachment } from "@mui/icons-material";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const Card = ({ card }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card._id, data: { ...card } });

  /*
      transform: CSS.Transform.toString(transform)
      Nếu dùng Transform sẽ bị lỗi scale do thuộc tính transform
      
  =>  transform: CSS.Translate.toString(transform)
      Translate sẽ bỏ qua scale
    */
  const dndKitCardStyle = {
    // touchAction: "none"
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? "1px solid #2ecc71" : undefined,
  };

  const showCardAction = () => {
    return (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.attachments?.length
    );
  };

  return (
    <MuiCard
      ref={setNodeRef}
      style={dndKitCardStyle}
      {...attributes}
      {...listeners}
      sx={{
        cursor: "pointer",
        boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
        overflow: "unset",
      }}
    >
      {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}

      <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
        <Typography>{card?.title}</Typography>
      </CardContent>

      {showCardAction() && (
        <CardActions sx={{ p: "0 4px 8px 4px" }}>
          <Button size="small" startIcon={<Group />}>
            {card?.memberIds?.length}
          </Button>
          <Button size="small" startIcon={<Comment />}>
            {card?.comments?.length}
          </Button>
          <Button size="small" startIcon={<Attachment />}>
            {card?.attachments?.length}
          </Button>
        </CardActions>
      )}
    </MuiCard>
  );
};

export default Card;
