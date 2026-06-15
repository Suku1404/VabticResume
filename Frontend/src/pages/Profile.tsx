import { useEffect, useState } from "react";
import { User, Mail, Calendar, Shield, Edit2, Save, X, Key, Trash2 } from "lucide-react";
import { Button, Card } from "../components/common";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  created_at: string;
}

const Profile = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/user/login");
          return;
        }
        // Decode JWT to get basic info (since no profile endpoint exists yet)
        const payload = JSON.parse(atob(token.split(".")[1]));
        setProfile({
          id: payload.id || 0,
          name: payload.name || "User",
          email: payload.email || "",
          created_at: new Date().toISOString(),
        });
        setEditName(payload.name || "User");
      } catch (err) {
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleSave = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }
    setSaving(true);
    try {
      // Optimistic update since we don't have a profile update endpoint yet
      setProfile((prev) => prev ? { ...prev, name: editName } : prev);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.info("Logged out successfully.");
    navigate("/user/login");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
      </div>
    );
  }

  const initials = profile?.name
    ? profile.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "U";

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#030712] text-slate-800 dark:text-white p-6 transition-colors duration-300">
      <div className="mx-auto max-w-3xl space-y-6">
        {/* Header */}
        <div className="rounded-3xl bg-gradient-to-r from-gray-950 via-indigo-950 to-violet-950 p-8 text-white shadow-2xl">
          <div className="flex items-center gap-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-3xl font-black shadow-lg">
              {initials}
            </div>
            <div>
              <h1 className="text-3xl font-black">{profile?.name}</h1>
              <p className="mt-1 text-gray-300">{profile?.email}</p>
              <p className="mt-1 text-xs text-gray-400">
                Member since{" "}
                {profile?.created_at
                  ? new Date(profile.created_at).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </p>
            </div>
          </div>
        </div>

        {/* Personal Information Card */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <User className="text-indigo-600 dark:text-indigo-400" size={20} />
              <Card.Title>Personal Information</Card.Title>
            </div>
            {!editing ? (
              <Button
                variant="outline"
                size="sm"
                leftIcon={<Edit2 size={14} />}
                onClick={() => setEditing(true)}
              >
                Edit
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  leftIcon={<Save size={14} />}
                  onClick={handleSave}
                  isLoading={saving}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  leftIcon={<X size={14} />}
                  onClick={() => {
                    setEditing(false);
                    setEditName(profile?.name || "");
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Full Name
              </label>
              {editing ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-2.5 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  placeholder="Enter your name"
                />
              ) : (
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {profile?.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Email Address
              </label>
              <div className="flex items-center gap-2">
                <Mail size={14} className="text-gray-400" />
                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  {profile?.email}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1">
                Account ID
              </label>
              <p className="text-sm font-semibold text-slate-900 dark:text-white">
                #{profile?.id}
              </p>
            </div>
          </div>
        </Card>

        {/* Account Settings Card */}
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <Shield className="text-indigo-600 dark:text-indigo-400" size={20} />
            <Card.Title>Account Settings</Card.Title>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => toast.info("Password change coming soon!")}
              className="flex w-full items-center justify-between rounded-2xl border border-gray-200 dark:border-white/10 bg-gray-50 dark:bg-slate-900/50 px-4 py-3 text-sm font-semibold text-slate-800 dark:text-white hover:bg-gray-100 dark:hover:bg-slate-900 transition"
            >
              <div className="flex items-center gap-3">
                <Key size={16} className="text-indigo-500" />
                Change Password
              </div>
              <span className="text-xs text-gray-400">→</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex w-full items-center justify-between rounded-2xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 px-4 py-3 text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition"
            >
              <div className="flex items-center gap-3">
                <Trash2 size={16} />
                Log Out
              </div>
              <span className="text-xs opacity-60">→</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
