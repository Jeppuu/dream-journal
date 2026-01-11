import React, { useState } from "react";
import { Box, TextField, Button, Alert } from "@mui/material";
import type { UserSignupData } from "../../types/User";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

const SignupForm: React.FC = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState<UserSignupData>({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setSubmitting(true);
    try {
      //only send needed fields
      const { confirmPassword, ...signupData } = form;
      await signup(signupData);
      navigate("/dreams");
    } catch (err: any) {
      setError(
        JSON.stringify(err?.response?.data) ||
          "Signup failed. Please try again."
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
        label="Username"
        name="username"
        required
        value={form.username}
        onChange={handleChange}
      />
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
      <TextField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        required
        value={form.confirmPassword}
        onChange={handleChange}
      />
      <Button type="submit" variant="contained" disabled={submitting}>
        {submitting ? "Creating account..." : "Create account"}
      </Button>
    </Box>
  );
};

export default SignupForm;
