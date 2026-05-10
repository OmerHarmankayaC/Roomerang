import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { getRole, clearSession } from "../utils/auth";

export default function StaffWalkInRegistration() {
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const navigate = useNavigate();
  const role = getRole();
  const [validationError, setValidationError] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [checkIn, setCheckIn] = useState("2026-07-15");
  const [checkOut, setCheckOut] = useState("2026-07-18");
  const [selectedRoom, setSelectedRoom] = useState("");

  useEffect(() => {
    if (!getRole()) navigate("/staff");
  }, [navigate]);

  const handleSignOut = () => {
    clearSession();
    navigate("/staff");
  };

  const handleRegister = () => {
    setValidationError("");
    if (!fullName.trim()) { setValidationError("Please enter guest's full name."); return; }
    if (!email.trim()) { setValidationError("Please enter guest's email address."); return; }
    if (!phone.trim()) { setValidationError("Please enter guest's phone number."); return; }
    if (!checkIn || !checkOut) { setValidationError("Please select check-in and check-out dates."); return; }
    if (checkOut <= checkIn) { setValidationError("Check-out date must be after check-in date."); return; }
    if (!selectedRoom) { setValidationError("Please select a room."); return; }
    navigate('/staff/daily');
  };

  return (
    <div className="w-full h-full bg-white overflow-auto">
      <header className="flex items-center justify-between px-4 py-4 bg-gray-300 border-b border-gray-400">
        <Link to="/" className="text-xl font-bold tracking-wide">ROOMERANG</Link>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-700 capitalize">{role}</span>
          <button onClick={handleSignOut} className="text-xs text-gray-500 hover:text-gray-800 underline">Sign Out</button>
        </div>
      </header>

      <div className="px-4 py-3 border-b border-gray-300 flex gap-2 overflow-x-auto">
        <Link to="/staff/dashboard" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors whitespace-nowrap">Calendar</Link>
        <Link to="/staff/daily" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors whitespace-nowrap">Daily View</Link>
        <Link to="/staff/walk-in" className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors whitespace-nowrap">Walk-in</Link>
        <Link to="/staff/inventory" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors whitespace-nowrap">Inventory</Link>
        {role === "admin" && (
          <Link to="/staff/monitor" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors whitespace-nowrap">Monitor</Link>
        )}
      </div>

      <div className="px-4 py-4">
        <h2 className="text-2xl font-bold text-gray-900">Register Walk-in Guest</h2>
      </div>

      <div className="mx-4 mt-2 bg-gray-50 border border-gray-300 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Guest Information</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 bg-white rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email Address</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 bg-white rounded" />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
            <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 border border-gray-300 bg-white rounded" />
          </div>
        </div>
      </div>

      <div className="mx-4 mt-4 bg-gray-50 border border-gray-300 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Reservation Details</h3>
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Check-in Date</label>
              <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-3 py-2 border border-gray-300 bg-white rounded text-sm" placeholder="dd.mm.yyyy" />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Check-out Date</label>
              <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-3 py-2 border border-gray-300 bg-white rounded text-sm" placeholder="dd.mm.yyyy" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Room Selection</label>
            <select value={selectedRoom} onChange={(e) => setSelectedRoom(e.target.value)} className="w-full px-3 py-2 border border-gray-300 bg-white rounded">
              <option value="">Select a room</option>
              <option value="101">Room 101 - Standard</option>
              <option value="205">Room 205 - Deluxe</option>
              <option value="310">Room 310 - Suite</option>
            </select>
            <p className="text-xs italic text-gray-600 mt-1">Only available rooms shown</p>
          </div>
        </div>
      </div>

      <div className="mx-4 mt-4 bg-gray-50 border border-gray-300 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Payment</h3>
        <div className="space-y-3">
          <div className="mb-4">
            <span className="text-sm text-gray-600">Total: </span>
            <span className="text-lg font-bold text-gray-900">₺2,550</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setPaymentMethod("cash")} className={`flex-1 py-2.5 rounded font-medium transition-colors ${paymentMethod === "cash" ? "bg-gray-200 border-2 border-gray-600 text-gray-900" : "bg-white border border-gray-300 text-gray-700"}`}>
              💵 Cash
            </button>
            <button onClick={() => setPaymentMethod("card")} className={`flex-1 py-2.5 rounded font-medium transition-colors ${paymentMethod === "card" ? "bg-gray-200 border-2 border-gray-600 text-gray-900" : "bg-white border border-gray-300 text-gray-700"}`}>
              💳 Credit Card
            </button>
          </div>
        </div>
      </div>

      {validationError && (
        <div className="mx-4 mt-4 bg-red-50 border border-red-300 rounded-lg p-3">
          <p className="text-sm text-red-700">{validationError}</p>
        </div>
      )}

      <div className="px-4 py-6">
        <button onClick={handleRegister} className="w-full bg-gray-800 text-white py-3 rounded font-medium hover:bg-gray-700 transition-colors">
          Register Guest
        </button>
      </div>
    </div>
  );
}
