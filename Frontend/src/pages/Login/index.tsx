import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

interface LoginData {
  email: string;
  password: string;
}

const logic = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;

    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const LoginForm: LoginData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/user/login",
        LoginForm,
        { withCredentials: true }
      );

      // Save token to localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      toast.success("Welcome back! Login successful.");

      const redirectAI = localStorage.getItem("redirectAI");
      if (redirectAI) {
        localStorage.removeItem("redirectAI");
        navigate("/ai-resume-improve");
      } else {
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.log("Error res:", error.response?.data);
      const errMsg = error.response?.data?.message || "Invalid email or password.";
      toast.error(errMsg);
    }
  };

  return handleSubmit;
};

export default logic;

