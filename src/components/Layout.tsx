import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store/store';
import { toggleSidebar } from '@/store/uiSlice';
import Sidebar from './Sidebar';
import { Button } from './ui/button';
import { Menu } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const dispatch = useDispatch();
  const sidebarOpen = useSelector((state: RootState) => state.ui.sidebarOpen);

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <div className="p-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => dispatch(toggleSidebar())}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <main className="mt-4">{children}</main>
          </div>
        </div>
      </div>
    </div>
  );
}