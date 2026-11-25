import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useToast } from '../context/ToastContext.jsx';
import { productoService } from '../services/productoService.js';
import { categoriaService } from '../services/catalogoService.js';
import { useCarga } from '../utils/useCarga.js';
import ProductImage from '../components/ProductImage.jsx';
import { formatearPrecio } from '../utils/format.js';

const FORM_VACIO = { nombre: '', descripcion: '', precio: '', categoriaId: '', imagen: '', disponible: true };

// CRUD de productos (administrador). El empleado solo puede cambiar la disponibilidad.
export default function GestionProductosPage() {
  const { usuario } = useAuth();
  const toast = useToast();
  const esAdmin = usuario.rol === 'administrador';

  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');
  const [enviando, setEnviando] = useState(false);

  const { datos, error: errorCarga, cargando, recargar } = useCarga(() =>
    Promise.all([productoService.obtenerTodos(), categoriaService.obtenerTodas()])
  );
  const [productos, categorias] = datos ?? [[], []];
  const nombreCategoria = (id) => categorias.find((c) => c.id === id)?.nombre ?? '-';

  const cambiar = (campo) => (evento) =>
    setForm({ ...form, [campo]: evento.target.type === 'checkbox' ? evento.target.checked : evento.target.value });

  const limpiar = () => {
    setForm(FORM_VACIO);
    setEditandoId(null);
    setError('');
  };

  const editar = (producto) => {
    setEditandoId(producto.id);
    setForm({
      nombre: producto.nombre,
      descripcion: producto.descripcion,
      precio: String(producto.precio),
      categoriaId: String(producto.categoriaId),
      imagen: producto.imagen,
      disponible: producto.disponible
    });
    setError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const guardar = async (evento) => {
    evento.preventDefault();
    setError('');
    setEnviando(true);
    const datosProducto = {
      nombre: form.nombre,
      descripcion: form.descripcion,
      precio: form.precio === '' ? undefined : Number(form.precio),
      categoriaId: form.categoriaId === '' ? undefined : Number(form.categoriaId),
      imagen: form.imagen,
      disponible: form.disponible
    };
    try {
      if (editandoId) {
        await productoService.actualizar(editandoId, datosProducto);
        toast.exito('Producto actualizado correctamente.');
      } else {
        await productoService.crear(datosProducto);
        toast.exito('Producto creado correctamente.');
      }
      limpiar();
      recargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const eliminar = async (producto) => {
    if (!window.confirm(`¿Eliminar "${producto.nombre}"?`)) {
      return;
    }
    try {
      const resultado = await productoService.eliminar(producto.id);
      toast[resultado.eliminado ? 'exito' : 'info'](resultado.mensaje);
      recargar();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const alternarDisponibilidad = async (producto) => {
    try {
      await productoService.cambiarDisponibilidad(producto.id, !producto.disponible);
      toast.exito(`"${producto.nombre}" ahora está ${producto.disponible ? 'no disponible' : 'disponible'}.`);
      recargar();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="page">
      <h1>Productos</h1>

      {esAdmin && (
        <form className="panel form" onSubmit={guardar}>
          <h2>{editandoId ? `Editar producto #${editandoId}` : 'Nuevo producto'}</h2>
          {error && <p className="alert alert-error">{error}</p>}

          <div className="form-row">
            <label>
              Nombre
              <input value={form.nombre} onChange={cambiar('nombre')} />
            </label>
            <label>
              Precio ($)
              <input type="number" min="0" step="1" value={form.precio} onChange={cambiar('precio')} />
            </label>
            <label>
              Categoría
              <select value={form.categoriaId} onChange={cambiar('categoriaId')}>
                <option value="">Elegí una categoría…</option>
                {categorias.map((c) => (
                  <option key={c.id} value={c.id}>{c.nombre}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            Descripción
            <input value={form.descripcion} onChange={cambiar('descripcion')} />
          </label>
          <label>
            Imagen (URL, opcional)
            <input value={form.imagen} onChange={cambiar('imagen')} placeholder="https://…" />
          </label>
          <label className="check">
            <input type="checkbox" checked={form.disponible} onChange={cambiar('disponible')} /> Disponible
          </label>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={enviando}>
              {editandoId ? 'Guardar cambios' : 'Crear producto'}
            </button>
            {editandoId && (
              <button type="button" className="btn btn-ghost" onClick={limpiar}>Cancelar edición</button>
            )}
          </div>
        </form>
      )}

      {!esAdmin && (
        <p className="muted">Como empleado podés marcar productos como disponibles o no disponibles.</p>
      )}

      {cargando && !datos && <p className="loading">Cargando productos…</p>}
      {errorCarga && <p className="alert alert-error">{errorCarga}</p>}

      <div className="panel tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr>
              <th>#</th><th>Imagen</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Estado</th><th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td>{producto.id}</td>
                <td><ProductImage className="miniatura" src={producto.imagen} alt={producto.nombre} /></td>
                <td>{producto.nombre}</td>
                <td>{nombreCategoria(producto.categoriaId)}</td>
                <td>{formatearPrecio(producto.precio)}</td>
                <td>
                  <span className={`estado ${producto.disponible ? 'estado-listo' : 'estado-cancelado'}`}>
                    {producto.disponible ? 'Disponible' : 'No disponible'}
                  </span>
                </td>
                <td className="acciones">
                  <button type="button" className="btn btn-ghost" onClick={() => alternarDisponibilidad(producto)}>
                    {producto.disponible ? 'Marcar no disponible' : 'Marcar disponible'}
                  </button>
                  {esAdmin && (
                    <>
                      <button type="button" className="btn btn-secondary" onClick={() => editar(producto)}>Editar</button>
                      <button type="button" className="btn btn-danger-ghost" onClick={() => eliminar(producto)}>Eliminar</button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
