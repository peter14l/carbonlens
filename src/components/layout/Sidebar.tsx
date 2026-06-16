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
        bg-gray-50 border-r border-gray-200
        dark:bg-gray-950 dark:border-gray-800
        transition-all duration-200
        ${collapsed ? "w-[60px]" : "w-56"}
      `}
    >
      <div className="flex items-center gap-2.5 px-4 h-14 border-b border-gray-200 dark:border-gray-800">
        <Link to="/" className="flex items-center gap-2 overflow-hidden">
          <div className="flex items-center justify-center w-7 h-7 rounded-md bg-gray-900 dark:bg-white shrink-0">
            <Leaf className="w-3.5 h-3.5 text-white dark:text-gray-900" />
          </div>
          {!collapsed && (
            <span className="text-sm font-semibold text-gray-900 dark:text-white whitespace-nowrap tracking-tight">
              CarbonLens
            </span>
          )}
        </Link>
      </div>

      <nav className="flex-1 flex flex-col gap-0.5 px-2 py-3 overflow-y-auto" aria-label="Main navigation">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `
                flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm font-medium
                transition-colors duration-100
                ${
                  isActive
                    ? "bg-gray-900 text-white dark:bg-white dark:text-gray-900"
                    : "text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                }
              `
            }
          >
            <Icon className="w-4 h-4 shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="px-2 pb-3 flex flex-col gap-0.5">
        <button
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          className="
            hidden xl:flex items-center gap-2 px-2.5 py-2 rounded-md text-sm
            text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300
            transition-colors duration-100
          "
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <>
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </>
          )}
        </button>

        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="
            flex items-center gap-2 px-2.5 py-2 rounded-md text-sm
            text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200
            transition-colors duration-100
          "
        >
          {theme === "dark" ? (
            <Sun className="w-4 h-4 shrink-0" />
          ) : (
            <Moon className="w-4 h-4 shrink-0" />
          )}
          {!collapsed && (
            <span>{theme === "dark" ? "Light" : "Dark"}</span>
          )}
        </button>
      </div>
    </aside>
  );
}
