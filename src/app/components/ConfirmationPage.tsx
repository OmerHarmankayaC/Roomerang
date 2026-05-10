import { Menu, Lightbulb } from "lucide-react";
import { useNavigate, Link } from "react-router";
import { useState } from "react";

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [createAccount, setCreateAccount] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleCreateAccount = () => {
    setPasswordError("");
    if (password.length < 8) { setPasswordError("Password must be at least 8 characters."); return; }
    if (!/[A-Z]/.test(password)) { setPasswordError("Password must contain at least one uppercase letter."); return; }
    if (!/[a-z]/.test(password)) { setPasswordError("Password must contain at least one lowercase letter."); return; }
    if (!/[0-9]/.test(password)) { setPasswordError("Password must contain at least one digit."); return; }
    if (!/[^A-Za-z0-9]/.test(password)) { setPasswordError("Password must contain at least one special character."); return; }
    setAccountCreated(true);
  };

  return (
    <div className="w-full h-full bg-white overflow-auto relative">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-4 bg-gray-200 border-b border-gray-400">
        <Link to="/" className="text-xl font-bold tracking-wide">ROOMERANG</Link>
        <button className="p-1" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-[57px] right-4 bg-white border border-gray-400 rounded shadow-lg z-50 w-56">
          <Link to="/" className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-200" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/manage" className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-200" onClick={() => setMenuOpen(false)}>Manage Reservation</Link>
          <Link to="/staff" className="block px-4 py-3 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Staff Dashboard</Link>
        </div>
      )}

      {/* Success Message */}
      <div className="text-center px-4 py-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 border-2 border-green-400 mb-4">
          <span className="text-5xl text-green-600">✓</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-sm text-gray-600">A confirmation email and payment receipt have been sent.</p>
      </div>

      {/* Reservation Summary Card */}
      <div className="mx-4 mt-2 bg-gray-50 border border-gray-300 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Reservation Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Reference No:</span>
            <span className="text-sm font-medium text-gray-900">ROM-20260715-0042</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Room:</span>
            <span className="text-sm font-medium text-gray-900">Deluxe Room</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Check-in:</span>
            <span className="text-sm font-medium text-gray-900">15 Jul 2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Check-out:</span>
            <span className="text-sm font-medium text-gray-900">18 Jul 2026</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Deposit Paid:</span>
            <span className="text-sm font-medium text-gray-900">₺930</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Remaining Balance:</span>
            <span className="text-sm font-medium text-gray-900">₺930 (due at check-in)</span>
          </div>
        </div>
      </div>

      {/* Cancellation Policy Box */}
      <div className="mx-4 mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex gap-3">
        <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-gray-800">
          <span className="font-medium">Cancellation Policy:</span> Full deposit refund if cancelled at least 48 hours before check-in.
        </p>
      </div>

      {/* Account Creation Prompt (FR-05-1 — optional, post-booking) */}
      <div className="mx-4 mt-4 bg-gray-50 border border-gray-300 rounded-lg p-4">
        {accountCreated ? (
          <div className="flex items-center gap-2 text-green-700">
            <span className="text-lg">✓</span>
            <p className="text-sm font-medium">Account created! You'll receive future promotions at your email.</p>
          </div>
        ) : (
          <>
            <div className="flex items-start gap-2 mb-3">
              <input
                type="checkbox"
                id="create-account"
                checked={createAccount}
                onChange={(e) => {
                  setCreateAccount(e.target.checked);
                  setPasswordError("");
                }}
                className="mt-1 w-4 h-4 border border-gray-400 rounded"
              />
              <label htmlFor="create-account" className="text-sm text-gray-700">
                Create an account to receive future promotions and discount notifications (optional)
              </label>
            </div>

            {createAccount && (
              <div className="space-y-2">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Set a Password</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                    className={`w-full px-3 py-2 border rounded text-sm bg-white ${passwordError ? "border-red-400" : "border-gray-300"}`}
                    placeholder="Min. 8 chars, upper, lower, digit, symbol"
                  />
                  {passwordError && (
                    <p className="text-xs text-red-600 mt-1">{passwordError}</p>
                  )}
                </div>
                <button
                  onClick={handleCreateAccount}
                  className="w-full bg-gray-700 text-white py-2 rounded text-sm font-medium hover:bg-gray-600 transition-colors"
                >
                  Create Account
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mx-4 mt-4 mb-6 flex gap-2">
        <button
          onClick={() => navigate("/")}
          className="flex-1 bg-white text-gray-700 border border-gray-400 py-2.5 rounded font-medium hover:bg-gray-50 transition-colors"
        >
          Back to Home
        </button>
        <button
          onClick={() => navigate("/manage")}
          className="flex-1 bg-gray-800 text-white py-2.5 rounded font-medium hover:bg-gray-700 transition-colors"
        >
          Manage Reservation
        </button>
      </div>
    </div>
  );
}
