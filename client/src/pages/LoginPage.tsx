import React from "react";
import { Container, Paper, Typography, Box, Link } from "@mui/material";
import LoginForm from "../components/auth/LoginForm";
import { Link as RouterLink } from "react-router-dom";

const LoginPage: React.FC = () => {
  return (
    <Container maxWidth="sm">
      <Paper sx={{ p: 3, mt: 6 }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Sign in
        </Typography>
        <LoginForm />
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2">
            Don't have an account?{" "}
            <Link component={RouterLink} to="/signup">
              Sign up
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default LoginPage;
