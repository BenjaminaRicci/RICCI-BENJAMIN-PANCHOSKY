import { useState } from 'react';
import placeholder from '../../assets/placeholder-producto.svg';

export default function ProductImage({ src, alt, className = '' }) {
    const [failedSrc, setFailedSrc] = useState(null);
    const usePlaceholder = !src || failedSrc === src;

    return (
        <img
            className={className}
            src={usePlaceholder ? placeholder : src}
            alt={alt}
            loading="lazy"
            onError={() => setFailedSrc(src)}
        />
    );
}
