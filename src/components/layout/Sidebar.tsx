import { NavLink, Link } from "react-router-dom";
import { Leaf, LayoutDashboard, Activity, Calculator, Lightbulb, Target, User, Sun, Moon, ChevronLeft, ChevronRight } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import { useState } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/activities", label: "Activities", icon: Activity },
  { to: "/calculator", label: "Calculator", icon: Calculator },
  { to: "/insights", label: "Insights", icon: Lightbulb },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const { theme, toggleTheme } = useAppStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        hidden lg:flex flex-col h-screen sticky top-0
        bg-emerald-50 dark:bg-gray-900
        border-r border-emerald-200 dark:border-gray-800
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-[68px]" : "w-64"}
      `}
    >
      <div className="flex items-center gap-3 px-4 h-16 border-b border-emerald-200 dark:border-gray-800">
        <Link to="/" className="flex items-center gap-2.5 overflow-hidden">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-emerald-500 text-white shrink-0">
            <Leaf className="w-5 h-5" />
          </div>
          {!collapsed && (
            <span className="text-lg font-bold text-emerald-800 dark:text-emerald-100 whitespace-nowrap">
              CarbonLens
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-1 px-2 py-4 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `
                group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                transition-all duration-200
                ${
                  isActive
                    ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/25"
                    : "text-gray-600 dark:text-gray-400 hover:bg-emerald-100 dark:hover:bg-gray-800 hover:text-emerald-700 dark:hover:text-emerald-300"
                }
              `
            }
          >
            <Icon className="w-5 h-5 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 pb-4 flex flex-col gap-1">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="
            hidden xl:flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-sm font-medium
            text-gray-500 dark:text-gray-400
            hover:bg-emerald-100 dark:hover:bg-gray-800
            transition-colors duration-200
          "
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>

        <button
          onClick={toggleTheme}
          className="
            flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
            text-gray-600 dark:text-gray-400
            hover:bg-emerald-100 dark:hover:bg-gray-800
            hover:text-emerald-700 dark:hover:text-emerald-300
            transition-colors duration-200
          "
        >
          {theme === "dark" ? (
            <Sun className="w-5 h-5 shrink-0" />
          ) : (
            <Moon className="w-5 h-5 shrink-0" />
          )}
          {!collapsed && (
            <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
