import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { X } from "lucide-react";
import { getRole, clearSession } from "../utils/auth";

type Room = {
  room: string;
  type: string;
  price: number;
  status: "Available" | "Occupied";
};

type Campaign = {
  id: number;
  name: string;
  discount: number;
  rooms: string[];
  startDate: string;
  endDate: string;
  active: boolean;
};

const initialRooms: Room[] = [
  { room: "101", type: "Standard", price: 850, status: "Occupied" },
  { room: "102", type: "Standard", price: 850, status: "Available" },
  { room: "201", type: "Deluxe", price: 1200, status: "Available" },
  { room: "204", type: "Deluxe", price: 1200, status: "Occupied" },
  { room: "301", type: "Suite", price: 1800, status: "Available" },
];

const initialCampaigns: Campaign[] = [
  { id: 1, name: "Early Bird 20%", discount: 20, rooms: ["101", "102", "201"], startDate: "2026-06-01", endDate: "2026-08-31", active: true },
];

export default function StaffInventory() {
  const [rooms, setRooms] = useState<Room[]>(initialRooms);
  const [editingRoom, setEditingRoom] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [priceError, setPriceError] = useState("");

  const [campaigns, setCampaigns] = useState<Campaign[]>(initialCampaigns);
  const [showCampaignForm, setShowCampaignForm] = useState(false);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);

  const [cName, setCName] = useState("");
  const [cDiscount, setCDiscount] = useState("");
  const [cRooms, setCRooms] = useState<string[]>([]);
  const [cStart, setCStart] = useState("");
  const [cEnd, setCEnd] = useState("");
  const [cError, setCError] = useState("");

  const navigate = useNavigate();
  const role = getRole();
  const isAdmin = role === "admin";

  useEffect(() => {
    if (!getRole()) navigate("/staff");
  }, [navigate]);

  const handleSignOut = () => {
    clearSession();
    navigate("/staff");
  };

  const startEdit = (room: Room) => {
    setEditingRoom(room.room);
    setEditPrice(String(room.price));
    setPriceError("");
  };

  const confirmPrice = (roomNo: string) => {
    const val = Number(editPrice);
    if (!editPrice || isNaN(val) || val <= 0 || !Number.isInteger(val)) {
      setPriceError("Please enter a valid positive whole number.");
      return;
    }
    setRooms((prev) => prev.map((r) => (r.room === roomNo ? { ...r, price: val } : r)));
    setEditingRoom(null);
    setPriceError("");
  };

  const openNewCampaign = () => {
    setEditingCampaign(null);
    setCName(""); setCDiscount(""); setCRooms([]); setCStart(""); setCEnd(""); setCError("");
    setShowCampaignForm(true);
  };

  const openEditCampaign = (c: Campaign) => {
    setEditingCampaign(c);
    setCName(c.name); setCDiscount(String(c.discount));
    setCRooms(c.rooms); setCStart(c.startDate); setCEnd(c.endDate); setCError("");
    setShowCampaignForm(true);
  };

  const toggleRoom = (roomNo: string) => {
    setCRooms((prev) => prev.includes(roomNo) ? prev.filter((r) => r !== roomNo) : [...prev, roomNo]);
  };

  const saveCampaign = () => {
    setCError("");
    const disc = Number(cDiscount);
    if (!cName.trim()) { setCError("Campaign name is required."); return; }
    if (!cDiscount || isNaN(disc) || disc <= 0 || disc > 100) { setCError("Discount must be between 1 and 100."); return; }
    if (cRooms.length === 0) { setCError("Select at least one room."); return; }
    if (!cStart || !cEnd || cEnd <= cStart) { setCError("End date must be after start date."); return; }

    if (editingCampaign) {
      setCampaigns((prev) => prev.map((c) => c.id === editingCampaign.id ? { ...c, name: cName, discount: disc, rooms: cRooms, startDate: cStart, endDate: cEnd } : c));
    } else {
      setCampaigns((prev) => [...prev, { id: Date.now(), name: cName, discount: disc, rooms: cRooms, startDate: cStart, endDate: cEnd, active: true }]);
    }
    setShowCampaignForm(false);
  };

  const toggleCampaignActive = (id: number) => {
    setCampaigns((prev) => prev.map((c) => (c.id === id ? { ...c, active: !c.active } : c)));
  };

  const activeCampaign = campaigns.find((c) => c.active);

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
        <Link to="/staff/walk-in" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors whitespace-nowrap">Walk-in</Link>
        <Link to="/staff/inventory" className="px-3 py-1.5 bg-gray-800 text-white text-sm rounded hover:bg-gray-700 transition-colors whitespace-nowrap">Inventory</Link>
        {isAdmin && (
          <Link to="/staff/monitor" className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded hover:bg-gray-300 transition-colors whitespace-nowrap">Monitor</Link>
        )}
      </div>

      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-300">
        <h2 className="text-xl font-bold text-gray-900">Room Inventory & Pricing</h2>
        {isAdmin && (
          <button onClick={openNewCampaign} className="px-3 py-1.5 border border-gray-400 rounded bg-white text-sm font-medium hover:bg-gray-50">
            + New Campaign
          </button>
        )}
      </div>

      {!isAdmin && (
        <div className="mx-4 mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <p className="text-sm text-blue-700">Pricing and campaign management requires Administrator access.</p>
        </div>
      )}

      {activeCampaign && (
        <div className="mx-4 mt-4 bg-yellow-50 border border-yellow-300 rounded-lg p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <p className="font-bold text-gray-900 mb-0.5">Active Campaign: {activeCampaign.name}</p>
              <p className="text-sm text-gray-600">{activeCampaign.discount}% off · Rooms: {activeCampaign.rooms.join(", ")} · Non-Refundable</p>
              <p className="text-xs text-gray-500 mt-0.5">{activeCampaign.startDate} → {activeCampaign.endDate}</p>
            </div>
            {isAdmin && (
              <div className="flex gap-1.5 flex-shrink-0">
                <button onClick={() => openEditCampaign(activeCampaign)} className="text-xs px-2 py-1 border border-gray-400 rounded bg-white hover:bg-gray-50">Edit</button>
                <button onClick={() => toggleCampaignActive(activeCampaign.id)} className="text-xs px-2 py-1 border border-red-300 rounded bg-red-50 text-red-600 hover:bg-red-100">Deactivate</button>
              </div>
            )}
          </div>
        </div>
      )}

      {campaigns.filter((c) => !c.active).map((c) => (
        <div key={c.id} className="mx-4 mt-2 bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between gap-2">
          <div>
            <p className="text-sm font-medium text-gray-500 line-through">{c.name}</p>
            <p className="text-xs text-gray-400">Inactive · {c.discount}% off</p>
          </div>
          {isAdmin && (
            <button onClick={() => toggleCampaignActive(c.id)} className="text-xs px-2 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50">Activate</button>
          )}
        </div>
      ))}

      <div className="mx-4 mt-4 mb-6 border border-gray-200 rounded-lg overflow-hidden">
        <div className="grid grid-cols-[45px_65px_1fr_75px_60px] gap-2 px-3 py-2 bg-gray-100 border-b border-gray-300">
          <span className="text-xs font-medium text-gray-600">Room</span>
          <span className="text-xs font-medium text-gray-600">Type</span>
          <span className="text-xs font-medium text-gray-600">Price/Night</span>
          <span className="text-xs font-medium text-gray-600">Status</span>
          <span className="text-xs font-medium text-gray-600">Action</span>
        </div>

        {rooms.map((room) => (
          <div key={room.room} className="border-b border-gray-100 last:border-b-0">
            <div className="grid grid-cols-[45px_65px_1fr_75px_60px] gap-2 px-3 py-3 items-center">
              <span className="text-sm text-gray-900">{room.room}</span>
              <span className="text-sm text-gray-900">{room.type}</span>
              <span className="text-sm text-gray-900">₺{room.price.toLocaleString()}</span>
              <span className={`text-sm font-medium ${room.status === "Available" ? "text-green-600" : "text-red-600"}`}>{room.status}</span>
              {isAdmin ? (
                <button
                  onClick={() => editingRoom === room.room ? setEditingRoom(null) : startEdit(room)}
                  className="text-xs text-blue-600 hover:underline"
                >
                  {editingRoom === room.room ? "Cancel" : "Edit"}
                </button>
              ) : (
                <span className="text-xs text-gray-400">—</span>
              )}
            </div>

            {isAdmin && editingRoom === room.room && (
              <div className="px-3 pb-3 bg-gray-50 border-t border-gray-100">
                <label className="block text-xs text-gray-500 mb-1 mt-2">New Price (₺/night)</label>
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      type="number"
                      min="1"
                      value={editPrice}
                      onChange={(e) => { setEditPrice(e.target.value); setPriceError(""); }}
                      className={`w-full px-2 py-1.5 border rounded text-sm bg-white ${priceError ? "border-red-400" : "border-gray-300"}`}
                      placeholder="e.g. 950"
                    />
                    {priceError && <p className="text-xs text-red-600 mt-1">{priceError}</p>}
                  </div>
                  <button onClick={() => confirmPrice(room.room)} className="px-3 py-1.5 bg-gray-800 text-white text-xs rounded hover:bg-gray-700">Confirm</button>
                  <button onClick={() => { setEditingRoom(null); setPriceError(""); }} className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs rounded hover:bg-gray-50">Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {showCampaignForm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end justify-center">
          <div className="w-[375px] bg-white rounded-t-2xl p-5 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">{editingCampaign ? "Edit Campaign" : "New Campaign"}</h3>
              <button onClick={() => setShowCampaignForm(false)}><X className="w-5 h-5 text-gray-500" /></button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-600 mb-1">Campaign Name</label>
                <input type="text" value={cName} onChange={(e) => setCName(e.target.value)} className="w-full px-3 py-2 border border-gray-300 bg-white rounded text-sm" placeholder="e.g. Early Bird 20%" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Discount (%)</label>
                <input type="number" min="1" max="100" value={cDiscount} onChange={(e) => setCDiscount(e.target.value)} className="w-full px-3 py-2 border border-gray-300 bg-white rounded text-sm" placeholder="e.g. 20" />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-2">Applicable Rooms</label>
                <div className="flex flex-wrap gap-2">
                  {rooms.map((r) => (
                    <button key={r.room} onClick={() => toggleRoom(r.room)} className={`px-3 py-1 text-sm rounded border transition-colors ${cRooms.includes(r.room) ? "bg-gray-800 text-white border-gray-800" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"}`}>
                      {r.room} ({r.type})
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">Start Date</label>
                  <input type="date" value={cStart} onChange={(e) => setCStart(e.target.value)} className="w-full px-3 py-2 border border-gray-300 bg-white rounded text-sm" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm text-gray-600 mb-1">End Date</label>
                  <input type="date" value={cEnd} onChange={(e) => setCEnd(e.target.value)} className="w-full px-3 py-2 border border-gray-300 bg-white rounded text-sm" />
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                <p className="text-xs text-gray-600">Rooms under this campaign will display a <strong>Non-Refundable</strong> tag on the guest website.</p>
              </div>
              {cError && <p className="text-xs text-red-600">{cError}</p>}
              <div className="flex gap-2 pt-1">
                <button onClick={saveCampaign} className="flex-1 bg-gray-800 text-white py-2.5 rounded font-medium text-sm hover:bg-gray-700">{editingCampaign ? "Save Changes" : "Activate Campaign"}</button>
                <button onClick={() => setShowCampaignForm(false)} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded font-medium text-sm hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
