"use client";
import { UserButton } from "@clerk/nextjs";
import { AlignJustify, X } from "lucide-react";
import Image from "next/image";
import React from "react";

function TopHeader({ onToggleSidebar, isSidebarOpen }) {
  return (
    <div
      className="
        relative flex items-center justify-between px-4 h-[80px]
        border-b border-gray-200 bg-white
      "
    >
      {/* Toggle Button (mobile only) */}
      <div className="md:hidden flex items-center">
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

      {/* Mobile-only logo with placeholder to avoid jump */}
      <div className="flex-1 flex justify-center md:hidden">
        {!isSidebarOpen ? (
          <Image
            src="/logo3.png"
            alt="Logo"
            width={140}
            height={50}
            className="block object-contain"
            priority
          />
        ) : (
          <div className="w-[140px] h-[50px]" /> // placeholder
        )}
      </div>

      {/* Right: User button */}
      <div className="ml-auto flex items-center">
        <UserButton />
      </div>
    </div>
  );
}

export default TopHeader;
