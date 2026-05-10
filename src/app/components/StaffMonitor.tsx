import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { TrendingUp, LogIn, LogOut, CalendarDays } from "lucide-react";
import { getRole, clearSession } from "../utils/auth";

const summaryCards = [
  { label: "Current Occupancy", value: "7 / 10", sub: "70% occupied", icon: TrendingUp },
  { label: "Total Active Bookings", value: "12", sub: "across all dates", icon: CalendarDays },
  { label: "Arriving Today", value: "2", sub: "Jul 15, 2026", icon: LogIn },
  { label: "Departing Today", value: "1", sub: "Jul 15, 2026", icon: LogOut },
];

const allArrivals = [
  { ref: "ROM-20260715-0042", guest: "Ali Yılmaz", room: "101", date: "15 Jul 2026", isoDate: "2026-07-15" },
  { ref: "ROM-20260716-0015", guest: "Sarah Johnson", room: "204", date: "16 Jul 2026", isoDate: "2026-07-16" },
  { ref: "ROM-20260718-0033", guest: "Mehmet Demir", room: "310", date: "18 Jul 2026", isoDate: "2026-07-18" },
];

const allDepartures = [
  { ref: "ROM-20260712-0008", guest: "Elena Kovač", room: "102", date: "15 Jul 2026", isoDate: "2026-07-15" },
  { ref: "ROM-20260714-0021", guest: "James Park", room: "201", date: "17 Jul 2026", isoDate: "2026-07-17" },
];

