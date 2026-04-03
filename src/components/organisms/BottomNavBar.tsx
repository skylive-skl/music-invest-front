import { NavLink } from "react-router-dom";
import { Home, Search, Heart, TrendingUp, Clapperboard, User } from "lucide-react";
import { useAuthStore } from "../../store/auth.store";
import { cn } from "../../lib/utils";

const investorItems = [
  { to: "/", icon: Home, label: "Главная" },
  { to: "/search", icon: Search, label: "Поиск" },
  { to: "/collection", icon: Heart, label: "Коллекция" },
  { to: "/investments", icon: TrendingUp, label: "Инвестиции" },
  { to: "/profile", icon: User, label: "Профиль" },
];

const artistItems = [
  { to: "/", icon: Home, label: "Главная" },
  { to: "/search", icon: Search, label: "Поиск" },
  { to: "/collection", icon: Heart, label: "Коллекция" },
  { to: "/my-projects", icon: Clapperboard, label: "Проекты" },
  { to: "/profile", icon: User, label: "Профиль" },
];

export function BottomNavBar() {
  const { user, isAuthenticated } = useAuthStore();
  const isArtist =
    isAuthenticated &&
    user &&
    (user.role === "ARTIST" || user.role === "ADMIN");

  const items = isArtist ? artistItems : investorItems;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-bg-secondary border-t border-border">
      <div className="flex items-stretch h-16">
        {items.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors",
                isActive
                  ? "text-accent-purple"
                  : "text-text-muted hover:text-text-secondary",
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={20}
                  className={cn(
                    "transition-transform",
                    isActive && "scale-110",
                  )}
                />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
