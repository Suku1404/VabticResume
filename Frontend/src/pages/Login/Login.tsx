import { Mail, Lock, Sparkles } from "lucide-react";
import { Button, Card, Input } from "../../components/common";
import { playSoftSound } from "../sound";
import { Link, useNavigate } from 'react-router-dom';
import Logic from "./index";
import { useState } from "react";



const Login = () => {
 

  const handleSubmit = Logic();
  
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-indigo-950 to-violet-950 px-6 py-16 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
        <div>
          <div className="mb-6 inline-flex rounded-2xl bg-white/10 p-3">
            <Sparkles />
          </div>

          <h1 className="text-5xl font-black leading-tight">
            Welcome back to your premium resume workspace.
          </h1>

          <p className="mt-5 text-gray-300">
            Continue building powerful, ATS-friendly resumes with beautiful templates and smart suggestions.
          </p>
        </div>

        <Card className="border-white/10 bg-white/10 backdrop-blur-xl">
        <div className="flex gap-2 pb-2">
          <p className="text-md text-gray-400">Don't have an account?</p>
          <Link to='/user/register' className="text-md text-blue-600 font-bold underline">Register</Link>
        </div>
          <Card.Title className="text-white">Login</Card.Title>
          <Card.Description className="text-gray-300">
            Enter your details to continue.
          </Card.Description>
            <form typeof="form" onSubmit={handleSubmit}>
          <div className="mt-6 space-y-5">
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={25} />}
           
            />

            <Input
              label="Password"
              type="password"
              placeholder="Enter password"
              leftIcon={<Lock size={25} />}
          
            />
 
            <Button type="submit" fullWidth onClick={() => playSoftSound("success")}>
              Login
            </Button>


          </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;