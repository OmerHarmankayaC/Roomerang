import { Menu, ChevronDown } from "lucide-react";
import { useNavigate, Link, useSearchParams } from "react-router";
import { useState } from "react";

const allRooms = [
  { id: 1, name: "Standard Room", pricePerNight: 850, total: 2550, nonRefundable: false },
  { id: 2, name: "Deluxe Room", pricePerNight: 620, total: 1860, nonRefundable: true },
  { id: 3, name: "Suite", pricePerNight: 1400, total: 4200, nonRefundable: false },
];

type SortOrder = "asc" | "desc";

export default function SearchResults() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [menuOpen, setMenuOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [sortOpen, setSortOpen] = useState(false);

  // Check if dates fall in fully booked period (Aug 10-20, 2026)
  const checkIn = searchParams.get("checkIn") || "2026-07-15";
  const checkOut = searchParams.get("checkOut") || "2026-07-18";

  const isFullyBooked = (checkIn >= "2026-08-10" && checkIn <= "2026-08-20") ||
                        (checkOut >= "2026-08-10" && checkOut <= "2026-08-20");

  const availableRooms = isFullyBooked ? [] : allRooms;

  const sorted = [...availableRooms].sort((a, b) =>
    sortOrder === "asc" ? a.total - b.total : b.total - a.total
  );

  const toggleSort = (order: SortOrder) => {
    setSortOrder(order);
    setSortOpen(false);
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

      {/* Search Summary */}
      <div className="px-4 py-3 bg-gray-50 border-b border-gray-300">
        <p className="text-sm text-gray-700">
          Check-in: <span className="font-medium">{new Date(checkIn).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span> — Check-out: <span className="font-medium">{new Date(checkOut).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}</span>{" "}
          <span className="text-gray-600">({Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24))} nights)</span>
        </p>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 relative">
        <p className="text-sm font-medium">
          {sorted.length > 0 ? `${sorted.length} rooms available` : "No rooms available"}
        </p>

        {/* Sort dropdown */}
        <div className="relative">
          <button
            onClick={() => setSortOpen(!sortOpen)}
            className="flex items-center gap-1 text-sm text-gray-700 border border-gray-300 px-2 py-1 rounded bg-white"
          >
            <span>Sort: Price {sortOrder === "asc" ? "↑" : "↓"}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-8 bg-white border border-gray-300 rounded shadow-md z-30 w-40">
              <button
                onClick={() => toggleSort("asc")}
                className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${sortOrder === "asc" ? "font-semibold" : ""}`}
              >
                Price: Low to High ↑
              </button>
              <button
                onClick={() => toggleSort("desc")}
                className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${sortOrder === "desc" ? "font-semibold" : ""}`}
              >
                Price: High to Low ↓
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Room Results */}
      <div className="px-4 py-4 space-y-3">
        {sorted.length === 0 ? (
          <div className="text-center py-10 px-4">
            <p className="text-gray-500 text-sm italic mb-2">
              No available rooms for the selected dates.
            </p>
            {isFullyBooked && (
              <p className="text-xs text-gray-400">
                August 10-20, 2026 is fully booked. Please try different dates.
              </p>
            )}
          </div>
        ) : (
          sorted.map((room) => (
            <div key={room.id} className="bg-gray-50 border border-gray-300 rounded-lg p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-1">{room.name}</h3>
                  {room.nonRefundable && (
                    <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded mb-2">
                      Non-Refundable
                    </span>
                  )}
                  <p className="text-sm text-gray-600">₺{room.pricePerNight.toLocaleString()}/night</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-600 mb-1">Total</p>
                  <p className="font-bold text-gray-900 mb-2">₺{room.total.toLocaleString()}</p>
                  <button
                    onClick={() => navigate("/booking")}
                    className="bg-gray-800 text-white text-sm px-4 py-1.5 rounded hover:bg-gray-700 transition-colors"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
