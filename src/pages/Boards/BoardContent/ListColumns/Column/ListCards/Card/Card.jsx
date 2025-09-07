import {
  Typography,
  Button,
  Card as MuiCard,
  CardActions,
  CardContent,
  CardMedia,
} from "@mui/material";

import { Group, Comment, Attachment } from "@mui/icons-material";

const Card = ({ card }) => {

  const showCardAction = () => {
    return (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.attachments?.length
    );
  };

  return (
    <MuiCard
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
