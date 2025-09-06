import {
  Typography,
  Button,
  Card as MuiCard,
  CardActions,
  CardContent,
  CardMedia,
} from "@mui/material";

import { Group, Comment, Attachment } from "@mui/icons-material";

const Card = () => {
  return (
    <MuiCard
      sx={{
        cursor: "pointer",
        boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
        overflow: "unset",
      }}
    >
      <CardMedia
        sx={{ height: 140 }}
        image="https://media.istockphoto.com/id/1398462062/vi/vec-to/qu%E1%BB%91c-k%E1%BB%B3-vi%E1%BB%87t-nam.jpg?s=612x612&w=0&k=20&c=UwIQA0IbG9RIKAHyiCrckDaLm8qnPOJUbJHkAXcR56c="
        title="green iguana"
      />
      <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
        <Typography>0</Typography>
      </CardContent>
      <CardActions sx={{ p: "0 4px 8px 4px" }}>
        <Button size="small" startIcon={<Group />}>
          20
        </Button>
        <Button size="small" startIcon={<Comment />}>
          Share
        </Button>
        <Button size="small" startIcon={<Attachment />}>
          Share
        </Button>
      </CardActions>
    </MuiCard>
    /* {[...Array(10)].map((_, index) => (
        <MuiCard
          key={index}
          sx={{
            cursor: "pointer",
            boxShadow: "0 1px 1px rgba(0, 0, 0, 0.2)",
            overflow: "unset",
          }}
        >
          <CardContent sx={{ p: 1.5, "&:last-child": { p: 1.5 } }}>
            <Typography>{`Example ${index}`}</Typography>
          </CardContent>
        </MuiCard>
      ))} */
  );
};

export default Card;
