import React, { useState } from 'react';
import { crearGasto } from '../../lib/gastosService';

interface ModalRegistroMovilProps {
  isOpen: boolean;
  onClose: () => void;
  onGastoCreado: () => void;
}

export const ModalRegistroMovil = ({ isOpen, onClose, onGastoCreado }: ModalRegistroMovilProps) => {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  const [categoria, setCategoria] = useState('Alimentación');
  const [pagadoPor, setPagadoPor] = useState('Jazmine');
  const [metodoPago, setMetodoPago] = useState('Yape');
  const [esPersonal, setEsPersonal] = useState(false);
  const [cargando, setCargando] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!descripcion || !monto) return;

    setCargando(true);
    try {
      await crearGasto({
        fecha: new Date().toISOString().split('T')[0],
        descripcion,
        monto: parseFloat(monto),
        categoria,
        pagado_por: pagadoPor,
        metodo_pago: metodoPago,
        es_personal: esPersonal,
      });

      // Limpiar y cerrar
      setDescripcion('');
      setMonto('');
      onGastoCreado();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl space-y-4 animate-in fade-in slide-in-from-bottom duration-200">
        <div className="flex justify-between items-center border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            ⚡ Captura Rápida de Gasto
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white text-lg font-bold px-2 py-1"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-400 mb-1">Descripción</label>
            <input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Pasajes, Bodega, etc."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Monto (S/)</label>
              <input
                type="number"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Categoría</label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500"
              >
                <option value="Alimentación">Alimentación</option>
                <option value="Servicios">Servicios</option>
                <option value="Alquiler">Alquiler</option>
                <option value="Transporte">Transporte</option>
                <option value="Salud">Salud</option>
                <option value="Ocio">Ocio</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Pagado por</label>
              <select
                value={pagadoPor}
                onChange={(e) => setPagadoPor(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500"
              >
                <option value="Jazmine">Jazmine</option>
                <option value="Marcos">Marcos</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-medium text-slate-400 mb-1">Método de Pago</label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-white text-sm focus:outline-none focus:border-pink-500"
              >
                <option value="Yape">Yape</option>
                <option value="Plin">Plin</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta Débito">Tarjeta Débito</option>
                <option value="Tarjeta Crédito">Tarjeta Crédito</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="esPersonalMovil"
              checked={esPersonal}
              onChange={(e) => setEsPersonal(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-pink-600 focus:ring-pink-500 w-4 h-4"
            />
            <label htmlFor="esPersonalMovil" className="text-xs text-slate-300">
              Es un gasto personal (no cuenta para la deuda)
            </label>
          </div>

          <button
            type="submit"
            disabled={cargando}
            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-medium py-3 rounded-xl text-sm shadow-lg hover:opacity-90 transition-all disabled:opacity-50 mt-2"
          >
            {cargando ? 'Guardando...' : 'Registrar al Instante'}
          </button>
        </form>
      </div>
    </div>
  );
};