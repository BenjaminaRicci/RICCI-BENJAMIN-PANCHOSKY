import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { NotificationProvider } from './context/NotificationContext.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { CartProvider } from './context/CartContext.jsx';
import Layout from './components/Layout/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute.jsx';
import HomePage from './pages/HomePage/HomePage.jsx';
import CheckoutPage from './pages/CheckoutPage/CheckoutPage.jsx';
import LoginPage from './pages/AuthPages/LoginPage.jsx';
import RegisterPage from './pages/AuthPages/RegisterPage.jsx';
import ProductsPage from './pages/ProductsPage/ProductsPage.jsx';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage.jsx';
import CombosPage from './pages/CombosPage/CombosPage.jsx';
import MyOrdersPage from './pages/MyOrdersPage/MyOrdersPage.jsx';
import ProfilePage from './pages/ProfilePage/ProfilePage.jsx';
import AdminLayout from './pages/AdminLayout/AdminLayout.jsx';
import AdminOrdersPage from './pages/AdminOrdersPage/AdminOrdersPage.jsx';
import AdminProductsPage from './pages/AdminProductsPage/AdminProductsPage.jsx';
import AdminCombosPage from './pages/AdminCombosPage/AdminCombosPage.jsx';
import AdminCategoriesPage from './pages/AdminCategoriesPage/AdminCategoriesPage.jsx';
import NotFoundPage from './pages/NotFoundPage/NotFoundPage.jsx';
import { ROLES, ROLES_PERSONAL } from './utils/roles.js';

export default function App() {
    return (
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <NotificationProvider>
                <AuthProvider>
                    <CartProvider>
                        <Routes>
                            <Route element={<Layout />}>
                                <Route index element={<HomePage />} />
                                <Route path="checkout" element={<CheckoutPage />} />
                                <Route path="login" element={<LoginPage />} />
                                <Route path="registro" element={<RegisterPage />} />
                                <Route path="productos" element={<ProductsPage />} />
                                <Route path="productos/:id" element={<ProductDetailPage />} />
                                <Route path="combos" element={<CombosPage />} />
                                <Route element={<ProtectedRoute />}>
                                    <Route path="perfil" element={<ProfilePage />} />
                                </Route>
                                <Route element={<ProtectedRoute roles={[ROLES.CLIENTE]} />}>
                                    <Route path="mis-pedidos" element={<MyOrdersPage />} />
                                </Route>
                                <Route
                                    path="admin"
                                    element={
                                        <ProtectedRoute roles={ROLES_PERSONAL}>
                                            <AdminLayout />
                                        </ProtectedRoute>
                                    }
                                >
                                    <Route index element={<Navigate to="pedidos" replace />} />
                                    <Route path="pedidos" element={<AdminOrdersPage />} />
                                    <Route path="productos" element={<AdminProductsPage />} />
                                    <Route element={<ProtectedRoute roles={[ROLES.ADMINISTRADOR]} />}>
                                        <Route path="combos" element={<AdminCombosPage />} />
                                        <Route path="categorias" element={<AdminCategoriesPage />} />
                                    </Route>
                                </Route>
                                <Route path="*" element={<NotFoundPage />} />
                            </Route>
                        </Routes>
                    </CartProvider>
                </AuthProvider>
            </NotificationProvider>
        </BrowserRouter>
    );
}
