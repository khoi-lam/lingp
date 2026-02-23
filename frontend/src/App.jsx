import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Support from './pages/Support';
import Login from './pages/Login';
import ARScanner from './pages/ARScanner';
import WatchVideo from './pages/WatchVideo';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminProductEditor from './pages/admin/AdminProductEditor';
import AdminOrders from './pages/admin/AdminOrders';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import AdminSupport from './pages/admin/AdminSupport';
import AdminCategories from './pages/admin/AdminCategories';
import AdminBookLens from './pages/admin/AdminARVideos';
import AdminSettings from './pages/admin/AdminSettings';

function Layout({ children, showNav = true, showFooter = true }) {
  return (
    <div className="min-h-screen flex flex-col">
      {showNav && <Navbar />}
      <main className="flex-grow">{children}</main>
      {showFooter && <Footer />}
    </div>
  );
}

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;
  return <AdminLayout>{children}</AdminLayout>;
}

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/shop" element={<Layout><Shop /></Layout>} />
        <Route path="/product/:id" element={<Layout><ProductDetail /></Layout>} />
        <Route path="/cart" element={<Layout><Cart /></Layout>} />
        <Route path="/checkout" element={<Layout><Checkout /></Layout>} />
        <Route path="/support" element={<Layout><Support /></Layout>} />
        <Route path="/login" element={<Layout showNav={false} showFooter={false}><Login /></Layout>} />
        <Route path="/booklens" element={<Layout showNav={false} showFooter={false}><ARScanner /></Layout>} />
        <Route path="/watch/:id" element={<Layout showNav={false} showFooter={false}><WatchVideo /></Layout>} />

        {/* Admin Routes — protected */}
        <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
        <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
        <Route path="/admin/products/new" element={<AdminRoute><AdminProductEditor /></AdminRoute>} />
        <Route path="/admin/products/:id/edit" element={<AdminRoute><AdminProductEditor /></AdminRoute>} />
        <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
        <Route path="/admin/orders/:id" element={<AdminRoute><AdminOrderDetail /></AdminRoute>} />
        <Route path="/admin/support" element={<AdminRoute><AdminSupport /></AdminRoute>} />
        <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
        <Route path="/admin/booklens" element={<AdminRoute><AdminBookLens /></AdminRoute>} />
        <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
      </Routes>
    </>
  );
}
