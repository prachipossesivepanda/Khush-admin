// BottomNavLayout.jsx
import { Outlet } from "react-router-dom";
import BottomNavbar from "../common/bottomnavbar";

export default function BottomNavLayout() {
  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Page Content */}
      <main className="flex-1 pb-20">
        <Outlet />
      </main>

      {/* Bottom Navbar */}
      <BottomNavbar />
    </div>
  );
}