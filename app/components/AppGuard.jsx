"use client";
import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useAuthStore from "@/store/authStore";
import Sidebar from "./Sidebar";

const publicRoutes = ["/login"];

export default function AppGuard({ children }) {
  const { isLoggedIn, isAuthLoaded, loadFromStorage, setAuthLoading } =
    useAuthStore();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setAuthLoading();
    loadFromStorage();
  }, [loadFromStorage, setAuthLoading]);

  useEffect(() => {
    if (!isAuthLoaded) return;

    if (isLoggedIn && pathname === "/login") {
      router.replace("/");
    } else if (!isLoggedIn && !publicRoutes.includes(pathname)) {
      router.replace("/login");
    }
  }, [isAuthLoaded, isLoggedIn, pathname, router]);

  if (!isLoggedIn && !publicRoutes.includes(pathname)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  if (isLoggedIn && pathname === "/login") {
    return null;
  }

  return isLoggedIn ? (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />
      <main className="flex-1 min-w-0 w-full flex flex-col overflow-y-auto">
        {children}
      </main>
    </div>
  ) : (
    children
  );
}
