import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, FolderGit2, Briefcase, Code2, MessageSquare, Star, Award, User, Newspaper, LogOut } from 'lucide-react';

const sidebarLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/dashboard/projects', label: 'Projects', icon: FolderGit2 },
  { to: '/admin/dashboard/experiences', label: 'Experience', icon: Briefcase },
  { to: '/admin/dashboard/skills', label: 'Skills', icon: Code2 },
  { to: '/admin/dashboard/testimonials', label: 'Testimonials', icon: Star },
  { to: '/admin/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/dashboard/achievements', label: 'Achievements', icon: Award },
  { to: '/admin/dashboard/media-coverage', label: 'Media Coverage', icon: Newspaper },
  { to: '/admin/dashboard/about', label: 'About Me', icon: User },
];

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-dark flex">
      <aside className="w-64 glass border-r border-glass/5 p-4 flex flex-col flex-shrink-0">
        <div className="text-center py-6 border-b border-glass/5 mb-4">
          <span className="text-lg font-bold">
            <span className="text-primary">&lt;</span>Admin<span className="text-primary">/&gt;</span>
          </span>
        </div>

        <nav className="flex-1 space-y-1">
          {sidebarLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/admin/dashboard'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm transition-all ${
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted hover:text-main hover:bg-glass/5'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm text-muted hover:text-red-400 hover:bg-glass/5 transition-all mt-2"
        >
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto max-h-screen">
        <Outlet />
      </main>
    </div>
  );
}
