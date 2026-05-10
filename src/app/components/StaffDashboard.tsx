import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useNavigate, Link } from "react-router";
import { getRole, clearSession } from "../utils/auth";

const daysOfWeek = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const generateCalendarDays = () => {
  const days = [];
  days.push({ day: null });
  days.push({ day: null });
  for (let i = 1; i <= 31; i++) {
    days.push({ day: i });
  }
  return days;
};

type Reservation = {
  guest: string;
  room: string;
  checkIn: string;
  checkOut: string;
  deposit: string;
  remaining: string;
  status: "Arriving" | "Checked In";
};

const reservationsByDay: Record<number, Reservation[]> = {
  15: [
    { guest: "Ali Yilmaz", room: "Room 101", checkIn: "15 Jul", checkOut: "18 Jul", deposit: "₺930", remaining: "₺930", status: "Arriving" },
    { guest: "Sarah Johnson", room: "Room 204", checkIn: "13 Jul", checkOut: "15 Jul", deposit: "₺600", remaining: "Paid", status: "Checked In" },
  ],
  3: [
    { guest: "James Park", room: "Room 201", checkIn: "3 Jul", checkOut: "5 Jul", deposit: "₺800", remaining: "₺800", status: "Arriving" },
  ],
  7: [
    { guest: "Elena Kovac", room: "Room 301", checkIn: "7 Jul", checkOut: "10 Jul", deposit: "₺1,200", remaining: "₺1,200", status: "Arriving" },
    { guest: "Mehmet Demir", room: "Room 102", checkIn: "7 Jul", checkOut: "9 Jul", deposit: "₺425", remaining: "Paid", status: "Checked In" },
    { guest: "Laura Chen", room: "Room 204", checkIn: "7 Jul", checkOut: "8 Jul", deposit: "₺300", remaining: "₺300", status: "Arriving" },
  ],
};

const getOccupancyColor = (day: number | null) => {
  if (!day) return "bg-white";
  const reservations = reservationsByDay[day];
  if (!reservations || reservations.length === 0) return "bg-white";
  const count = reservations.length;
  if (count === 1) return "bg-green-100";
  if (count === 2) return "bg-yellow-100";
  return "bg-red-100";
};

const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function StaffDashboard() {
  const navigate = useNavigate();
  const role = getRole();
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState(6);
  const [currentYear, setCurrentYear] = useState(2026);

  useEffect(() => {
    if (!getRole()) navigate("/staff");
  }, [navigate]);

  const handleSignOut = () => {
    clearSession();
    navigate("/staff");
  };

  const calendarDays = generateCalendarDays();
  const reservations = selectedDay ? (reservationsByDay[selectedDay] ?? []) : [];

  const goToPreviousMonth = () => {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear(currentYear - 1); }
    else setCurrentMonth(currentMonth - 1);
    setSelectedDay(null);
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear(currentYear + 1); }
    else setCurrentMonth(currentMonth + 1);
    setSelectedDay(null);
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
        <Link to="/staff/dashboard" className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded whitespace-nowrap">Calendar</Link>
        <Link to="/staff/daily" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 whitespace-nowrap">Daily View</Link>
        <Link to="/staff/walk-in" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 whitespace-nowrap">Walk-in</Link>
        <Link to="/staff/inventory" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 whitespace-nowrap">Inventory</Link>
        {role === "admin" && (
          <Link to="/staff/monitor" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 whitespace-nowrap">Monitor</Link>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-300">
        <h2 className="text-xl font-bold text-gray-900">{monthNames[currentMonth]} {currentYear}</h2>
        <div className="flex gap-2">
          <button onClick={goToPreviousMonth} className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded bg-white hover:bg-gray-50">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={goToNextMonth} className="w-8 h-8 flex items-center justify-center border border-gray-400 rounded bg-white hover:bg-gray-50">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="px-4 py-4">
        <div className="grid grid-cols-7 gap-1 mb-1">
          {daysOfWeek.map((d) => (
            <div key={d} className="text-center text-xs font-medium text-gray-600 py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((item, index) => (
            <button
              key={index}
              onClick={() => item.day && currentMonth === 6 && setSelectedDay(item.day === selectedDay ? null : item.day)}
              disabled={!item.day || currentMonth !== 6}
              className={`aspect-square flex items-center justify-center text-sm border transition-colors ${
                !item.day
                  ? "bg-white border-transparent"
                  : item.day === selectedDay
                  ? "border-gray-700 bg-gray-800 text-white"
                  : `${getOccupancyColor(item.day)} border-gray-300 ${currentMonth === 6 ? 'hover:border-gray-500' : 'opacity-40'}`
              }`}
            >
              {item.day || ""}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 flex items-center justify-center gap-4 text-sm border-t border-gray-300">
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-500" /><span className="text-gray-700">Low</span></div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-yellow-500" /><span className="text-gray-700">Medium</span></div>
        <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500" /><span className="text-gray-700">High Occupancy</span></div>
      </div>

      {selectedDay && currentMonth === 6 && (
        <div className="mx-4 mb-6 border border-gray-300 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-gray-100 border-b border-gray-300">
            <h3 className="font-semibold text-gray-900">{monthNames[currentMonth]} {selectedDay}, {currentYear}</h3>
            <div className="flex items-center gap-2">
              <button onClick={() => navigate("/staff/walk-in")} className="text-xs px-2 py-1 bg-gray-800 text-white rounded hover:bg-gray-700">
                + Walk-in
              </button>
              <button onClick={() => setSelectedDay(null)}>
                <X className="w-4 h-4 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          </div>

          {reservations.length === 0 ? (
            <p className="text-sm text-gray-500 italic text-center py-6">No reservations for this date.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {reservations.map((r, i) => (
                <div key={i} className="px-4 py-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{r.guest}</p>
                      <p className="text-xs text-gray-600">{r.room} · {r.checkIn} — {r.checkOut}</p>
                      <p className={`text-xs font-medium mt-0.5 ${r.status === "Arriving" ? "text-orange-600" : "text-green-600"}`}>{r.status}</p>
                    </div>
                    <div className="text-right text-xs text-gray-600">
                      <p>Deposit: {r.deposit}</p>
                      <p className="font-semibold text-gray-900">Due: {r.remaining}</p>
                    </div>
                  </div>
                  {r.status === "Arriving" && (
                    <div className="flex gap-2 mt-2">
                      <button className="flex-1 border border-gray-300 rounded py-1.5 text-xs font-medium hover:bg-gray-50">💵 Cash</button>
                      <button className="flex-1 border border-gray-300 rounded py-1.5 text-xs font-medium hover:bg-gray-50">💳 Card</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {!selectedDay && (
        <p className="text-center text-sm italic text-gray-500 pb-6">Click a day to view reservations for that date.</p>
      )}
    </div>
  );
}
