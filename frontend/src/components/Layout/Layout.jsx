import { Outlet } from 'react-router-dom';
import Header from '../Header/Header.jsx';
import Footer from '../Footer/Footer.jsx';
import CartDrawer from '../CartDrawer/CartDrawer.jsx';
import { useScrollToHash } from '../../hooks/useScrollToHash.js';

export default function Layout() {
    useScrollToHash();

    return (
        <>
            <a href="#contenido" className="skip-link">
                Saltar al contenido principal
            </a>
            <Header />
            <main id="contenido" tabIndex={-1}>
                <Outlet />
            </main>
            <Footer />
            <CartDrawer />
        </>
    );
}
