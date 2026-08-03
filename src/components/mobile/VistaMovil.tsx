import { useState } from 'react';
import { ModalRegistroMovil } from './ModalRegistroMovil';
import type { Gasto } from '../../interfaces/gasto';
import { Calendar, Wallet, TrendingUp } from 'lucide-react';

interface VistaMovilProps {
  gastos: Gasto[];
  onGastoCreado: () => void;
}

export const VistaMovil = ({ gastos, onGastoCreado }: VistaMovilProps) => {
  const [modalAbierto, setModalAbierto] = useState(false);

  // Gastos compartidos generales
  const gastosCompartidos = gastos.filter((g) => !g.es_personal);

  // Obtener meses disponibles para el selector móvil
  const mesesDisponibles = Array.from(
    new Set(gastosCompartidos.map((g) => (g.fecha ? g.fecha.substring(0, 7) : '')))
  ).filter(Boolean).sort().reverse();

  // Mes actual por defecto (YYYY-MM)
  const mesActualStr = new Date().toISOString().substring(0, 7);
  const [mesSeleccionado, setMesSeleccionado] = useState(
    mesesDisponibles.includes(mesActualStr) ? mesActualStr : (mesesDisponibles[0] || mesActualStr)
  );

  // Filtrar gastos del mes seleccionado para la vista móvil
  const gastosDelMes = gastosCompartidos.filter((g) => g.fecha && g.fecha.startsWith(mesSeleccionado));

  // Cálculos rápidos para móvil basados en el mes activo
  const totalHogar = gastosDelMes.reduce((acc, g) => acc + Number(g.monto), 0);
  const totalJazmine = gastosDelMes.filter((g) => g.pagado_por === 'Jazmine').reduce((acc, g) => acc + Number(g.monto), 0);
  const totalMarcos = gastosDelMes.filter((g) => g.pagado_por === 'Marcos').reduce((acc, g) => acc + Number(g.monto), 0);

  const mitadIdeal = totalHogar / 2;
  const diferenciaJazmine = totalJazmine - mitadIdeal;

  let balanceTexto = 'Cuentas equilibradas';
  if (diferenciaJazmine > 0) {
    balanceTexto = `Marcos debe S/ ${diferenciaJazmine.toFixed(2)} a Jazmine`;
  } else if (diferenciaJazmine < 0) {
    balanceTexto = `Jazmine debe S/ ${Math.abs(diferenciaJazmine).toFixed(2)} a Marcos`;
  }

  // Lista de movimientos recientes filtrada por el mes seleccionado
  const movimientosRecientes = gastosDelMes.slice().sort((a, b) => {
    const fechaA = new Date(a.fecha || '').getTime();
    const fechaB = new Date(b.fecha || '').getTime();
    return fechaB - fechaA;
  });

  return (
    <div className="w-full max-w-sm mx-auto space-y-4 pb-20 relative">
      
      {/* Selector de Periodo Compacto para Móvil */}
      <div className="bg-slate-900 border border-slate-800 p-3 rounded-2xl shadow-xl flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-slate-200">Periodo:</span>
        </div>
        <select
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-2.5 py-1 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
        >
          {mesesDisponibles.length === 0 ? (
            <option value={mesActualStr}>{mesActualStr}</option>
          ) : (
            mesesDisponibles.map((mes) => (
              <option key={mes} value={mes}>
                {mes} {mes === mesActualStr ? '(Actual)' : ''}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Tarjeta Resumen Móvil */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Wallet className="w-3.5 h-3.5 text-purple-400" /> Hogar ({mesSeleccionado})
          </div>
          <span className="text-[10px] bg-pink-950 text-pink-300 px-2 py-0.5 rounded-full border border-pink-800">
            Vista Móvil
          </span>
        </div>
        <p className="text-2xl font-bold text-white">S/ {totalHogar.toFixed(2)}</p>
        
        {/* Desglose rápido de aportes */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-[11px]">
            <span className="text-pink-400 block font-medium">Jazmine</span>
            <span className="font-bold text-white">S/ {totalJazmine.toFixed(2)}</span>
          </div>
          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800 text-[11px]">
            <span className="text-indigo-400 block font-medium">Marcos</span>
            <span className="font-bold text-white">S/ {totalMarcos.toFixed(2)}</span>
          </div>
        </div>

        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs flex items-center justify-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-purple-400 shrink-0" />
          <p className="text-slate-200 font-medium text-center">{balanceTexto}</p>
        </div>
      </div>

      {/* Historial Compacto del Mes */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-3">
        <h4 className="text-xs font-bold text-white uppercase tracking-wider">📱 Movimientos del Mes</h4>
        {movimientosRecientes.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">Sin gastos registrados en este mes.</p>
        ) : (
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {movimientosRecientes.map((g) => (
              <div key={g.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold text-slate-200">{g.descripcion}</p>
                  <span className="text-[9px] text-purple-400">{g.categoria} • {g.pagado_por} • {g.fecha}</span>
                </div>
                <p className="font-bold text-emerald-400">S/ {Number(g.monto).toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Botón Flotante (FAB) */}
      <button
        onClick={() => setModalAbierto(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl font-bold hover:scale-105 transition-all z-40 border border-pink-400/30"
        title="Registrar Gasto"
      >
        ＋
      </button>

      {/* Modal de Registro Rápido */}
      <ModalRegistroMovil
        isOpen={modalAbierto}
        onClose={() => setModalAbierto(false)}
        onGastoAgregado={onGastoCreado}
      />
    </div>
  );
};