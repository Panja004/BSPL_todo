"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Navbar() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoading(true);
      Cookies.remove("token", { path: "/" });

      const res = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error("Logout failed");
      }

      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="text-xl font-bold text-gray-900">Todo App</div>
          <button
            onClick={handleLogout}
            disabled={isLoading}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors
              ${isLoading 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
              }`}
          >
            {isLoading ? "Signing out..." : "Sign out"}
          </button>
        </div>
      </div>
    </nav>
  );
}
