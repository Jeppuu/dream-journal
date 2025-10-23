import { Card, CardContent, Typography, Box } from "@mui/material";
import type { DreamEntry } from "../types/DreamEntry";

interface DreamCardProps {
  entry: DreamEntry;
}

const DreamCard: React.FC<DreamCardProps> = ({ entry }) => {
  return (
    <Card
      elevation={4}
      sx={{
        background: "linear-gradient(135deg, #1e1e2e 0%, #302d41 100%)",
        borderRadius: 4,
        color: "#f5e0dc",
        p: 1,
        border: "1px solid rgba(255,255,255,0.1",
        transition: "transform 0.2s ease, box-shadow 0.3s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 6px 18px rgba(0,0,0,0.4)",
        },
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ color: "#cba6f7" }}>
          {entry.title}
        </Typography>
        <Typography variant="body2" sx={{ color: "#f5e0dc", mt: 1 }}>
          {entry.description}
        </Typography>
        {entry.mood && (
          <Typography variant="body2" sx={{ mt: 2, color: "#b4befe" }}>
            🌙 Mood: {entry.mood}
          </Typography>
        )}
        <Box sx={{ textAlign: "right", mt: 2 }}>
          <Typography variant="caption" sx={{ color: "#a6adc8" }}>
            {new Date(entry.date).toLocaleDateString("fi-FI")}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default DreamCard;
