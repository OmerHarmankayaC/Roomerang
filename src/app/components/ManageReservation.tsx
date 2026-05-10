import { Menu, AlertTriangle } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";

type ReservationState = "idle" | "not-found" | "found";
type ModifyState = "idle" | "editing" | "updated";
type CancelStep = "idle" | "confirming" | "done";
type CancelOutcome = "refund" | "forfeit" | "non-refundable";

const MOCK_REF = "ROM-20260715-0042";
const MOCK_EMAIL = "guest@example.com";
const DEPOSIT = "₺930";
const REMAINING = "₺930";
const CHECK_IN_ISO = "2026-07-15T14:00:00+03:00";

export default function ManageReservation() {
  const [menuOpen, setMenuOpen] = useState(false);

  const [ref, setRef] = useState("");
  const [email, setEmail] = useState("");
  const [lookupState, setLookupState] = useState<ReservationState>("idle");

  // SeR-7: rate limiting
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [blockedUntil, setBlockedUntil] = useState(0);

  const [checkIn, setCheckIn] = useState("15 Jul 2026");
  const [checkOut, setCheckOut] = useState("18 Jul 2026");

  const [modifyState, setModifyState] = useState<ModifyState>("idle");
  const [noAvailability, setNoAvailability] = useState(false);
  const [newCheckIn, setNewCheckIn] = useState("");
  const [newCheckOut, setNewCheckOut] = useState("");
  const [dateError, setDateError] = useState("");

  const [cancelStep, setCancelStep] = useState<CancelStep>("idle");
  const [cancelOutcome, setCancelOutcome] = useState<CancelOutcome>("refund");

  const isNonRefundable = false;
  const isBlocked = Date.now() < blockedUntil;
  const remainingBlockMin = isBlocked ? Math.max(1, Math.ceil((blockedUntil - Date.now()) / 60000)) : 0;

  const handleLookup = () => {
    if (isBlocked) return;
    if (ref.trim().toUpperCase() === MOCK_REF && email.trim().toLowerCase() === MOCK_EMAIL) {
      setLookupState("found");
      setFailedAttempts(0);
    } else {
      const next = failedAttempts + 1;
      setFailedAttempts(next);
      if (next >= 5) setBlockedUntil(Date.now() + 15 * 60 * 1000);
      setLookupState("not-found");
    }
  };

  const handleModifySubmit = () => {
    setDateError("");
    setNoAvailability(false);
    if (!newCheckIn || !newCheckOut) { setDateError("Please select both dates."); return; }
    if (newCheckOut <= newCheckIn) { setDateError("Check-out date must be after the check-in date."); return; }
    const available = true;
    if (!available) { setNoAvailability(true); return; }
    const fmt = (d: string) => new Date(d).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    setCheckIn(fmt(newCheckIn));
    setCheckOut(fmt(newCheckOut));
    setModifyState("updated");
  };

  const handleCancel = () => {
    if (isNonRefundable) {
      setCancelOutcome("non-refundable");
    } else {
      const checkInDate = new Date(CHECK_IN_ISO);
      const cutoff = new Date(checkInDate.getTime() - 48 * 60 * 60 * 1000);
      setCancelOutcome(Date.now() > cutoff.getTime() ? "forfeit" : "refund");
    }
    setCancelStep("confirming");
  };

  return (
    <div className="w-full h-full bg-white overflow-auto relative">
      <header className="flex items-center justify-between px-4 py-4 bg-gray-200 border-b border-gray-400">
        <Link to="/" className="text-xl font-bold tracking-wide">ROOMERANG</Link>
        <button className="p-1" onClick={() => setMenuOpen(!menuOpen)}>
          <Menu className="w-6 h-6" />
        </button>
      </header>

      {menuOpen && (
        <div className="absolute top-[57px] right-4 bg-white border border-gray-400 rounded shadow-lg z-50 w-56">
          <Link to="/" className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-200" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/manage" className="block px-4 py-3 hover:bg-gray-100 border-b border-gray-200" onClick={() => setMenuOpen(false)}>Manage Reservation</Link>
          <Link to="/staff" className="block px-4 py-3 hover:bg-gray-100" onClick={() => setMenuOpen(false)}>Staff Dashboard</Link>
        </div>
      )}

      <div className="px-4 py-4">
        <h2 className="text-2xl font-bold text-gray-900">Manage Your Reservation</h2>
      </div>

      <div className="mx-4 mt-2 bg-gray-50 border border-gray-300 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Look Up Booking</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Booking Reference No</label>
            <input
              type="text"
              value={ref}
              onChange={(e) => { setRef(e.target.value); setLookupState("idle"); }}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded"
              placeholder="e.g. ROM-20260715-0042"
              disabled={isBlocked}
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setLookupState("idle"); }}
              className={`w-full px-3 py-2 border rounded bg-white ${lookupState === "not-found" && !isBlocked ? "border-red-400" : "border-gray-300"}`}
              disabled={isBlocked}
            />
          </div>

          {lookupState === "not-found" && !isBlocked && (
            <p className="text-sm text-red-600">Reservation not found. Please check your booking reference and email address.</p>
          )}

          {isBlocked && (
            <p className="text-sm text-red-600">
              Too many failed attempts. Please try again in {remainingBlockMin} minute{remainingBlockMin !== 1 ? "s" : ""}.
            </p>
          )}

          <button
            onClick={handleLookup}
            disabled={isBlocked}
            className="w-full bg-gray-800 text-white py-3 rounded font-medium hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Find Reservation
          </button>
        </div>
      </div>

      {lookupState === "found" && (
        <>
          <div className="mx-4 mt-4 bg-gray-50 border border-gray-300 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-4">Reservation Details</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ref:</span>
                <span className="font-medium text-gray-900">ROM-20260715-0042</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room:</span>
                <span className="font-medium text-gray-900">Deluxe Room</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-in:</span>
                <span className="font-medium text-gray-900">{checkIn}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Check-out:</span>
                <span className="font-medium text-gray-900">{checkOut}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deposit Paid:</span>
                <span className="font-medium text-gray-900">{DEPOSIT}</span>
              </div>
              {cancelStep !== "done" && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Remaining Balance:</span>
                  <span className="font-medium text-gray-900">{REMAINING} (due at check-in)</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className={`font-medium ${cancelStep === "done" ? "text-red-600" : "text-green-600"}`}>
                  {cancelStep === "done" ? "Cancelled" : "Confirmed"}
                </span>
              </div>
            </div>
          </div>

          {cancelStep === "done" && (
            <div className="mx-4 mt-4 bg-gray-50 border border-gray-300 rounded-lg p-4">
              <p className="text-sm font-semibold text-gray-800 mb-1">Cancellation Processed</p>
              <p className="text-sm text-gray-600">
                {cancelOutcome === "refund" && `Your deposit of ${DEPOSIT} will be fully refunded within 5–7 business days.`}
                {cancelOutcome === "forfeit" && "Your deposit has been forfeited due to late cancellation (within 48 hours of check-in)."}
                {cancelOutcome === "non-refundable" && "This booking was non-refundable. No refund has been issued."}
              </p>
            </div>
          )}

          {cancelStep === "idle" && (
            <div className="mx-4 mt-4 bg-yellow-50 border border-yellow-300 rounded-lg p-3 flex gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-800">
                {isNonRefundable
                  ? <><span className="font-semibold">Non-Refundable:</span> This booking was made under an Early Bird Discount. No refund will be issued upon cancellation.</>
                  : <><span className="font-semibold">Cancellation Policy:</span> Full deposit refund if cancelled at least 48 hours before check-in. Later cancellations forfeit the deposit.</>
                }
              </p>
            </div>
          )}

          {cancelStep === "idle" && (
            <div className="mx-4 mt-4 flex gap-2">
              <button
                onClick={() => { setModifyState(modifyState === "editing" ? "idle" : "editing"); setDateError(""); }}
                className="flex-1 bg-white text-gray-700 border border-gray-400 py-2.5 rounded font-medium hover:bg-gray-50 transition-colors"
              >
                Modify Dates
              </button>
              <button
                onClick={handleCancel}
                className="flex-1 bg-red-50 text-red-600 border border-red-400 py-2.5 rounded font-medium hover:bg-red-100 transition-colors"
              >
                Cancel Booking
              </button>
            </div>
          )}

          {cancelStep === "confirming" && (
            <div className="mx-4 mt-4 bg-red-50 border border-red-300 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Confirm Cancellation</h3>
              <p className="text-sm text-gray-800 mb-4">
                {cancelOutcome === "non-refundable" && "This booking is non-refundable. No refund will be issued upon cancellation."}
                {cancelOutcome === "forfeit" && "Cancellation is within 48 hours of check-in. Your deposit will be forfeited."}
                {cancelOutcome === "refund" && `Your deposit of ${DEPOSIT} will be fully refunded within 5–7 business days.`}
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCancelStep("done")}
                  className="flex-1 bg-red-600 text-white py-2 rounded text-sm font-medium hover:bg-red-700 transition-colors"
                >
                  Confirm Cancellation
                </button>
                <button
                  onClick={() => setCancelStep("idle")}
                  className="flex-1 bg-white text-gray-700 border border-gray-300 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}

          {modifyState === "editing" && cancelStep === "idle" && (
            <div className="mx-4 mt-3 bg-gray-50 border border-gray-300 rounded-lg p-4 space-y-3">
              <p className="text-sm font-semibold text-gray-800">Select New Dates</p>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">New Check-in</label>
                  <input type="date" value={newCheckIn} onChange={(e) => { setNewCheckIn(e.target.value); setDateError(""); }} placeholder="dd.mm.yyyy" className="w-full px-3 py-2 border border-gray-300 bg-white rounded text-sm" />
                </div>
                <div className="flex-1">
                  <label className="block text-xs text-gray-500 mb-1">New Check-out</label>
                  <input type="date" value={newCheckOut} onChange={(e) => { setNewCheckOut(e.target.value); setDateError(""); }} placeholder="dd.mm.yyyy" className={`w-full px-3 py-2 border rounded text-sm bg-white ${dateError ? "border-red-400" : "border-gray-300"}`} />
                </div>
              </div>
              {dateError && <p className="text-xs text-red-600">{dateError}</p>}
              {noAvailability && (
                <p className="text-xs text-red-600">No availability for the selected dates. Please choose different dates.</p>
              )}
              <div className="flex gap-2">
                <button onClick={handleModifySubmit} className="flex-1 bg-gray-800 text-white py-2 rounded text-sm font-medium hover:bg-gray-700 transition-colors">Confirm New Dates</button>
                <button onClick={() => { setModifyState("idle"); setDateError(""); }} className="flex-1 bg-white text-gray-700 border border-gray-300 py-2 rounded text-sm font-medium hover:bg-gray-50 transition-colors">Cancel</button>
              </div>
            </div>
          )}

          {modifyState === "updated" && cancelStep === "idle" && (
            <div className="mx-4 mt-3 bg-green-50 border border-green-300 rounded-lg p-3">
              <p className="text-sm text-green-700 font-medium">✓ Dates updated. A confirmation email has been sent.</p>
            </div>
          )}
        </>
      )}

      <div className="h-6" />
    </div>
  );
}
