import React, { useState } from "react";
import { Box, TextField, Button, Stack } from "@mui/material";
import type { DreamEntry } from "../../types/DreamEntry";
import { useToast } from "../../context/ToastContext";

interface DreamFormProps {
  onSubmit: (entry: Partial<DreamEntry>) => Promise<any>;
  onClose?: () => void;
  initial?: Partial<DreamEntry>;
}

const DreamForm: React.FC<DreamFormProps> = ({ onSubmit, onClose, initial }) => {
  const [formData, setFormData] = useState({
    description: initial?.description ?? "",
    mood: initial?.mood ?? "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const showToast = useToast();

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
    if (!formData.description) return;

    const newEntry: DreamEntry = {
      id: 0,
      date: new Date().toISOString(),
      ...formData,
    };

    setIsSubmitting(true);
    try {
      await onSubmit(newEntry);
      setFormData({ description: "", mood: "" });
      showToast({ message: "Saved", severity: "success" });
      if (onClose) onClose();
    } catch (err) {
      console.error("Error adding dream entry:", err);
      showToast({ message: "Failed to save entry", severity: "error" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleAddEntry} sx={{ mt: 1 }}>
      <Stack spacing={2}>
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

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
          <Button
            type="button"
            onClick={onClose}
            sx={{ mr: 1, textTransform: "none" }}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={isSubmitting}
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              borderRadius: 3,
            }}
          >
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default DreamForm;
