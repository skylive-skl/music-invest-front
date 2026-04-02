import { Outlet } from 'react-router-dom';
import { Sidebar } from '../components/organisms/Sidebar';
import { GlobalPlayer } from '../components/organisms/GlobalPlayer';
import { usePlayerStore } from '../store/player.store';

export function MainLayout() {
  const { currentTrack } = usePlayerStore();

  return (
    <div className="flex min-h-screen bg-bg-primary">
      <Sidebar />

      {/* Main content area */}
      <main
        className="flex-1 ml-60 overflow-y-auto"
        style={{ paddingBottom: currentTrack ? '5rem' : '0' }}
      >
        <Outlet />
      </main>

      <GlobalPlayer />
    </div>
  );
}
