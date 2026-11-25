// Reconstruye los ítems del carrito a partir de un pedido anterior (funcionalidad 7: repetir pedido).
// Se omiten los ítems que ya no existen o no están disponibles; el backend valida todo de nuevo al confirmar.
export function armarItemsParaRepetir(detalles, productos, combos) {
  const items = [];
  const omitidos = [];

  for (const detalle of detalles) {
    if (detalle.productoId) {
      const producto = productos.find((p) => p.id === detalle.productoId);
      if (producto?.disponible) {
        items.push({
          item: {
            productoId: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            imagen: producto.imagen
          },
          cantidad: detalle.cantidad
        });
      } else {
        omitidos.push(detalle.nombre);
      }
      continue;
    }

    const combo = combos.find((c) => c.id === detalle.comboId);
    const pancho = productos.find((p) => p.id === detalle.panchoId);
    const bebida = productos.find((p) => p.id === detalle.bebidaId);
    if (combo?.vigente && pancho?.disponible && bebida?.disponible) {
      items.push({
        item: {
          comboId: combo.id,
          panchoId: pancho.id,
          bebidaId: bebida.id,
          nombre: `${combo.nombre} (${pancho.nombre} + ${bebida.nombre})`,
          precio: combo.precioPromocional,
          imagen: pancho.imagen
        },
        cantidad: detalle.cantidad
      });
    } else {
      omitidos.push(detalle.nombre);
    }
  }

  return { items, omitidos };
}
