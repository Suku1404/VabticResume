import React, { useState } from "react";
import { Mail, Lock, User, Sparkles } from "lucide-react";
import { Button, Card, Input } from "../components/common";
import { playSoftSound } from "./sound";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Register = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    
    // Email regex
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailReg.test(email)) {
      const errMsg = "Please enter a valid email address!";
      setError(errMsg);
      toast.error(errMsg);
      return;
    }
    setError("");

    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/user/register",
        { name, email, password },
        { withCredentials: true }
      );

      // Save token in localStorage
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }

      toast.success("Account created successfully!");

      // Check if there's a redirect template or AI redirect stored
      const redirectAI = localStorage.getItem("redirectAI");
      const redirectTemplate = localStorage.getItem("redirectTemplate");
      if (redirectAI) {
        localStorage.removeItem("redirectAI");
        navigate("/ai-resume-improve");
      } else if (redirectTemplate) {
        localStorage.removeItem("redirectTemplate");
        navigate(`/builder/${redirectTemplate}`);
      } else {
        navigate("/dashboard");
      }
    } catch (err: any) {
      console.log("Error Response:", err.response?.data);
      const errMsg = err.response?.data?.message || "Registration failed. Try again.";
      setError(errMsg);
      toast.error(errMsg);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-indigo-50 to-violet-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-6 py-16 text-slate-950 dark:text-white transition-colors duration-300">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
        <div>
          <div className="mb-6 inline-flex rounded-2xl bg-indigo-600 p-3 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles />
          </div>

          <h1 className="text-5xl font-black leading-tight text-gray-950 dark:text-white">
            Start your resume journey with a beautiful account setup.
          </h1>

          <p className="mt-5 text-gray-600 dark:text-gray-300">
            Create your profile once and generate multiple professional resumes
            for internships, jobs, and tech roles.
          </p>
        </div>

        <Card>
          <div className="flex gap-2 pb-2">
            <p className="text-md font-bold text-gray-700 dark:text-gray-300 font-bold">Already have an account?</p>
            <Link
              className="text-indigo-600 dark:text-indigo-400 font-bold text-md underline"
              to="/user/login"
            >
              Login
            </Link>
          </div>
          <Card.Title>Create Account</Card.Title>

          <Card.Description>
            Simple, fast, and beginner-friendly registration.
          </Card.Description>

          <form className="form" onSubmit={handleSubmit}>
            <div className="mt-6 space-y-5">
              <Input
                label="Name"
                name="name"
                placeholder="John Doe"
                leftIcon={<User size={18} />}
                required
              />

              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail size={18} />}
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Create password"
                leftIcon={<Lock size={18} />}
                required
              />

              <Button
                fullWidth
                type="submit"
                onClick={() => playSoftSound("success")}
              >
                Create Account
              </Button>
              {error && (
                <p className="text-red-500 dark:text-red-400 mt-2 text-sm font-semibold">
                  {error}
                </p>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
