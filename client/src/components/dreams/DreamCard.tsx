import { Card, CardContent, Typography } from "@mui/material";
import type { DreamEntry } from "../../types/DreamEntry";

interface DreamCardProps {
  entry: DreamEntry;
}

const DreamCard: React.FC<DreamCardProps> = ({ entry }) => {
  return (
    <Card
      elevation={2}
      sx={{
        maxWidth: "600px",
        background: "rgba(255, 255, 255, 0.02)",
        borderRadius: 2,
        border: "1px solid rgba(255, 255, 255, 0.06)",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Typography variant="subtitle1" color="primary.main">
          {new Date(entry.date).toLocaleDateString("fi-FI")}
        </Typography>

        {entry.mood && (
          <Typography variant="caption" color="text.secondary">
            Mood: {entry.mood}
          </Typography>
        )}
        <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
          {entry.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DreamCard;
