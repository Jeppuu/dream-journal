import React, { useEffect, useState } from "react";
import axios from "axios";
import type { DreamEntry } from "../types/DreamEntry";
import GreetingCard from "../components/layout/GreetingCard";
import DreamList from "../components/dreams/DreamList";
import AddDreamDialog from "../components/dreams/AddDreamDialog";
import { Paper, Box } from "@mui/material";

const DreamsPage: React.FC = () => {
  const [entries, setEntries] = useState<DreamEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchEntries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get<DreamEntry[]>("/api/dreamentries");
      setEntries(response.data);
    } catch (error) {
      setError("Failed to fetch dream entries. Please try again later.");
      console.error("Error fetching dream entries:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      <Box className="greeting-row">
        <GreetingCard userName="Dreamer" />
        <div className="greeting-actions">
          <AddDreamDialog onEntryAdded={fetchEntries} />
        </div>
      </Box>
      <DreamList entries={entries} />
    </Paper>
  );
};

export default DreamsPage;
