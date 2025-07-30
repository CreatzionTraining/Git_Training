"use client";
import React, { useState, useEffect } from "react";
import SideNav from "./_components/SideNav";
import TopHeader from "./_components/TopHeader";
import Upload from "./(routes)/upload/page";

function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize(); // initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClick = (e) => {
      if (
        isSidebarOpen &&
        !e.target.closest(".sidebar") &&
        !e.target.closest(".toggle-btn")
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [isSidebarOpen]);

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      {/* Sidebar */}
      <div
        className={`sidebar fixed md:static inset-y-0 left-0 z-50 w-60 transform transition-transform duration-300 
        bg-white shadow-sm border-r border-gray-200 
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0`}
      >
        <SideNav />
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        <TopHeader
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isSidebarOpen={isSidebarOpen}
        />

        {/* ✅ Add full-width bottom border only on desktop */}
        {!isMobile && (
          <div className="h-px bg-gray-200 w-full" />
        )}
        <Upload />
        <main className="flex-1 overflow-y-auto p-4">{children}</main>
      </div>
    </div>
  );
}

export default Layout;
