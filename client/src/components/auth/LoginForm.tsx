import React, { useState } from "react";
import { Box, TextField, Button, Alert } from "@mui/material";
import type { UserLoginData } from "../../types/User";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<UserLoginData>({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(form);
      navigate("/dreams");
    } catch (err: any) {
      setError(
        JSON.stringify(err?.response?.data) ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "grid", gap: 2 }}
    >
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        label="Email"
        name="email"
        type="email"
        required
        value={form.email}
        onChange={handleChange}
      />
      <TextField
        label="Password"
        name="password"
        type="password"
        required
        value={form.password}
        onChange={handleChange}
      />
      <Button type="submit" variant="contained" disabled={submitting}>
        {submitting ? "Signing in..." : "Sign In"}
      </Button>
    </Box>
  );
};

export default LoginForm;
