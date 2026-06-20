import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import AdminLogin from './admin/AdminLogin';
import AdminDashboard from './admin/AdminDashboard';
import AdminLayout from './admin/AdminLayout';
import AdminProjects from './admin/AdminProjects';
import AdminExperiences from './admin/AdminExperiences';
import AdminSkills from './admin/AdminSkills';
import AdminTestimonials from './admin/AdminTestimonials';
import AdminMessages from './admin/AdminMessages';
import AdminAchievements from './admin/AdminAchievements';
import AdminAbout from './admin/AdminAbout';
import ProtectedRoute from './admin/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/admin" element={<AdminLogin />} />
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="projects" element={<AdminProjects />} />
        <Route path="experiences" element={<AdminExperiences />} />
        <Route path="skills" element={<AdminSkills />} />
        <Route path="testimonials" element={<AdminTestimonials />} />
        <Route path="messages" element={<AdminMessages />} />
        <Route path="achievements" element={<AdminAchievements />} />
        <Route path="about" element={<AdminAbout />} />
      </Route>
    </Routes>
  );
}
