import { useState } from 'react';

export default function BranchesSection({ sucursales }) {
  const [sucursalActivaId, setSucursalActivaId] = useState(null);
  const sucursalActiva = sucursales.find((sucursal) => sucursal.id === sucursalActivaId) ?? sucursales[0];
  const consultaMapa = sucursalActiva
    ? `${sucursalActiva.direccion}, ${sucursalActiva.nombre}, Buenos Aires, Argentina`
    : '';
  const urlMapa = `https://maps.google.com/maps?q=${encodeURIComponent(consultaMapa)}&output=embed`;
  const urlIndicaciones = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(consultaMapa)}`;

  return (
    <section id="sucursales" className="branches section" aria-labelledby="branches-title">
      <div className="container">
        <div className="branches__heading">
          <div>
            <p className="branches__eyebrow">Encontrá tu local más cercano</p>
            <h2 id="branches-title" className="section-title">Nuestras sucursales</h2>
          </div>
          <p className="branches__intro">Elegí una sede para ver su ubicación y cómo llegar.</p>
        </div>

        {sucursales.length === 0 ? (
          <p className="muted">No hay sucursales disponibles.</p>
        ) : (
          <div className="branches__layout">
            <div className="branches__list" role="group" aria-label="Elegí una sucursal">
              {sucursales.map((sucursal) => {
                const activa = sucursal.id === sucursalActiva?.id;
                return (
                  <button
                    key={sucursal.id}
                    type="button"
                    className={`branches__option${activa ? ' branches__option--active' : ''}`}
                    aria-pressed={activa}
                    onClick={() => setSucursalActivaId(sucursal.id)}
                  >
                    <span className="branches__name">{sucursal.nombre}</span>
                    <span className="branches__address">{sucursal.direccion}</span>
                  </button>
                );
              })}
            </div>

            <div className="branches__map-panel">
              <iframe
                key={sucursalActiva.id}
                className="branches__map"
                title={`Mapa de la sucursal ${sucursalActiva.nombre}`}
                src={urlMapa}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
              <aside className="branches__details" aria-live="polite">
                <p className="branches__details-label">Sucursal seleccionada</p>
                <h3 className="branches__details-name">{sucursalActiva.nombre}</h3>
                <p className="branches__details-address">{sucursalActiva.direccion}</p>
                <a className="branches__directions" href={urlIndicaciones} target="_blank" rel="noreferrer">
                  Cómo llegar <span aria-hidden="true">↗</span>
                </a>
              </aside>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
