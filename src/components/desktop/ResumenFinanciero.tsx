import type { Gasto } from '../../interfaces/gasto';
import { Card, CardContent } from '../ui/card';
import { Wallet, TrendingUp, HeartHandshake, Sparkles } from 'lucide-react';

interface ResumenFinancieroProps {
  gastos: Gasto[];
  mesSeleccionadoGlobal: string;
}

export const ResumenFinanciero = ({ gastos, mesSeleccionadoGlobal }: ResumenFinancieroProps) => {
  const gastosCompartidos = gastos.filter((g) => !g.es_personal);
  const mesSeleccionado = mesSeleccionadoGlobal;

  const gastosDelMes = gastosCompartidos.filter((g) => g.fecha && g.fecha.startsWith(mesSeleccionado));

  const totalHogar = gastosDelMes.reduce((acc, g) => acc + Number(g.monto), 0);
  const totalJazmine = gastosDelMes.filter((g) => g.pagado_por === 'Jazmine').reduce((acc, g) => acc + Number(g.monto), 0);
  const totalMarcos = gastosDelMes.filter((g) => g.pagado_por === 'Marcos').reduce((acc, g) => acc + Number(g.monto), 0);

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
    </div>
  );
};