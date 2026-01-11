import React, { useEffect, useState } from "react";
import type { DreamEntry } from "../types/DreamEntry";
import GreetingCard from "../components/layout/GreetingCard";
import DreamList from "../components/dreams/DreamList";
import AddDreamDialog from "../components/dreams/AddDreamDialog";
import { Paper, Box } from "@mui/material";
import { useAuth } from "../hooks/useAuth";
import { Button } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import useDreams from "../hooks/useDreams";
import EditDreamDialog from "../components/dreams/EditDreamDialog";
import { useToast } from "../context/ToastContext";

const DreamsPage: React.FC = () => {
  const { entries, isLoading, error, fetchEntries, addEntry, updateEntry, removeEntry } = useDreams();
  const [editing, setEditing] = useState<null | DreamEntry>(null);
  const { isAuthenticated, user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <Paper elevation={3} sx={{ p: 2, borderRadius: 2 }}>
      <Box className="greeting-row">
        <GreetingCard userName={user?.username ?? "Dreamer"} />
        <div className="greeting-actions">
          {isAuthenticated ? (
            <AddDreamDialog onSave={addEntry} />
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
      <DreamList
        entries={entries}
        onEdit={(entry) => setEditing(entry)}
        onDelete={async (id) => {
          try {
            await removeEntry(id);
            // toast handled by provider via useToast
            // but show a message here
            toast?.({ message: "Entry deleted", severity: "success" });
          } catch (err) {
            console.error(err);
            toast?.({ message: "Failed to delete entry", severity: "error" });
          }
        }}
      />

      {editing && (
        <EditDreamDialog
          entry={editing}
          open={true}
          onClose={() => setEditing(null)}
          onSave={async (id, data) => {
            try {
              await updateEntry(id, data);
              setEditing(null);
              toast?.({ message: "Entry updated", severity: "success" });
            } catch (err) {
              console.error(err);
              toast?.({ message: "Failed to update entry", severity: "error" });
            }
          }}
        />
      )}
    </Paper>
  );
};

export default DreamsPage;
