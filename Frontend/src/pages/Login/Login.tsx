import { Mail, Lock, Sparkles } from "lucide-react";
import { Button, Card, Input } from "../../components/common";
import { playSoftSound } from "../sound";
import { Link } from 'react-router-dom';
import Logic from "./index";





const Login = () => {
 

  const handleSubmit = Logic();
  
  return (
    <div className="min-h-screen bg-linear-to-br from-white via-indigo-50 to-violet-100 dark:from-gray-950 dark:via-indigo-950 dark:to-violet-950 px-6 py-16 text-slate-950 dark:text-white transition-colors duration-300">
      <div className="mx-auto grid max-w-6xl gap-10 md:grid-cols-2 md:items-center">
        <div>
          <div className="mb-6 inline-flex rounded-2xl bg-indigo-600 dark:bg-white/10 p-3 text-white">
            <Sparkles />
          </div>

          <h1 className="text-5xl font-black leading-tight text-gray-950 dark:text-white">
            Welcome back to your premium resume workspace.
          </h1>

          <p className="mt-5 text-gray-600 dark:text-gray-300">
            Continue building powerful, ATS-friendly resumes with beautiful templates and smart suggestions.
          </p>
        </div>

        <Card>
          <div className="flex gap-2 pb-2">
            <p className="text-md text-gray-700 dark:text-gray-400 font-bold">Don't have an account?</p>
            <Link to="/user/register" className="text-md text-indigo-600 dark:text-indigo-400 font-bold underline">Register</Link>
          </div>
          <Card.Title>Login</Card.Title>
          <Card.Description>
            Enter your details to continue.
          </Card.Description>
          <form onSubmit={handleSubmit}>
            <div className="mt-6 space-y-5">
              <Input
                label="Email"
                name="email"
                type="email"
                placeholder="you@example.com"
                leftIcon={<Mail size={20} />}
                required
              />

              <Input
                label="Password"
                name="password"
                type="password"
                placeholder="Enter password"
                leftIcon={<Lock size={20} />}
                required
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
