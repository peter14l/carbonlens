import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import MobileNav from "./MobileNav";
import { useAppStore } from "../../store/useAppStore";
import { useEffect } from "react";

export default function Layout() {
  const { theme } = useAppStore();

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <div className="flex min-h-screen bg-white text-gray-900 dark:bg-gray-950 dark:text-gray-100">
      <Sidebar />

      <main id="main-content" className="flex-1 min-h-screen lg:pb-0 pb-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <Outlet />
        </div>
      </main>

      <MobileNav />
    </div>
  );
}
