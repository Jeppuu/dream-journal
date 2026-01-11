import React, { useEffect, useState } from "react";
import axios from "axios";
import type { DreamEntry } from "../types/DreamEntry";
import GreetingCard from "../components/layout/GreetingCard";
import DreamList from "../components/dreams/DreamList";
import AddDreamDialog from "../components/dreams/AddDreamDialog";
import { Paper, Box } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

const DreamsPage: React.FC = () => {
  const [entries, setEntries] = useState<DreamEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, user } = useAuth();

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
        <GreetingCard userName={user?.username ?? "Dreamer"} />
        <div className="greeting-actions">
          {isAuthenticated ? (
            <AddDreamDialog onEntryAdded={fetchEntries} />
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button component={RouterLink} to="/login" variant="outlined">
                Sign in
              </Button>
              <Button component={RouterLink} to="/signup" variant="contained">
                Sign up
              </Button>
            </Box>
          )}
        </div>
      </Box>
      <DreamList entries={entries} />
    </Paper>
  );
};

export default DreamsPage;
