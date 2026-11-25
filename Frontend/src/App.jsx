import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MenuPage from './pages/MenuPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import RegistroPage from './pages/RegistroPage.jsx';
import CarritoPage from './pages/CarritoPage.jsx';
import PedidosPage from './pages/PedidosPage.jsx';
import PedidoDetallePage from './pages/PedidoDetallePage.jsx';
import GestionPedidosPage from './pages/GestionPedidosPage.jsx';
import GestionProductosPage from './pages/GestionProductosPage.jsx';
import GestionCombosPage from './pages/GestionCombosPage.jsx';
import AdministracionPage from './pages/AdministracionPage.jsx';

export default function App() {
  return (
    <>
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/registro" element={<RegistroPage />} />
          <Route path="/carrito" element={<CarritoPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/pedidos/:id" element={<PedidoDetallePage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['cliente']} />}>
            <Route path="/pedidos" element={<PedidosPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['empleado', 'administrador']} />}>
            <Route path="/gestion/pedidos" element={<GestionPedidosPage />} />
            <Route path="/gestion/productos" element={<GestionProductosPage />} />
          </Route>

          <Route element={<ProtectedRoute roles={['administrador']} />}>
            <Route path="/gestion/combos" element={<GestionCombosPage />} />
            <Route path="/gestion/administracion" element={<AdministracionPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
