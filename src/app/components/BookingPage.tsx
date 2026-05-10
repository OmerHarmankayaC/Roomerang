import { Menu, AlertTriangle } from "lucide-react";
import { useNavigate, Link } from "react-router";
import { useState } from "react";

export default function BookingPage() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [paymentError, setPaymentError] = useState(false);
  const [validationError, setValidationError] = useState("");

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");

  // Simulates a room that has an active early bird discount
  const isNonRefundable = true;

  const handleConfirm = () => {
    setPaymentError(false);
    setValidationError("");

    // Validate all required fields
    if (!fullName.trim()) {
      setValidationError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setValidationError("Please enter your email address.");
      return;
    }
    if (!phone.trim()) {
      setValidationError("Please enter your phone number.");
      return;
    }
    if (!cardNumber.trim()) {
      setValidationError("Please enter your card number.");
      return;
    }
    if (!expiry.trim()) {
      setValidationError("Please enter card expiry date.");
      return;
    }
    if (!cvv.trim()) {
      setValidationError("Please enter CVV.");
      return;
    }

    // Simulate occasional payment failure for demo — toggle to true to show error state
    const paymentFailed = false;
    if (paymentFailed) {
      setPaymentError(true);
      return;
    }
    navigate("/confirmation");
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

      {/* Room Info */}
      <div className="px-4 py-4 border-b border-gray-300">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Deluxe Room</h2>
        <p className="text-sm text-gray-600">15 Jul — 18 Jul · 3 nights · ₺1,860 total</p>
      </div>

      {/* Non-Refundable Warning Banner (FR-02-8) */}
      {isNonRefundable && (
        <div className="mx-4 mt-4 flex items-start gap-2 bg-red-50 border border-red-300 rounded-lg p-3">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">
            <span className="font-semibold">Non-Refundable Rate:</span> This room is booked under an Early Bird Discount. The deposit is strictly non-refundable regardless of cancellation timing.
          </p>
        </div>
      )}

      {/* Photo Gallery Placeholder */}
      <div className="mx-4 mt-4 h-48 border-2 border-dashed border-gray-400 bg-gray-100 flex items-center justify-center">
        <p className="text-gray-600 text-center px-4">Room Photo Gallery</p>
      </div>

      {/* Guest Information Card */}
      <div className="mx-4 mt-4 bg-gray-50 border border-gray-300 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Guest Information</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded"
            />
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded"
            />
          </div>
        </div>
      </div>

      {/* Payment Details Card */}
      <div className="mx-4 mt-4 bg-gray-50 border border-gray-300 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Payment Details (Deposit)</h3>

        <div className="bg-gray-200 border border-gray-400 rounded p-3 mb-4 text-sm">
          <p className="text-gray-800 mb-1">Deposit: <span className="font-medium">₺930 (50% of total)</span></p>
          <p className="text-gray-800">Remaining at check-in: <span className="font-medium">₺930</span></p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 bg-white rounded"
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">Expiry (MM/YY)</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-600 mb-1">CVV</label>
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 bg-white rounded"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Validation Error */}
      {validationError && (
        <div className="mx-4 mt-4 flex items-start gap-2 bg-red-50 border border-red-300 rounded-lg p-3">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{validationError}</p>
        </div>
      )}

      {/* Payment Error (FR-02-10) */}
      {paymentError && (
        <div className="mx-4 mt-4 flex items-start gap-2 bg-red-50 border border-red-300 rounded-lg p-3">
          <AlertTriangle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">
            Payment could not be processed. Please check your card details and try again.
          </p>
        </div>
      )}

      {/* Confirm Button */}
      <div className="mx-4 mt-6 mb-6">
        <button
          onClick={handleConfirm}
          className="w-full bg-gray-800 text-white py-3 rounded font-medium hover:bg-gray-700 transition-colors"
        >
          Pay Deposit & Confirm Booking
        </button>
      </div>
    </div>
  );
}
