import React from "react";
import { Container, Paper, Typography, Box, Link } from "@mui/material";
import SignupForm from "../components/auth/SignupForm";
import { Link as RouterLink } from "react-router-dom";

const SignupPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 6 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Create account
        </Typography>
        <SignupForm />
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            Already have an account?{" "}
            <Link component={RouterLink} to="/login">
              Sign in
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignupPage;
