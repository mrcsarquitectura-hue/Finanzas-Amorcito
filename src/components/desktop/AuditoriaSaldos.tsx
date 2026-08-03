import type { Gasto } from '../../interfaces/gasto';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { History, Scale } from 'lucide-react';

interface AuditoriaSaldosProps {
  gastos: Gasto[];
}

export const AuditoriaSaldos = ({ gastos }: AuditoriaSaldosProps) => {
  const gastosCompartidos = gastos.filter((g) => !g.es_personal);

  const mesesDisponibles = Array.from(
    new Set(gastosCompartidos.map((g) => (g.fecha ? g.fecha.substring(0, 7) : '')))
  ).filter(Boolean).sort().reverse();

  return (
    <Card className="border-slate-800 shadow-xl w-full">
      <CardHeader className="pb-3 border-b border-slate-800 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold">Auditoría Histórica de Saldos</CardTitle>
            <p className="text-xs text-slate-400">Resumen y estado de cuentas de todos los meses registrados</p>
          </div>
        </div>
        <span className="text-xs bg-slate-950 text-slate-300 px-3 py-1.5 rounded-lg border border-slate-800">
          {mesesDisponibles.length} meses analizados
        </span>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {mesesDisponibles.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-8">No hay meses registrados para auditar.</p>
        ) : (
          mesesDisponibles.map((mes) => {
            const gastosM = gastosCompartidos.filter((g) => g.fecha && g.fecha.startsWith(mes));
            const totM = gastosM.reduce((acc, g) => acc + Number(g.monto), 0);
            const jazM = gastosM.filter((g) => g.pagado_por === 'Jazmine').reduce((acc, g) => acc + Number(g.monto), 0);
            const marcosM = gastosM.filter((g) => g.pagado_por === 'Marcos').reduce((acc, g) => acc + Number(g.monto), 0);
            const mitadM = totM / 2;
            const difM = jazM - mitadM;

            let textoHistorial = 'Cuentas perfectamente equilibradas';
            let colorBadge = 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50';
            if (difM > 0) {
              textoHistorial = `Marcos debe S/ ${difM.toFixed(2)} a Jazmine`;
              colorBadge = 'text-purple-300 bg-purple-950/50 border-purple-800/50';
            } else if (difM < 0) {
              textoHistorial = `Jazmine debe S/ ${Math.abs(difM).toFixed(2)} a Marcos`;
              colorBadge = 'text-pink-300 bg-pink-950/50 border-pink-800/50';
            }

            return (
              <div key={mes} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 hover:border-slate-700 transition-all">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-purple-400" />
                    <span className="font-bold text-slate-200 text-sm">Periodo: {mes}</span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Total del Hogar: <strong className="text-emerald-400">S/ {totM.toFixed(2)}</strong> (Jazmine: S/ {jazM.toFixed(2)} | Marcos: S/ {marcosM.toFixed(2)})
                  </p>
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-xl border font-semibold ${colorBadge}`}>
                  {textoHistorial}
                </span>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
};