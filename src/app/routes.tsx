import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./components/Home";
import SearchResults from "./components/SearchResults";
import BookingPage from "./components/BookingPage";
import ConfirmationPage from "./components/ConfirmationPage";
import ManageReservation from "./components/ManageReservation";
import StaffLogin from "./components/StaffLogin";
import StaffDashboard from "./components/StaffDashboard";
import StaffDailyReservations from "./components/StaffDailyReservations";
import StaffWalkInRegistration from "./components/StaffWalkInRegistration";
import StaffInventory from "./components/StaffInventory";
import StaffMonitor from "./components/StaffMonitor";

export const router = createBrowserRouter([
  {
    Component: Layout,
    children: [
      {
        path: "/",
        Component: Home,
      },
      {
        path: "/search",
        Component: SearchResults,
      },
      {
        path: "/booking",
        Component: BookingPage,
      },
      {
        path: "/confirmation",
        Component: ConfirmationPage,
      },
      {
        path: "/manage",
        Component: ManageReservation,
      },
      {
        path: "/staff",
        Component: StaffLogin,
      },
      {
        path: "/staff/dashboard",
        Component: StaffDashboard,
      },
      {
        path: "/staff/daily",
        Component: StaffDailyReservations,
      },
      {
        path: "/staff/walk-in",
        Component: StaffWalkInRegistration,
      },
      {
        path: "/staff/inventory",
        Component: StaffInventory,
      },
      {
        path: "/staff/monitor",
        Component: StaffMonitor,
      },
    ],
  },
]);
