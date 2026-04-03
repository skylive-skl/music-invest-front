import { useNavigate, Link } from "react-router-dom";
import {
  LogOut,
  TrendingUp,
  Clapperboard,
  Wallet,
  Heart,
  ChevronRight,
  Mail,
  Shield,
} from "lucide-react";
import { useAuthStore } from "../store/auth.store";
import { Avatar } from "../components/atoms/Avatar";

export function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!isAuthenticated || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 px-6">
        <div className="w-16 h-16 rounded-full bg-bg-elevated flex items-center justify-center">
          <Shield size={32} className="text-text-muted" />
        </div>
        <h2 className="text-xl font-bold text-text-primary">Вы не вошли</h2>
        <p className="text-text-muted text-center text-sm">
          Войдите в аккаунт, чтобы управлять профилем
        </p>
        <Link
          to="/login"
          className="btn-primary px-8 py-3 rounded-xl font-semibold"
        >
          Войти
        </Link>
      </div>
    );
  }

  const isArtist = user.role === "ARTIST" || user.role === "ADMIN";

  const menuItems = [
    ...(isArtist
      ? [{ to: "/my-projects", icon: Clapperboard, label: "Мои проекты" }]
      : [{ to: "/investments", icon: TrendingUp, label: "Инвестиции" }]),
    { to: "/collection", icon: Heart, label: "Моя коллекция" },
    { to: "/wallet", icon: Wallet, label: "Кошелёк" },
  ];

  const roleLabel: Record<string, string> = {
    INVESTOR: "Инвестор",
    ARTIST: "Артист",
    ADMIN: "Администратор",
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-6 pb-24 md:pb-6">
      <h1 className="text-2xl font-bold text-text-primary mb-6">Профиль</h1>

      {/* User card */}
      <div className="card p-6 flex flex-col items-center text-center mb-6">
        <Avatar name={user.email} size="lg" className="w-20 h-20 text-2xl mb-4" />
        <h2 className="text-xl font-bold text-text-primary">
          {user.email.split("@")[0]}
        </h2>
        <span className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-purple/15 text-accent-purple-light text-xs font-semibold">
          <Shield size={11} />
          {roleLabel[user.role] ?? user.role}
        </span>
        <div className="mt-3 flex items-center gap-1.5 text-text-muted text-sm">
          <Mail size={14} />
          <span>{user.email}</span>
        </div>
      </div>

      {/* Quick links */}
      <div className="card divide-y divide-border mb-6">
        {menuItems.map(({ to, icon: Icon, label }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-3 px-4 py-3.5 hover:bg-bg-elevated transition-colors first:rounded-t-xl last:rounded-b-xl"
          >
            <span className="w-8 h-8 rounded-lg bg-accent-purple/10 flex items-center justify-center">
              <Icon size={16} className="text-accent-purple" />
            </span>
            <span className="flex-1 text-sm font-medium text-text-primary">
              {label}
            </span>
            <ChevronRight size={16} className="text-text-muted" />
          </Link>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-danger/30 text-danger font-semibold text-sm hover:bg-danger/10 transition-colors"
      >
        <LogOut size={16} />
        Выйти из аккаунта
      </button>
    </div>
  );
}
