// a component to greet the user, based on the time of day
// and ask if they've had any interesting dreams lately.
import React from "react";
import { Typography, Box } from "@mui/material";

interface GreetingCardProps {
  userName: string;
}
const getGreetingMessage = (hour: number) => {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};

const GreetingCard: React.FC<GreetingCardProps> = ({ userName }) => {
  const greetingMessage = getGreetingMessage(new Date().getHours());

  return (
    <Box sx={{ p: 2, mb: 3 }}>
      <Typography variant="h2">{`${greetingMessage}, ${userName}!`}</Typography>
      <Typography variant="body2" sx={{ mt: 1 }}>
        Have you had any interesting dreams lately?
      </Typography>
    </Box>
  );
};

export default GreetingCard;
