import { useEffect, useState } from 'react';
import { FolderGit2, Briefcase, Code2, Star, MessageSquare } from 'lucide-react';
import api from '@/api';

export default function AdminDashboard() {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      const sections = ['projects', 'experiences', 'skills', 'testimonials', 'messages'];
      const results = await Promise.all(
        sections.map(async (s) => {
          try {
            const { data } = await api.get(`/${s}`);
            return { label: s.charAt(0).toUpperCase() + s.slice(1), count: data.length };
          } catch {
            return { label: s, count: 0 };
          }
        })
      );
      setStats(results);
    };
    fetchStats();
  }, []);

  const icons = [FolderGit2, Briefcase, Code2, Star, MessageSquare];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
        {stats.map((stat, i) => {
          const Icon = icons[i];
          return (
            <div key={stat.label} className="glass rounded-2xl p-6">
              <Icon className="text-primary mb-4" size={28} />
              <p className="text-3xl font-bold">{stat.count}</p>
              <p className="text-sm text-gray-400 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-12 glass rounded-2xl p-8 text-center">
        <h2 className="text-lg font-semibold mb-2">Welcome to your Portfolio Admin</h2>
        <p className="text-sm text-gray-400">
          Use the sidebar to manage your portfolio content. All changes are saved to MongoDB.
        </p>
      </div>
    </div>
  );
}
