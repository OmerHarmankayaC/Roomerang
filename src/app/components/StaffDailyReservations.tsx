import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import { getRole, clearSession } from "../utils/auth";

type Reservation = {
  id: number;
  guest: string;
  room: string;
  checkIn: string;
  checkOut: string;
  deposit: string;
  remaining: string;
  status: "arriving" | "checked-in";
};

const initialReservations: Reservation[] = [
  { id: 1, guest: "Ali Yılmaz", room: "Room 101", checkIn: "15 Jul 2026", checkOut: "18 Jul 2026", deposit: "₺930", remaining: "₺930", status: "arriving" },
  { id: 2, guest: "Sarah Johnson", room: "Room 204", checkIn: "13 Jul 2026", checkOut: "15 Jul 2026", deposit: "₺600", remaining: "Paid", status: "checked-in" },
  { id: 3, guest: "Mehmet Demir", room: "Room 112", checkIn: "15 Jul 2026", checkOut: "17 Jul 2026", deposit: "₺425", remaining: "₺425", status: "arriving" },
];

export default function StaffDailyReservations() {
  const navigate = useNavigate();
  const role = getRole();
  const [reservations, setReservations] = useState(initialReservations);

  useEffect(() => {
    if (!getRole()) navigate("/staff");
  }, [navigate]);

  const handleSignOut = () => {
    clearSession();
    navigate("/staff");
  };

  const checkIn = (id: number) => {
    setReservations((prev) =>
      prev.map((r) => r.id === id ? { ...r, status: "checked-in", remaining: "Paid" } : r)
    );
  };

  const arriving = reservations.filter((r) => r.status === "arriving").length;
  const checkedIn = reservations.filter((r) => r.status === "checked-in").length;

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
        <Link to="/staff/daily" className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors whitespace-nowrap">Daily View</Link>
        <Link to="/staff/walk-in" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors whitespace-nowrap">Walk-in</Link>
        <Link to="/staff/inventory" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors whitespace-nowrap">Inventory</Link>
        {role === "admin" && (
          <Link to="/staff/monitor" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors whitespace-nowrap">Monitor</Link>
        )}
      </div>

      <div className="px-4 py-4 border-b border-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-1">July 15, 2026</h2>
        <p className="text-sm text-gray-600">{reservations.length} reservations · {arriving} arriving · {checkedIn} checked in</p>
      </div>

      <div className="px-4 py-4 space-y-3">
        {reservations.length === 0 ? (
          <div className="text-center py-10 text-gray-500 text-sm italic">No reservations for the selected date.</div>
        ) : (
          reservations.map((r) => (
            <div key={r.id} className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <div className="flex justify-between mb-1">
                <div>
                  <h3 className="font-bold text-gray-900 mb-0.5">{r.guest}</h3>
                  <p className="text-sm text-gray-700">{r.room}</p>
                  <p className="text-xs text-gray-500 mb-1">{r.checkIn} — {r.checkOut}</p>
                  {r.status === "arriving" ? (
                    <p className="text-sm text-orange-600 font-medium">Arriving</p>
                  ) : (
                    <p className="text-sm text-green-600 font-medium">Checked In</p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-0.5">Deposit: {r.deposit}</p>
                  <p className="text-sm font-bold text-gray-900">Remaining: {r.remaining}</p>
                </div>
              </div>

              {r.status === "arriving" && (
                <div className="flex gap-2 mt-3">
                  <button onClick={() => checkIn(r.id)} className="flex-1 bg-white border border-gray-400 rounded py-2 text-sm font-medium hover:bg-gray-50">💵 Cash</button>
                  <button onClick={() => checkIn(r.id)} className="flex-1 bg-white border border-gray-400 rounded py-2 text-sm font-medium hover:bg-gray-50">💳 Card</button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      <div className="px-4 pb-6">
        <button onClick={() => navigate("/staff/walk-in")} className="w-full bg-gray-800 text-white py-3 rounded font-medium hover:bg-gray-700 transition-colors">
          + Register Walk-in Guest
        </button>
      </div>
    </div>
  );
}
