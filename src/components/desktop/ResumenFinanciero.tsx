import { useState } from 'react';
import type { Gasto } from '../../interfaces/gasto';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Wallet, TrendingUp, HeartHandshake, Sparkles, Calendar, History } from 'lucide-react';

interface ResumenFinancieroProps {
  gastos: Gasto[];
}

export const ResumenFinanciero = ({ gastos }: ResumenFinancieroProps) => {
  const gastosCompartidos = gastos.filter((g) => !g.es_personal);

  // Obtener la lista de todos los meses disponibles en los registros (Ej: "2026-08", "2026-07")
  const mesesDisponibles = Array.from(
    new Set(gastosCompartidos.map((g) => (g.fecha ? g.fecha.substring(0, 7) : '')))
  ).filter(Boolean).sort().reverse();

  // Mes actual por defecto (YYYY-MM)
  const mesActualStr = new Date().toISOString().substring(0, 7);
  const [mesSeleccionado, setMesSeleccionado] = useState(
    mesesDisponibles.includes(mesActualStr) ? mesActualStr : (mesesDisponibles[0] || mesActualStr)
  );

  // Filtrar gastos del mes seleccionado
  const gastosDelMes = gastosCompartidos.filter((g) => g.fecha && g.fecha.startsWith(mesSeleccionado));

  const totalHogar = gastosDelMes.reduce((acc, g) => acc + Number(g.monto), 0);

  const totalJazmine = gastosDelMes
    .filter((g) => g.pagado_por === 'Jazmine')
    .reduce((acc, g) => acc + Number(g.monto), 0);

  const totalMarcos = gastosDelMes
    .filter((g) => g.pagado_por === 'Marcos')
    .reduce((acc, g) => acc + Number(g.monto), 0);

  const mitadIdeal = totalHogar / 2;
  const diferenciaJazmine = totalJazmine - mitadIdeal;

  let mensajeDeuda = '¡Las cuentas de este mes están perfectamente equilibradas!';
  if (diferenciaJazmine > 0) {
    mensajeDeuda = `Marcos debe transferirle S/ ${diferenciaJazmine.toFixed(2)} a Jazmine para equilibrar.`;
  } else if (diferenciaJazmine < 0) {
    const deudaMarcos = Math.abs(diferenciaJazmine);
    mensajeDeuda = `Jazmine debe transferirle S/ ${deudaMarcos.toFixed(2)} a Marcos para equilibrar.`;
  }

  return (
    <div className="space-y-4 w-full">
      {/* Selector de Mes */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-slate-900/80 border border-slate-800 p-4 rounded-2xl gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-semibold text-slate-200">Filtrar período mensual:</span>
        </div>
        <select
          value={mesSeleccionado}
          onChange={(e) => setMesSeleccionado(e.target.value)}
          className="bg-slate-950 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500 font-medium"
        >
          {mesesDisponibles.length === 0 ? (
            <option value={mesActualStr}>{mesActualStr}</option>
          ) : (
            mesesDisponibles.map((mes) => (
              <option key={mes} value={mes}>
                Mes: {mes} {mes === mesActualStr ? '(Actual)' : ''}
              </option>
            ))
          )}
        </select>
      </div>

      {/* Tarjetas de Resumen del Mes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-purple-950/60 relative overflow-hidden group hover:border-purple-800/60 transition-all">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-purple-600/10 rounded-full blur-2xl group-hover:bg-purple-600/20 transition-all"></div>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">Gastos del Mes ({mesSeleccionado})</p>
              <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                <Wallet className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-1">S/ {totalHogar.toFixed(2)}</p>
            <span className="text-[10px] text-purple-400 mt-2 inline-block bg-purple-950/60 px-2 py-0.5 rounded border border-purple-800/40">
              Se reinicia cada mes
            </span>
          </CardContent>
        </Card>

        <Card className="border-pink-950/60 relative overflow-hidden group hover:border-pink-800/60 transition-all">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-pink-600/10 rounded-full blur-2xl group-hover:bg-pink-600/20 transition-all"></div>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-pink-400 font-medium">Aporte de Jazmine</p>
              <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-1">S/ {totalJazmine.toFixed(2)}</p>
            <span className="text-[10px] text-slate-400 mt-2 inline-block bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {totalHogar > 0 ? `${((totalJazmine / totalHogar) * 100).toFixed(0)}% del mes` : '0%'}
            </span>
          </CardContent>
        </Card>

        <Card className="border-indigo-950/60 relative overflow-hidden group hover:border-indigo-800/60 transition-all">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-600/10 rounded-full blur-2xl group-hover:bg-indigo-600/20 transition-all"></div>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <p className="text-xs text-indigo-400 font-medium">Aporte de Marcos</p>
              <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white mt-1">S/ {totalMarcos.toFixed(2)}</p>
            <span className="text-[10px] text-slate-400 mt-2 inline-block bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
              {totalHogar > 0 ? `${((totalMarcos / totalHogar) * 100).toFixed(0)}% del mes` : '0%'}
            </span>
          </CardContent>
        </Card>
      </div>

      {/* Tarjeta de Balance 50/50 del Mes */}
      <div className="bg-gradient-to-r from-purple-950/90 via-fuchsia-950/80 to-pink-950/90 border border-purple-500/30 p-5 rounded-2xl shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-purple-300 text-xs font-semibold">
            <HeartHandshake className="w-4 h-4" /> Balance 50/50 del Mes ({mesSeleccionado})
          </div>
          <h4 className="text-base font-bold text-white">{mensajeDeuda}</h4>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs bg-purple-900/60 text-purple-200 px-3.5 py-2 rounded-xl border border-purple-700/50 flex items-center gap-1.5 font-medium shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" /> Cuentas Claras
          </span>
        </div>
      </div>

      {/* Historial de Balances de Meses Anteriores */}
      {mesesDisponibles.length > 1 && (
        <Card className="border-slate-800 shadow-xl">
          <CardHeader className="pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-purple-400" />
              <CardTitle className="text-sm font-semibold">Auditoría de Saldos de Meses Anteriores</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-3 space-y-2 max-h-[200px] overflow-y-auto">
            {mesesDisponibles.map((mes) => {
              const gastosM = gastosCompartidos.filter((g) => g.fecha && g.fecha.startsWith(mes));
              const totM = gastosM.reduce((acc, g) => acc + Number(g.monto), 0);
              const jazM = gastosM.filter((g) => g.pagado_por === 'Jazmine').reduce((acc, g) => acc + Number(g.monto), 0);
              const mitadM = totM / 2;
              const difM = jazM - mitadM;

              let textoHistorial = 'Equilibrado';
              if (difM > 0) textoHistorial = `Marcos debía S/ ${difM.toFixed(2)} a Jazmine`;
              if (difM < 0) textoHistorial = `Jazmine debía S/ ${Math.abs(difM).toFixed(2)} a Marcos`;

              return (
                <div key={mes} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800 flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-300">Mes: {mes} (Total: S/ {totM.toFixed(2)})</span>
                  <span className="text-purple-300 font-medium">{textoHistorial}</span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};