import { useEffect, useState } from 'react';
import { useToast } from '../context/ToastContext.jsx';
import { usuarioService } from '../services/usuarioService.js';
import { configuracionService, sucursalService } from '../services/catalogoService.js';
import { useCarga } from '../utils/useCarga.js';

const EMPLEADO_VACIO = { nombre: '', apellido: '', email: '', telefono: '', password: '', sucursalId: '' };

// Gestión de empleados, sucursales y parámetros de envío (funcionalidad 10, administrador).
export default function AdministracionPage() {
  const toast = useToast();

  const [empleado, setEmpleado] = useState(EMPLEADO_VACIO);
  const [errorEmpleado, setErrorEmpleado] = useState('');
  const [config, setConfig] = useState({ minimoEnvio: '', costoEnvio: '', envioGratisDesde: '' });
  const [errorConfig, setErrorConfig] = useState('');

  const { datos: usuarios, error, recargar } = useCarga(() => usuarioService.obtenerTodos());
  const { datos: sucursales } = useCarga(() => sucursalService.obtenerTodas());
  const { datos: configActual } = useCarga(() => configuracionService.obtener());

  useEffect(() => {
    if (configActual) {
      setConfig({
        minimoEnvio: String(configActual.minimoEnvio),
        costoEnvio: String(configActual.costoEnvio),
        envioGratisDesde: String(configActual.envioGratisDesde)
      });
    }
  }, [configActual]);

  const nombreSucursal = (id) => sucursales?.find((s) => s.id === id)?.nombre ?? '-';

  const crearEmpleado = async (evento) => {
    evento.preventDefault();
    setErrorEmpleado('');
    try {
      await usuarioService.crearEmpleado({
        ...empleado,
        sucursalId: empleado.sucursalId === '' ? undefined : Number(empleado.sucursalId)
      });
      toast.exito('Empleado creado correctamente.');
      setEmpleado(EMPLEADO_VACIO);
      recargar();
    } catch (err) {
      setErrorEmpleado(err.message);
    }
  };

  const eliminarEmpleado = async (usuario) => {
    if (!window.confirm(`¿Dar de baja a ${usuario.nombre} ${usuario.apellido}?`)) {
      return;
    }
    try {
      await usuarioService.eliminar(usuario.id);
      toast.exito('Empleado dado de baja.');
      recargar();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const guardarConfig = async (evento) => {
    evento.preventDefault();
    setErrorConfig('');
    const numero = (valor) => (valor === '' ? undefined : Number(valor));
    try {
      await configuracionService.actualizar({
        minimoEnvio: numero(config.minimoEnvio),
        costoEnvio: numero(config.costoEnvio),
        envioGratisDesde: numero(config.envioGratisDesde)
      });
      toast.exito('Configuración de envíos actualizada.');
    } catch (err) {
      setErrorConfig(err.message);
    }
  };

  const cambiarEmpleado = (campo) => (e) => setEmpleado({ ...empleado, [campo]: e.target.value });
  const cambiarConfig = (campo) => (e) => setConfig({ ...config, [campo]: e.target.value });

  return (
    <div className="page">
      <h1>Administración</h1>

      <form className="panel form" onSubmit={guardarConfig}>
        <h2>Parámetros de envío</h2>
        {errorConfig && <p className="alert alert-error">{errorConfig}</p>}
        <div className="form-row">
          <label>
            Monto mínimo para envío ($)
            <input type="number" min="0" value={config.minimoEnvio} onChange={cambiarConfig('minimoEnvio')} />
          </label>
          <label>
            Costo de envío ($)
            <input type="number" min="0" value={config.costoEnvio} onChange={cambiarConfig('costoEnvio')} />
          </label>
          <label>
            Envío gratis en pedidos mayores a ($)
            <input type="number" min="0" value={config.envioGratisDesde} onChange={cambiarConfig('envioGratisDesde')} />
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Guardar configuración</button>
      </form>

      <form className="panel form" onSubmit={crearEmpleado}>
        <h2>Alta de empleado</h2>
        {errorEmpleado && <p className="alert alert-error">{errorEmpleado}</p>}
        <div className="form-row">
          <label>Nombre<input value={empleado.nombre} onChange={cambiarEmpleado('nombre')} /></label>
          <label>Apellido<input value={empleado.apellido} onChange={cambiarEmpleado('apellido')} /></label>
        </div>
        <div className="form-row">
          <label>Email<input value={empleado.email} onChange={cambiarEmpleado('email')} /></label>
          <label>Teléfono<input value={empleado.telefono} onChange={cambiarEmpleado('telefono')} /></label>
        </div>
        <div className="form-row">
          <label>
            Contraseña (mín. 8 caracteres)
            <input type="password" value={empleado.password} onChange={cambiarEmpleado('password')} autoComplete="new-password" />
          </label>
          <label>
            Sucursal
            <select value={empleado.sucursalId} onChange={cambiarEmpleado('sucursalId')}>
              <option value="">Elegí una sucursal…</option>
              {(sucursales ?? []).map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>
          </label>
        </div>
        <button type="submit" className="btn btn-primary">Crear empleado</button>
      </form>

      {error && <p className="alert alert-error">{error}</p>}

      <div className="panel tabla-contenedor">
        <h2>Usuarios</h2>
        <table className="tabla">
          <thead>
            <tr><th>#</th><th>Nombre</th><th>Email</th><th>Rol</th><th>Sucursal</th><th></th></tr>
          </thead>
          <tbody>
            {usuarios?.map((usuario) => (
              <tr key={usuario.id}>
                <td>{usuario.id}</td>
                <td>{usuario.nombre} {usuario.apellido}</td>
                <td>{usuario.email}</td>
                <td>{usuario.rol}</td>
                <td>{usuario.sucursalId ? nombreSucursal(usuario.sucursalId) : '-'}</td>
                <td className="acciones">
                  {usuario.rol === 'empleado' && (
                    <button type="button" className="btn btn-danger-ghost" onClick={() => eliminarEmpleado(usuario)}>Dar de baja</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="panel tabla-contenedor">
        <h2>Sucursales</h2>
        <table className="tabla">
          <thead>
            <tr><th>#</th><th>Nombre</th><th>Dirección</th></tr>
          </thead>
          <tbody>
            {sucursales?.map((sucursal) => (
              <tr key={sucursal.id}>
                <td>{sucursal.id}</td>
                <td>{sucursal.nombre}</td>
                <td>{sucursal.direccion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
