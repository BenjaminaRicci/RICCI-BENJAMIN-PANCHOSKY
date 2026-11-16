import { Link } from 'react-router-dom';
import Button from '../Button/Button.jsx';
import { useCart } from '../../context/CartContext.jsx';
import heroImage from '../../assets/hero-pancho.jpg';
import './Hero.css';

export default function Hero() {
    const { openCart } = useCart();

    return (
        <section className="hero" aria-labelledby="hero-titulo">
            <div className="hero__visual">
                <img
                    src={heroImage}
                    alt="Panchos con mostaza y ketchup sobre una mesa oscura"
                    className="hero__image"
                />
            </div>
            <div className="container hero__content">
                <p className="hero__eyebrow">El sabor de la calle, en tu puerta</p>
                <h1 id="hero-titulo" className="hero__title">
                    Siempre <span>Panchosky</span>
                </h1>
                <p className="hero__text">
                    Panchos, hamburguesas, sandwiches, empanadas y medialunas. Pedí ahora y recibí en tu casa o
                    retirá en el local más cercano.
                </p>
                <div className="hero__actions">
                    <Button as={Link} to="/#menu" variant="primary" size="lg">
                        Ver menú completo
                    </Button>
                    <Button variant="accent" size="lg" onClick={openCart}>
                        Mi pedido
                    </Button>
                </div>
            </div>
        </section>
    );
}
