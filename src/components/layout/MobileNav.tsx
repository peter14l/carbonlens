import { NavLink } from "react-router-dom";
import { LayoutDashboard, Activity, Calculator, Lightbulb, Target, User } from "lucide-react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/activities", label: "Activities", icon: Activity },
  { to: "/calculator", label: "Calculator", icon: Calculator },
  { to: "/insights", label: "Insights", icon: Lightbulb },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/profile", label: "Profile", icon: User },
];

export default function MobileNav() {
  return (
    <nav
      className="
        fixed inset-x-0 bottom-0 z-50
        flex items-center justify-around
        h-16 px-2
        bg-white/80 dark:bg-gray-900/80
        backdrop-blur-xl
        border-t border-emerald-200 dark:border-gray-800
        lg:hidden
      "
    >
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            `
              flex flex-col items-center justify-center gap-0.5
              w-full h-full py-1 rounded-xl
              text-[10px] font-medium
              transition-colors duration-200
              ${
                isActive
                  ? "text-emerald-600 dark:text-emerald-400"
                  : "text-gray-400 dark:text-gray-500"
              }
            `
          }
        >
          {({ isActive }) => (
            <>
              <div
                className={`
                  flex items-center justify-center w-8 h-8 rounded-lg
                  transition-colors duration-200
                  ${
                    isActive
                      ? "bg-emerald-100 dark:bg-emerald-900/40"
                      : ""
                  }
                `}
              >
                <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
