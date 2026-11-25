import { useState } from "react";

import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* DESKTOP SIDEBAR */}

      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* MOBILE SIDEBAR */}

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* OVERLAY */}

          <button
            type="button"
            className="absolute inset-0 bg-black/40"
            onClick={closeMobileMenu}
            aria-label="Đóng menu"
          />

          {/* SIDEBAR PANEL */}

          <div className="relative h-full w-64 bg-white shadow-xl">
            <Sidebar
              collapsed={false}
              setCollapsed={() => closeMobileMenu()}
              mobile
              onClose={closeMobileMenu}
            />
          </div>
        </div>
      )}

      {/* MAIN CONTENT */}

      <div className="min-w-0 flex-1">
        <Header onMenuClick={() => setMobileMenuOpen(true)} />

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
