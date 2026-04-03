import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/organisms/Sidebar";
import { GlobalPlayer } from "../components/organisms/GlobalPlayer";
import { BottomNavBar } from "../components/organisms/BottomNavBar";
import { usePlayerStore } from "../store/player.store";
import { cn } from "../lib/utils";

export function MainLayout() {
  const { currentTrack } = usePlayerStore();

  return (
    <div className="flex min-h-screen bg-bg-primary">
      <Sidebar />

      {/* Main content area */}
      {/* Mobile: pb-16 for BottomNavBar, pb-36 when player is also visible (16+20) */}
      {/* Desktop: pb-0 normally, pb-20 when player is visible */}
      <main
        className={cn(
          "flex-1 md:ml-60 overflow-y-auto",
          currentTrack ? "pb-36 md:pb-20" : "pb-16 md:pb-0",
        )}
      >
        <Outlet />
      </main>

      <GlobalPlayer />
      <BottomNavBar />
    </div>
  );
}
