import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { AlertCircle } from "lucide-react";
import { setSession } from "../utils/auth";

export default function StaffLogin() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError("Please enter your username and password.");
      return;
    }
    if (username === "admin" && password === "Admin1234!") {
      setSession("admin");
      setError("");
      navigate("/staff/dashboard");
    } else if (username === "staff" && password === "Staff1234!") {
      setSession("staff");
      setError("");
      navigate("/staff/dashboard");
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="w-full h-full bg-white overflow-auto relative">
      <header className="flex items-center justify-between px-4 py-4 bg-gray-300 border-b border-gray-400">
        <Link to="/" className="text-xl font-bold tracking-wide">ROOMERANG</Link>
        <span className="text-sm font-medium text-gray-700">Staff Portal</span>
      </header>

      <div className="px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">Staff Login</h2>
        <p className="text-sm text-gray-500 mb-6">
          Access restricted to authorised personnel.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded focus:outline-none focus:ring-2 focus:ring-gray-400"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-300 rounded p-3">
                <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-3 rounded font-medium hover:bg-gray-700 transition-colors"
            >
              Sign In
            </button>
          </div>
        </form>

        <div className="mt-6 bg-gray-50 border border-gray-200 rounded p-3 space-y-2">
          <p className="text-xs text-gray-500 font-medium">Session Policy</p>
          <p className="text-xs text-gray-500">
            Sessions expire after <span className="font-medium">30 minutes</span> of inactivity.
            Pricing and campaign management requires Administrator privileges.
          </p>
          <div className="border-t border-gray-200 pt-2 space-y-0.5">
            <p className="text-xs text-gray-400">Front Desk Staff: <span className="font-mono">staff / Staff1234!</span></p>
            <p className="text-xs text-gray-400">Administrator: <span className="font-mono">admin / Admin1234!</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}
