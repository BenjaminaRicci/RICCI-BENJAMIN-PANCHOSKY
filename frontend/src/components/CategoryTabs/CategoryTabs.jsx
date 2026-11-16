import './CategoryTabs.css';

export default function CategoryTabs({ categorias, selectedId, onSelect }) {
    return (
        <div className="category-tabs" role="group" aria-label="Filtrar el menú por categoría">
            {categorias.map((categoria) => {
                const isActive = categoria.id === selectedId;
                return (
                    <button
                        key={categoria.id}
                        type="button"
                        className={`category-tabs__tab ${isActive ? 'category-tabs__tab--active' : ''}`}
                        aria-pressed={isActive}
                        onClick={() => onSelect(categoria.id)}
                    >
                        {categoria.nombre}
                    </button>
                );
            })}
        </div>
    );
}
