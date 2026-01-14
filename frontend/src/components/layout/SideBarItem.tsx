import { NavLink } from "react-router-dom";

interface SideBarItemProps {
  to: string;
  icon: string;
  children: React.ReactNode;
}

export default function SideBarItem({ to, icon, children }: SideBarItemProps) {
  return (
      <NavLink
        to={to}
        end={true}
        className={({ isActive }) =>
          `flex items-center gap-3 px-4 py-2.5 rounded-lg transition font-medium
          ${
            isActive
              ? "bg-primary text-white"
              : "text-muted-foreground hover:bg-accent/10"
          }`
        }
      >
        <span className="material-symbols-outlined text-lg">{icon}</span>
        {children}
      </NavLink>
    );
  }