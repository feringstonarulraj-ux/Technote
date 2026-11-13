import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';

import Home from './pages/Home';
import BlogListing from './pages/BlogListing';
import BlogDetail from './pages/BlogDetail';
import CategoryPage from './pages/CategoryPage';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import PostManagement from './pages/PostManagement';
import PostEditor from './pages/PostEditor';
import CategoryManagement from './pages/CategoryManagement';
import AuthorManagement from './pages/AuthorManagement';
import TagManagement from './pages/TagManagement';
import SubscriberManagement from './pages/SubscriberManagement';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="blogs" element={<BlogListing />} />
        <Route path="blog/:slug" element={<BlogDetail />} />
        <Route path="category/:slug" element={<CategoryPage />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="posts" element={<PostManagement />} />
        <Route path="posts/new" element={<PostEditor />} />
        <Route path="posts/:id/edit" element={<PostEditor />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="authors" element={<AuthorManagement />} />
        <Route path="tags" element={<TagManagement />} />
        <Route path="subscribers" element={<SubscriberManagement />} />
      </Route>
    </Routes>
  );
}
