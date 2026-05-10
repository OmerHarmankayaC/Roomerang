import { Outlet, useLocation } from "react-router";

export default function Layout() {
  const location = useLocation();
  const isStaffRoute = location.pathname.startsWith('/staff');

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      {isStaffRoute ? (
        /* Desktop Frame for Staff */
        <div className="w-[1440px] h-[900px] bg-white shadow-2xl overflow-hidden">
          <Outlet />
        </div>
      ) : (
        /* Mobile Frame for Customer */
        <div className="w-[375px] h-[812px] bg-white shadow-2xl overflow-hidden">
          <Outlet />
        </div>
      )}
    </div>
  );
}
