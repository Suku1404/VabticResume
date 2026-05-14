import { Mail, Lock, User, Sparkles } from "lucide-react";
import { Button, Card, Input } from "../components/common";
import { playSoftSound } from "./sound";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";
import { useState, type SubmitEvent } from "react";
import axios from "axios";


const Register = () => {
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    // Email reg
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailReg.test(email)){
      setError("Please enter a valid email address!");
      return;
    }
    setError("");
    const password = (form.elements.namedItem("password") as HTMLInputElement)
      .value;

      try {
        await axios.post("http://localhost:3000/api/auth/user/register",
        {
          name,
          email,
          password
        },{
          withCredentials:true
        });

        // Check if there's a redirect template stored
        const redirectTemplate = localStorage.getItem("redirectTemplate");
        if (redirectTemplate) {
          localStorage.removeItem("redirectTemplate");
          navigate(`/builder/${redirectTemplate}`);
        } else {
          navigate("/dashboard");
        }
        
      } catch (err:any) {
        console.log("Error Response:", err.response?.data)
      }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-white via-indigo-50 to-violet-100 px-6 py-16">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
        <div>
          <div className="mb-6 inline-flex rounded-2xl bg-indigo-600 p-3 text-white shadow-lg">
            <Sparkles />
          </div>

          <h1 className="text-5xl font-black leading-tight text-gray-950">
            Start your resume journey with a beautiful account setup.
          </h1>

          <p className="mt-5 text-gray-600">
            Create your profile once and generate multiple professional resumes
            for internships, jobs, and tech roles.
          </p>
        </div>

        <Card>
          <div className="flex gap-2 pb-2 ">
            <p className="text-md font-bold">Already have an account?</p>
            <Link
              className="text-blue-700 font-bold text-md underline"
              to="/user/login"
            >
              Login{" "}
            </Link>
          </div>
          <Card.Title>Create Account</Card.Title>

          <Card.Description>
            Simple, fast, and beginner-friendly registration.
          </Card.Description>
            <form className="form" onSubmit={handleSubmit}>
          <div className="mt-6 space-y-5">
            <Input
              label="name"
              placeholder="John doe"
              leftIcon={<User size={18} />}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={18} />}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create password"
              leftIcon={<Lock size={18} />}
            />

            <Button
              fullWidth
              type={"submit"}
              onClick={() => playSoftSound("success")}
            >
              Create Account
            </Button>
            {
              error && (
                <p className="text-red-500 mt-2">
                  {error}
                </p>
              )
            }
          </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Register;
