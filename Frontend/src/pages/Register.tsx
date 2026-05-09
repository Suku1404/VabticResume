import { Mail, Lock, User, Sparkles } from "lucide-react";
import { Button, Card, Input } from "../components/common";
import { playSoftSound } from "../pages/sound";

const Register = () => {
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
            Create your profile once and generate multiple professional resumes for internships, jobs, and tech roles.
          </p>
        </div>

        <Card>
          <Card.Title>Create Account</Card.Title>
          <Card.Description>
            Simple, fast, and beginner-friendly registration.
          </Card.Description>

          <div className="mt-6 space-y-5">
            <Input
              label="Full Name"
              placeholder="Sakshi Rajput"
              leftIcon={<User size={18} />}
              onChange={() => playSoftSound("input")}
            />

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              leftIcon={<Mail size={18} />}
              onChange={() => playSoftSound("input")}
            />

            <Input
              label="Password"
              type="password"
              placeholder="Create password"
              leftIcon={<Lock size={18} />}
              onChange={() => playSoftSound("input")}
            />

            <Button fullWidth onClick={() => playSoftSound("success")}>
              Create Account
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Register;