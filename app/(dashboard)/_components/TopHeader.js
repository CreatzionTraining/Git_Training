"use client";
import { UserButton } from "@clerk/nextjs";
import { AlignJustify, X } from "lucide-react";
import Image from "next/image";
import React from "react";

function TopHeader({ onToggleSidebar, isSidebarOpen }) {
  return (
    <div
      className="
        relative flex items-center px-4 h-[100px]
        border-b md:border-b-0 border-gray-200 bg-white
      "
    >
      {/* Toggle Button (mobile only) */}
      <div className="md:hidden">
        {isSidebarOpen ? (
          <X
            onClick={onToggleSidebar}
            className="w-6 h-6 cursor-pointer text-gray-700"
          />
        ) : (
          <AlignJustify
            onClick={onToggleSidebar}
            className="w-6 h-6 cursor-pointer text-gray-700"
          />
        )}
      </div>

      {/* Centered logo (mobile only) */}
      {!isSidebarOpen && (
        <div className="absolute left-1/2 transform -translate-x-1/2 md:static md:transform-none">
          <Image
            src="/logo3.png"
            alt="Logo"
            width={150}
            height={50}
            className="md:hidden block"
          />
        </div>
      )}

      {/* Right: User button always aligned to right */}
      <div className="ml-auto">
        <UserButton />
      </div>
    </div>
  );
}

export default TopHeader;
