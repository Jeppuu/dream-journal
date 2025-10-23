import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import type { DreamEntry } from "../types/DreamEntry";
import axios from "axios";

interface DreamFormProps {
  onEntryAdded: () => void;
}

const DreamForm: React.FC<DreamFormProps> = ({ onEntryAdded }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    mood: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddEntry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;

    const newEntry: DreamEntry = {
      id: 0,
      date: new Date().toISOString(),
      ...formData,
    };

    setIsSubmitting(true);
    try {
      await axios.post("/api/dreamentries", newEntry);
      setFormData({ title: "", description: "", mood: "" });
      onEntryAdded();
    } catch (err) {
      console.error("Error adding dream entry:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        p: 3,
        mt: 4,
        backgroundColor: "background.paper",
        borderRadius: 4,
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, color: "text.primary" }}>
        Add new dream entry 🌙
      </Typography>

      <Box component="form" onSubmit={handleAddEntry}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            name="title"
            variant="outlined"
            value={formData.title}
            onChange={handleInputChange}
            fullWidth
            required
          />

          <TextField
            label="Description"
            name="description"
            variant="outlined"
            multiline
            minRows={3}
            value={formData.description}
            onChange={handleInputChange}
            fullWidth
            required
          />

          <TextField
            label="Mood"
            name="mood"
            variant="outlined"
            value={formData.mood}
            onChange={handleInputChange}
            fullWidth
          />

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{
              alignSelf: "flex-end",
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 3,
            }}
          >
            {isSubmitting ? "Saving..." : "Add Entry"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
};

export default DreamForm;
