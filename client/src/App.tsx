import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import DreamsPage from "./pages/DreamsPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/dreams" replace />} />
      <Route path="/dreams" element={<DreamsPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
    </Routes>
  </BrowserRouter>
);

export default App;
