import { useState } from 'react';
import { ModalRegistroMovil } from './ModalRegistroMovil';
import type { Gasto } from '../../interfaces/gasto';

interface VistaMovilProps {
  gastos: Gasto[];
  onGastoCreado: () => void;
}

export const VistaMovil = ({ gastos, onGastoCreado }: VistaMovilProps) => {
  const [modalAbierto, setModalAbierto] = useState(false);

  // Cálculos rápidos para móvil
  const gastosCompartidos = gastos.filter((g) => !g.es_personal);
  const totalHogar = gastosCompartidos.reduce((acc, g) => acc + Number(g.monto), 0);
  const totalJazmine = gastosCompartidos.filter((g) => g.pagado_por === 'Jazmine').reduce((acc, g) => acc + Number(g.monto), 0);
  const totalMarcos = gastosCompartidos.filter((g) => g.pagado_por === 'Marcos').reduce((acc, g) => acc + Number(g.monto), 0);

  const mitadIdeal = totalHogar / 2;
  const diferenciaJazmine = totalJazmine - mitadIdeal;

  let balanceTexto = 'Cuentas equilibradas';
  if (diferenciaJazmine > 0) {
    balanceTexto = `Marcos debe S/ ${diferenciaJazmine.toFixed(2)} a Jazmine`;
  } else if (diferenciaJazmine < 0) {
    balanceTexto = `Jazmine debe S/ ${Math.abs(diferenciaJazmine).toFixed(2)} a Marcos`;
  }

  return (
    <div className="w-full max-w-sm mx-auto space-y-4 pb-20 relative">
      {/* Tarjeta Resumen Móvil */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-xs text-slate-400 font-medium">Hogar (S/)</span>
          <span className="text-xs bg-pink-950 text-pink-300 px-2 py-0.5 rounded-full border border-pink-800">
            Vista Móvil
          </span>
        </div>
        <p className="text-2xl font-bold text-white">S/ {totalHogar.toFixed(2)}</p>
        <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 text-xs">
          <p className="text-slate-300 font-medium text-center">{balanceTexto}</p>
        </div>
      </div>

      {/* Historial Compacto */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl space-y-3">
        <h4 className="text-sm font-bold text-white">📱 Movimientos Recientes</h4>
        {gastos.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">Sin gastos registrados.</p>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
            {gastos.map((g) => (
              <div key={g.id} className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                <div>
                  <p className="font-semibold text-slate-200">{g.descripcion}</p>
                  <span className="text-[9px] text-purple-400">{g.categoria} • {g.pagado_por}</span>
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
        onGastoCreado={onGastoCreado}
      />
    </div>
  );
};