import { Card, CardContent, Typography, IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { DreamEntry } from "../../types/DreamEntry";

interface DreamCardProps {
  entry: DreamEntry;
  onEdit?: (entry: DreamEntry) => void;
  onDelete?: (id: number) => void;
}

const DreamCard: React.FC<DreamCardProps> = ({ entry, onEdit, onDelete }) => {
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
        <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="subtitle1" color="primary.main">
              {new Date(entry.date).toLocaleDateString("fi-FI")}
            </Typography>

            {entry.mood && (
              <Typography variant="caption" color="text.secondary">
                Mood: {entry.mood}
              </Typography>
            )}
          </Box>

          <Box>
            {onEdit && (
              <IconButton size="small" onClick={() => onEdit(entry)} aria-label="edit">
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            {onDelete && (
              <IconButton size="small" onClick={() => onDelete(entry.id)} aria-label="delete">
                <DeleteIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        </Box>

        <Typography variant="body2" color="text.primary" sx={{ mt: 1 }}>
          {entry.description}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DreamCard;
