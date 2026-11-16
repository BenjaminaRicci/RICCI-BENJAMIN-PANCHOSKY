import './Button.css';

export default function Button({
    as: Component = 'button',
    variant = 'dark',
    size = 'md',
    block = false,
    loading = false,
    loadingText,
    className = '',
    type,
    disabled,
    children,
    ...props
}) {
    const classes = [
        'btn',
        `btn--${variant}`,
        `btn--${size}`,
        block ? 'btn--block' : '',
        className
    ]
        .filter(Boolean)
        .join(' ');

    if (Component !== 'button') {
        return (
            <Component className={classes} {...props}>
                {children}
            </Component>
        );
    }

    return (
        <button
            type={type ?? 'button'}
            className={classes}
            disabled={disabled || loading}
            aria-busy={loading || undefined}
            {...props}
        >
            {loading && <span className="btn__spinner" aria-hidden="true" />}
            {loading ? loadingText ?? children : children}
        </button>
    );
}
