import React from "react";
import { Stack, Typography, Box } from "@mui/material";
import type { DreamEntry } from "../types/DreamEntry";
import DreamCard from "./DreamCard";

interface DreamListProps {
  entries: DreamEntry[];
}

const DreamList: React.FC<DreamListProps> = ({ entries }) => {
  if (!entries.length)
    return (
      <Typography sx={{ mt: 4, color: "#a6adc8" }}>
        No dream entries yet... ✨
      </Typography>
    );

  return (
    <Box sx={{ mt: 4 }}>
      <Stack spacing={3}>
        {entries.map((entry) => (
          <DreamCard key={entry.id} entry={entry} />
        ))}
      </Stack>
    </Box>
  );
};

export default DreamList;
