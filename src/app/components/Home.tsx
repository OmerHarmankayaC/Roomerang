import { Menu } from "lucide-react";
import { useNavigate, Link } from "react-router";
import { useState } from "react";

export default function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [dateError, setDateError] = useState("");

  const handleSearch = () => {
    setDateError("");
    if (!checkIn || !checkOut) {
      setDateError("Please select both check-in and check-out dates.");
      return;
    }
    if (checkOut <= checkIn) {
      setDateError("Check-out date must be after the check-in date.");
      return;
    }
    navigate(`/search?checkIn=${checkIn}&checkOut=${checkOut}`);
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
          <Link
            to="/"
            className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-200"
            onClick={() => setMenuOpen(false)}
          >
            Home
          </Link>
          <Link
            to="/manage"
            className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-200"
            onClick={() => setMenuOpen(false)}
          >
            Manage Reservation
          </Link>
          <Link
            to="/staff"
            className="block px-4 py-3 hover:bg-gray-100"
            onClick={() => setMenuOpen(false)}
          >
            Staff Dashboard
          </Link>
        </div>
      )}

      {/* Hero Image Placeholder */}
      <div className="mx-4 mt-6 h-48 border-2 border-dashed border-gray-400 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-center px-4">Hero Image / Hotel Banner</p>
      </div>

      {/* Find Your Room Card */}
      <div className="mx-4 mt-6 bg-gray-50 border border-gray-300 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Find Your Room</h2>

        {/* Date Inputs */}
        <div className="flex gap-2 mb-1">
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Check-in Date</label>
            <input
              type="date"
              value={checkIn}
              onChange={(e) => {
                setCheckIn(e.target.value);
                setDateError("");
              }}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm text-gray-600 mb-1">Check-out Date</label>
            <input
              type="date"
              value={checkOut}
              onChange={(e) => {
                setCheckOut(e.target.value);
                setDateError("");
              }}
              min={checkIn || new Date().toISOString().split('T')[0]}
              className={`w-full px-3 py-2 border rounded text-sm bg-white ${
                dateError ? "border-red-400" : "border-gray-300"
              }`}
            />
          </div>
        </div>

        {/* Inline validation error */}
        {dateError && (
          <p className="text-xs text-red-600 mb-3">{dateError}</p>
        )}
        {!dateError && <div className="mb-3" />}

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="w-full bg-gray-800 text-white py-3 rounded font-medium hover:bg-gray-700 transition-colors"
        >
          Search Availability
        </button>
      </div>

      {/* Active Campaigns Card */}
      <div className="mx-4 mt-6 mb-6 bg-gray-50 border border-gray-300 rounded-lg p-4">
        <h2 className="text-lg font-semibold mb-4">Active Campaigns</h2>

        {/* Campaign Box */}
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-gray-900">Early Bird Discount!</h3>
            <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-medium">
              Non-Refundable
            </span>
          </div>
          <p className="text-gray-700 text-sm">Book 30+ days in advance and save 20%</p>
        </div>
      </div>
    </div>
  );
}
