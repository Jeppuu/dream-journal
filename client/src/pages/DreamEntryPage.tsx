import React, { useEffect, useState } from "react";
import axios from "axios";
import type { DreamEntry } from "../types/DreamEntry";
import DreamForm from "../components/DreamForm";
import DreamList from "../components/DreamList";

const DreamEntryPage: React.FC = () => {
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
    <div>
      <h1>Dream Journal</h1>
      <DreamForm onEntryAdded={fetchEntries} />
      <DreamList entries={entries} />
    </div>
  );
};

export default DreamEntryPage;
