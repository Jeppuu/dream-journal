import React from "react";
import { Stack, Typography, Box } from "@mui/material";
import type { DreamEntry } from "../../types/DreamEntry";
import DreamCard from "./DreamCard";

interface DreamListProps {
  entries: DreamEntry[];
  onEdit?: (entry: DreamEntry) => void;
  onDelete?: (id: number) => void;
}

const DreamList: React.FC<DreamListProps> = ({ entries, onEdit, onDelete }) => {
  if (!entries.length)
    return (
      <Typography
        variant="h6"
        color="text.primary"
        gutterBottom
        align="left"
        sx={{
          mt: 4,
          fontWeight: 500,
          opacity: 0.8,
        }}
      >
        No dream entries yet... ✨
      </Typography>
    );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" color="text.primary" gutterBottom align="left">
        Latest Dreams
      </Typography>
      <Stack spacing={2}>
        {entries.map((entry) => (
          <DreamCard key={entry.id} entry={entry} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </Stack>
    </Box>
  );
};

export default DreamList;