export default function StaffMonitor() {
  const navigate = useNavigate();
  const role = getRole();

  const [filterFrom, setFilterFrom] = useState("2026-07-15");
  const [filterTo, setFilterTo] = useState("2026-07-31");
  const [appliedFrom, setAppliedFrom] = useState("2026-07-15");
  const [appliedTo, setAppliedTo] = useState("2026-07-31");

  useEffect(() => {
    if (!getRole()) navigate("/staff");
  }, [navigate]);

  const handleSignOut = () => {
    clearSession();
    navigate("/staff");
  };

  if (!role) return null;

  const sharedHeader = (
    <header className="flex items-center justify-between px-4 py-4 bg-gray-300 border-b border-gray-400">
      <Link to="/" className="text-xl font-bold tracking-wide">ROOMERANG</Link>
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-gray-700 capitalize">{role}</span>
        <button onClick={handleSignOut} className="text-xs text-gray-500 hover:text-gray-800 underline">Sign Out</button>
      </div>
    </header>
  );

  const sharedNav = (
    <div className="px-4 py-3 border-b border-gray-300 flex gap-2 overflow-x-auto">
      <Link to="/staff/dashboard" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors whitespace-nowrap">Calendar</Link>
      <Link to="/staff/daily" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors whitespace-nowrap">Daily View</Link>
      <Link to="/staff/walk-in" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors whitespace-nowrap">Walk-in</Link>
      <Link to="/staff/inventory" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors whitespace-nowrap">Inventory</Link>
    </div>
  );

  if (role === "staff") {
    return (
      <div className="w-full h-full bg-white overflow-auto">
        {sharedHeader}
        {sharedNav}
        <div className="px-4 py-12 text-center">
          <p className="text-lg font-semibold text-gray-800 mb-2">Access Restricted</p>
          <p className="text-sm text-gray-500">The Monitor screen is available to Administrators only.</p>
        </div>
      </div>
    );
  }

  const filteredArrivals = allArrivals.filter((r) => r.isoDate >= appliedFrom && r.isoDate <= appliedTo);
  const filteredDepartures = allDepartures.filter((r) => r.isoDate >= appliedFrom && r.isoDate <= appliedTo);

  return (
    <div className="w-full h-full bg-white overflow-auto">
      {sharedHeader}

      <div className="px-4 py-3 border-b border-gray-300 flex gap-2 overflow-x-auto">
        <Link to="/staff/dashboard" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors whitespace-nowrap">Calendar</Link>
        <Link to="/staff/daily" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors whitespace-nowrap">Daily View</Link>
        <Link to="/staff/walk-in" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors whitespace-nowrap">Walk-in</Link>
        <Link to="/staff/inventory" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors whitespace-nowrap">Inventory</Link>
        <Link to="/staff/monitor" className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors whitespace-nowrap">Monitor</Link>
      </div>

      <div className="px-4 py-4 border-b border-gray-300">
        <h2 className="text-xl font-bold text-gray-900">Reservation Overview</h2>
        <p className="text-xs text-gray-500 mt-0.5">Administrator access only · Read-only</p>
      </div>

      <div className="px-4 pt-4 grid grid-cols-2 gap-3">
        {summaryCards.map(({ label, value, sub, icon: Icon }) => (
          <div key={label} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-2">
              <Icon className="w-4 h-4 text-gray-500" />
              <span className="text-xs text-gray-500">{label}</span>
            </div>
            <p className="text-xl font-bold text-gray-900">{value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="mx-4 mt-4 bg-gray-50 border border-gray-200 rounded-lg p-3">
        <p className="text-xs font-medium text-gray-600 mb-2">Filter by Date Range</p>
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">From</label>
            <input type="date" value={filterFrom} onChange={(e) => setFilterFrom(e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 bg-white rounded text-sm" />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-gray-500 mb-1">To</label>
            <input type="date" value={filterTo} onChange={(e) => setFilterTo(e.target.value)} className="w-full px-2 py-1.5 border border-gray-300 bg-white rounded text-sm" />
          </div>
        </div>
        <button
          onClick={() => { setAppliedFrom(filterFrom); setAppliedTo(filterTo); }}
          className="mt-2 w-full bg-gray-800 text-white py-1.5 rounded text-sm font-medium hover:bg-gray-700 transition-colors"
        >
          Apply Filter
        </button>
      </div>

      <div className="mx-4 mt-4">
        <div className="flex items-center gap-2 mb-2">
          <LogIn className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-800">Upcoming Arrivals</h3>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[1fr_80px_90px] gap-2 px-3 py-2 bg-gray-100 border-b border-gray-200">
            <span className="text-xs font-medium text-gray-600">Guest</span>
            <span className="text-xs font-medium text-gray-600">Room</span>
            <span className="text-xs font-medium text-gray-600">Date</span>
          </div>
          {filteredArrivals.length === 0 ? (
            <p className="text-sm text-gray-500 italic text-center py-4">No arrivals in selected range.</p>
          ) : (
            filteredArrivals.map((r) => (
              <div key={r.ref} className="grid grid-cols-[1fr_80px_90px] gap-2 px-3 py-2.5 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{r.guest}</p>
                  <p className="text-xs text-gray-400">{r.ref}</p>
                </div>
                <span className="text-sm text-gray-700 self-center">{r.room}</span>
                <span className="text-sm text-gray-700 self-center">{r.date}</span>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mx-4 mt-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <LogOut className="w-4 h-4 text-gray-600" />
          <h3 className="text-sm font-semibold text-gray-800">Upcoming Departures</h3>
        </div>
        <div className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="grid grid-cols-[1fr_80px_90px] gap-2 px-3 py-2 bg-gray-100 border-b border-gray-200">
            <span className="text-xs font-medium text-gray-600">Guest</span>
            <span className="text-xs font-medium text-gray-600">Room</span>
            <span className="text-xs font-medium text-gray-600">Date</span>
          </div>
          {filteredDepartures.length === 0 ? (
            <p className="text-sm text-gray-500 italic text-center py-4">No departures in selected range.</p>
          ) : (
            filteredDepartures.map((r) => (
              <div key={r.ref} className="grid grid-cols-[1fr_80px_90px] gap-2 px-3 py-2.5 border-b border-gray-100 last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{r.guest}</p>
                  <p className="text-xs text-gray-400">{r.ref}</p>
                </div>
                <span className="text-sm text-gray-700 self-center">{r.room}</span>
                <span className="text-sm text-gray-700 self-center">{r.date}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
