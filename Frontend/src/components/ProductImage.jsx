import { useState } from 'react';
import placeholder from '../assets/placeholder-producto.svg';

// Muestra la imagen del producto y, si no existe o falla la carga, una imagen genérica.
export default function ProductImage({ src, alt, className = '' }) {
  const [fallida, setFallida] = useState(null);
  const usarPlaceholder = !src || fallida === src;

  return (
    <img
      className={className}
      src={usarPlaceholder ? placeholder : src}
      alt={alt}
      loading="lazy"
      onError={() => setFallida(src)}
    />
  );
}
