import { Home, SearchX } from "lucide-react";
import { Button } from "../components/common";
import { playSoftSound } from "../pages/sound";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-950 px-6 text-white">
      <div className="text-center">
        <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-white/10 text-indigo-300 shadow-2xl">
          <SearchX size={52} />
        </div>

        <h1 className="text-8xl font-black text-white">404</h1>

        <h2 className="mt-4 text-3xl font-bold">Lost in the resume universe</h2>

        <p className="mx-auto mt-3 max-w-md text-gray-400">
          This page disappeared into another career timeline. Let’s bring you back.
        </p>

        <div className="mt-8 flex justify-center">
          <Button leftIcon={<Home size={18} />} onClick={() => playSoftSound("success")}>
          <Link to="/">Back To Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;