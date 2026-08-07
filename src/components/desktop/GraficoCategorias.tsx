import type { Gasto } from '../../interfaces/gasto';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { BarChart3 } from 'lucide-react';

interface GraficoCategoriasProps {
  gastos: Gasto[];
}

const COLORES_CATEGORIAS: { [key: string]: string } = {
  Hogar: '#8b5cf6',
  Alimentación: '#f43f5e',
  Servicios: '#06b6d4',
  Alquiler: '#3b82f6',
  Transporte: '#fbbf24',
  Salud: '#10b981',
  Ocio: '#a855f7',
  Regalos: '#ec4899',
  Gustos: '#6366f1',
  Vacaciones: '#14b8a6',
  Otros: '#64748b'
};

export const GraficoCategorias = ({ gastos }: GraficoCategoriasProps) => {
  const gastosCompartidos = gastos.filter((g) => !g.es_personal && g.categoria !== 'Todas');

  const totalesPorCategoria: { [key: string]: number } = {};
  gastosCompartidos.forEach((g) => {
    const cat = g.categoria || 'Otros';
    if (!totalesPorCategoria[cat]) totalesPorCategoria[cat] = 0;
    totalesPorCategoria[cat] += Number(g.monto);
  });

  const totalGeneral = Object.values(totalesPorCategoria).reduce((acc, val) => acc + val, 0);

  const categoriasData = Object.entries(totalesPorCategoria)
    .map(([categoria, monto]) => ({
      categoria,
      monto,
      porcentaje: totalGeneral > 0 ? (monto / totalGeneral) * 100 : 0,
      color: COLORES_CATEGORIAS[categoria] || '#a855f7'
    }))
    .sort((a, b) => b.monto - a.monto);

  const maxMontoCategoria = Math.max(...categoriasData.map((d) => d.monto), 50);

  return (
    <Card className="border-slate-800 shadow-xl w-full h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
            <BarChart3 className="w-5 h-5" />
          </div>
          <CardTitle className="text-base font-semibold">Distribución por Categoría</CardTitle>
        </div>
        <span className="text-xs bg-slate-950 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800 font-medium">
          Total: S/ {totalGeneral.toFixed(2)}
        </span>
      </CardHeader>

      <CardContent className="pt-4 flex-1 flex flex-col justify-center my-auto">
        {categoriasData.length === 0 ? (
          <p className="text-sm text-slate-400 text-center py-16">Sin gastos compartidos en este periodo.</p>
        ) : (
          <div className="space-y-4">
            {/* Contenedor con menor espaciado (gap-4) para acercar las barras */}
            <div className="relative h-48 w-full flex items-end justify-center gap-4 sm:gap-6 pt-6 px-4 border-b border-slate-800/80 pb-2">
              {/* Líneas de referencia horizontales */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-4 py-4">
                {[0, 0.5, 1].map((ratio, idx) => (
                  <div key={idx} className="w-full border-b border-slate-800/40 text-[9px] text-slate-500 flex justify-end">
                    <span>S/ {Math.round(maxMontoCategoria * (1 - ratio))}</span>
                  </div>
                ))}
              </div>

              {/* Barras verticales más anchas (max-w-[44px]) */}
              {categoriasData.map((item) => {
                const alturaPorcentaje = Math.max((item.monto / maxMontoCategoria) * 100, 10);

                return (
                  <div key={item.categoria} className="relative flex flex-col items-center h-full justify-end group z-10 w-full max-w-[44px]">
                    {/* Tooltip flotante */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 border border-purple-500/50 text-[10px] text-white text-center rounded px-2 py-1 shadow-xl whitespace-nowrap z-30">
                      <strong>{item.categoria}</strong>: <span className="text-emerald-400 font-bold">S/ {item.monto.toFixed(2)}</span> ({item.porcentaje.toFixed(0)}%)
                    </div>

                    {/* Barra vertical con efecto hover */}
                    <div
                      style={{ height: `${alturaPorcentaje}%`, backgroundColor: item.color }}
                      className="w-full rounded-t-lg transition-all duration-300 group-hover:brightness-125 group-hover:shadow-[0_0_12px_rgba(168,85,247,0.4)] shadow-md"
                    ></div>
                  </div>
                );
              })}
            </div>

            {/* Etiquetas inferiores alineadas */}
            <div className="flex justify-center gap-4 sm:gap-6 text-[10px] text-slate-300 font-medium px-4 overflow-x-auto pb-1">
              {categoriasData.map((item) => (
                <div key={item.categoria} className="flex flex-col items-center text-center shrink-0 w-12 sm:w-14">
                  <span className="truncate w-full font-semibold" title={item.categoria}>{item.categoria}</span>
                  <span className="text-[9px] text-emerald-400 font-bold">S/ {item.monto.toFixed(0)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
