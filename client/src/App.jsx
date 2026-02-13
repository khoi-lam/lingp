import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/admin/Dashboard';
import Categories from './pages/admin/Categories';
import Products from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import Content from './pages/admin/Content';
import AdminOrders from './pages/admin/Orders';
import AdminOrderDetail from './pages/admin/OrderDetail';
import AdminSupport from './pages/admin/Support';
import ErrorBoundary from './components/ErrorBoundary';
import Shop from './pages/Shop';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Support from './pages/Support';
import ChatBubble from './components/ChatBubble';

const PublicLayout = () => (
  <div className="min-h-screen flex flex-col pt-20">
    <Navbar />
    <main className="flex-grow">
      <Outlet />
    </main>
    <Footer />
    <ChatBubble />
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/order-success/:id" element={<OrderSuccess />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/support" element={<Support />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>

            {/* Admin routes protected by ErrorBoundary */}
            <Route path="/admin/*" element={
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<ProtectedRoute requireAdmin><Dashboard /></ProtectedRoute>} />
                  <Route path="categories" element={<ProtectedRoute requireAdmin><Categories /></ProtectedRoute>} />
                  <Route path="products" element={<ProtectedRoute requireAdmin><Products /></ProtectedRoute>} />
                  <Route path="products/new" element={<ProtectedRoute requireAdmin><ProductForm /></ProtectedRoute>} />
                  <Route path="products/edit/:id" element={<ProtectedRoute requireAdmin><ProductForm /></ProtectedRoute>} />
                  <Route path="content" element={<ProtectedRoute requireAdmin><Content /></ProtectedRoute>} />
                  <Route path="orders" element={<ProtectedRoute requireAdmin><AdminOrders /></ProtectedRoute>} />
                  <Route path="orders/:id" element={<ProtectedRoute requireAdmin><AdminOrderDetail /></ProtectedRoute>} />
                  <Route path="support" element={<ProtectedRoute requireAdmin><AdminSupport /></ProtectedRoute>} />
                </Routes>
              </ErrorBoundary>
            } />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;

