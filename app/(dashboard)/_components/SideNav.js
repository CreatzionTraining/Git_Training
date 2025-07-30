"use client";
import { File, Shield, Upload } from "lucide-react";
import Image from "next/image";
import React, { useState } from "react";

function SideNav() {
  const menuList = [
    { id: 1, name: "Upload", icon: Upload, path: "/upload" },
    { id: 2, name: "Files", icon: File, path: "/files" },
    { id: 3, name: "Upgrade", icon: Shield, path: "/upgrade" },
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="h-full w-60 bg-white border-r border-gray-200">
      {/* Logo box: match header height */}
      <div className="h-[100px] flex items-center justify-center px-5 border">
        <Image src="/logo3.png" alt="Logo" width={150} height={100} />
      </div>

      <div className="flex flex-col">
        {menuList.map((item, index) => (
          <button
            key={item.id}
            onClick={() => setActiveIndex(index)}
            className={`flex items-center gap-3 px-6 py-4 text-left w-full transition-colors ${
              activeIndex === index
                ? "bg-blue-50 text-primary"
                : "text-gray-500 hover:bg-gray-100"
            }`}
          >
            <item.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default SideNav;
