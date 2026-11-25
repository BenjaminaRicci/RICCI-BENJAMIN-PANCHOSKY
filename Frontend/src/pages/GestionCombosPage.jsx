import { useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import { comboService } from '../services/comboService.js';
import { useCarga } from '../utils/useCarga.js';
import { formatearPrecio } from '../utils/format.js';

const FORM_VACIO = { nombre: '', precioOriginal: '', precioPromocional: '', horaLimite: '22:00' };

// Alta y configuración de combos y ofertas con vigencia horaria (funcionalidad 5, administrador).
export default function GestionCombosPage() {
  const toast = useToast();
  const [form, setForm] = useState(FORM_VACIO);
  const [editandoId, setEditandoId] = useState(null);
  const [error, setError] = useState('');

  const { datos: combos, error: errorCarga, cargando, recargar } = useCarga(() => comboService.obtenerTodos());

  const cambiar = (campo) => (evento) => setForm({ ...form, [campo]: evento.target.value });

  const limpiar = () => {
    setForm(FORM_VACIO);
    setEditandoId(null);
    setError('');
  };

  const editar = (combo) => {
    setEditandoId(combo.id);
    setForm({
      nombre: combo.nombre,
      precioOriginal: String(combo.precioOriginal),
      precioPromocional: String(combo.precioPromocional),
      horaLimite: combo.horaLimite
    });
    setError('');
  };

  const guardar = async (evento) => {
    evento.preventDefault();
    setError('');
    const datos = {
      nombre: form.nombre,
      precioOriginal: form.precioOriginal === '' ? undefined : Number(form.precioOriginal),
      precioPromocional: form.precioPromocional === '' ? undefined : Number(form.precioPromocional),
      horaLimite: form.horaLimite
    };
    try {
      if (editandoId) {
        await comboService.actualizar(editandoId, datos);
        toast.exito('Combo actualizado correctamente.');
      } else {
        await comboService.crear(datos);
        toast.exito('Combo creado correctamente.');
      }
      limpiar();
      recargar();
    } catch (err) {
      setError(err.message);
    }
  };

  const eliminar = async (combo) => {
    if (!window.confirm(`¿Eliminar el combo "${combo.nombre}"?`)) {
      return;
    }
    try {
      await comboService.eliminar(combo.id);
      toast.exito('Combo eliminado.');
      recargar();
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="page">
      <h1>Combos y ofertas</h1>

      <form className="panel form" onSubmit={guardar}>
        <h2>{editandoId ? `Editar combo #${editandoId}` : 'Nuevo combo'}</h2>
        {error && <p className="alert alert-error">{error}</p>}
        <div className="form-row">
          <label>
            Nombre
            <input value={form.nombre} onChange={cambiar('nombre')} />
          </label>
          <label>
            Precio original ($)
            <input type="number" min="0" value={form.precioOriginal} onChange={cambiar('precioOriginal')} />
          </label>
          <label>
            Precio promocional ($)
            <input type="number" min="0" value={form.precioPromocional} onChange={cambiar('precioPromocional')} />
          </label>
          <label>
            Hora límite
            <input type="time" value={form.horaLimite} onChange={cambiar('horaLimite')} />
          </label>
        </div>
        <div className="form-actions">
          <button type="submit" className="btn btn-primary">{editandoId ? 'Guardar cambios' : 'Crear combo'}</button>
          {editandoId && <button type="button" className="btn btn-ghost" onClick={limpiar}>Cancelar edición</button>}
        </div>
      </form>

      {cargando && !combos && <p className="loading">Cargando combos…</p>}
      {errorCarga && <p className="alert alert-error">{errorCarga}</p>}

      <div className="panel tabla-contenedor">
        <table className="tabla">
          <thead>
            <tr><th>#</th><th>Nombre</th><th>Original</th><th>Promocional</th><th>Hasta</th><th>Vigencia</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {combos?.map((combo) => (
              <tr key={combo.id}>
                <td>{combo.id}</td>
                <td>{combo.nombre}</td>
                <td>{formatearPrecio(combo.precioOriginal)}</td>
                <td>{formatearPrecio(combo.precioPromocional)}</td>
                <td>{combo.horaLimite} hs</td>
                <td>
                  <span className={`estado ${combo.vigente ? 'estado-listo' : 'estado-cancelado'}`}>
                    {combo.vigente ? 'Vigente' : 'Finalizado'}
                  </span>
                </td>
                <td className="acciones">
                  <button type="button" className="btn btn-secondary" onClick={() => editar(combo)}>Editar</button>
                  <button type="button" className="btn btn-danger-ghost" onClick={() => eliminar(combo)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
