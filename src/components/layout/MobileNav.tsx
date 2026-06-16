import { NavLink } from "react-router-dom";
import { LayoutDashboard, Activity, Calculator, Lightbulb, Target, User } from "lucide-react";

const navItems = [
  { to: "/", label: "Home", icon: LayoutDashboard },
  { to: "/activities", label: "Log", icon: Activity },
  { to: "/calculator", label: "Calc", icon: Calculator },
  { to: "/insights", label: "Insights", icon: Lightbulb },
  { to: "/goals", label: "Goals", icon: Target },
  { to: "/profile", label: "Profile", icon: User },
];

export default function MobileNav() {
  return (
    <nav
      aria-label="Mobile navigation"
      className="
        fixed inset-x-0 bottom-0 z-50
        flex items-center justify-around
        h-14 px-1
        bg-white border-t border-gray-200
        dark:bg-gray-950 dark:border-gray-800
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
              w-full h-full py-1
              text-[10px] font-medium
              transition-colors duration-100
              ${
                isActive
                  ? "text-gray-900 dark:text-white"
                  : "text-gray-400 dark:text-gray-500"
              }
            `
          }
        >
          {({ isActive }) => (
            <>
              <Icon className="w-4.5 h-4.5" strokeWidth={isActive ? 2.2 : 1.8} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
