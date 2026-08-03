import type { Gasto } from '../../interfaces/gasto';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { BarChart3, TrendingUp, Award, Flame, Calendar, CreditCard } from 'lucide-react';

interface EstadisticasAvanzadasProps {
  gastos: Gasto[];
}

export const EstadisticasAvanzadas = ({ gastos }: EstadisticasAvanzadasProps) => {
  const gastosCompartidos = gastos.filter((g) => !g.es_personal);

  // 1. Evolución Mensual
  const evolucionMensual: { [key: string]: number } = {};
  gastosCompartidos.forEach((g) => {
    const mes = g.fecha ? g.fecha.substring(0, 7) : 'Sin fecha';
    if (!evolucionMensual[mes]) evolucionMensual[mes] = 0;
    evolucionMensual[mes] += Number(g.monto);
  });
  const mesesOrdenados = Object.keys(evolucionMensual).sort();

  // 2. Categoría Top
  const categoriasTotales: { [key: string]: number } = {};
  gastosCompartidos.forEach((g) => {
    const cat = g.categoria || 'Otros';
    if (!categoriasTotales[cat]) categoriasTotales[cat] = 0;
    categoriasTotales[cat] += Number(g.monto);
  });
  let categoriaTop = 'Ninguna';
  let montoTop = 0;
  Object.entries(categoriasTotales).forEach(([cat, total]) => {
    if (total > montoTop) {
      montoTop = total;
      categoriaTop = cat;
    }
  });

  // 3. Gastos Hormiga (Ocio, Regalos, Gustos, Otros Y monto ≤ S/ 10.00)
  const categoriasHormigaPermitidas = ['Ocio', 'Regalos', 'Gustos', 'Otros'];
  const gastosHormiga = gastosCompartidos.filter((g) => {
    const esCategoriaValida = categoriasHormigaPermitidas.includes(g.categoria);
    const esMontoMenor = Number(g.monto) <= 10;
    return esCategoriaValida && esMontoMenor;
  });
  const totalHormiga = gastosHormiga.reduce((acc, g) => acc + Number(g.monto), 0);

  // 4. Ritmo de Gasto por Día (Agrupar por fecha exacta)
  const gastosPorDia: { [key: string]: number } = {};
  gastosCompartidos.forEach((g) => {
    const fecha = g.fecha || 'Sin fecha';
    if (!gastosPorDia[fecha]) gastosPorDia[fecha] = 0;
    gastosPorDia[fecha] += Number(g.monto);
  });
  const diasOrdenados = Object.keys(gastosPorDia).sort().reverse();

  // Encontrar el valor máximo diario para calcular los porcentajes de las barras horizontales
  const maxMontoDiario = Math.max(...Object.values(gastosPorDia), 1);

  // 5. Métodos de pago
  const metodosPago: { [key: string]: number } = {};
  gastosCompartidos.forEach((g) => {
    const metodo = g.metodo_pago || 'Efectivo';
    if (!metodosPago[metodo]) metodosPago[metodo] = 0;
    metodosPago[metodo] += Number(g.monto);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      {/* Evolución Mensual */}
      <Card className="border-slate-800 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <CardTitle className="text-base font-semibold">Evolución Mensual del Hogar</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {mesesOrdenados.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No hay datos suficientes.</p>
          ) : (
            mesesOrdenados.map((mes) => {
              const totalMes = evolucionMensual[mes];
              return (
                <div key={mes} className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 flex justify-between items-center text-sm">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="font-medium text-slate-200">Mes: {mes}</span>
                  </div>
                  <span className="font-bold text-emerald-400">S/ {totalMes.toFixed(2)}</span>
                </div>
              );
            })
          )}
        </CardContent>
      </Card>

      {/* Categoría Principal (Top Gasto) */}
      <Card className="border-slate-800 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <Award className="w-5 h-5" />
            </div>
            <CardTitle className="text-base font-semibold">Categoría Principal (Top Gasto)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center justify-center text-center space-y-2">
          {montoTop === 0 ? (
            <p className="text-sm text-slate-400 py-6">Sin registros para analizar.</p>
          ) : (
            <>
              <span className="text-xs text-slate-400 uppercase tracking-wider font-medium">El rubro donde más se gasta es</span>
              <h3 className="text-2xl font-black text-purple-400 bg-purple-950/50 px-4 py-2 rounded-2xl border border-purple-800/40">
                {categoriaTop}
              </h3>
              <p className="text-lg font-bold text-emerald-400 mt-1">S/ {montoTop.toFixed(2)} acumulados</p>
            </>
          )}
        </CardContent>
      </Card>

      {/* Detector de Gastos Hormiga */}
      <Card className="border-amber-950/50 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <CardTitle className="text-base font-semibold">Alerta de Gastos Hormiga</CardTitle>
          </div>
          <span className="text-[10px] bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-800/40">
            Ocio, Regalos, Gustos, Otros (≤ S/ 10)
          </span>
        </CardHeader>
        <CardContent className="pt-4 space-y-2">
          <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-300">Total en micro-antojos:</span>
            <span className="font-bold text-amber-400">S/ {totalHormiga.toFixed(2)}</span>
          </div>
          <p className="text-[11px] text-slate-400 pt-1">
            {gastosHormiga.length} transacciones registradas en Ocio, Regalos, Gustos u Otros menores a S/ 10.00. Mantenerlos bajo control asegura un ahorro inteligente.
          </p>
        </CardContent>
      </Card>

      {/* Gráfico de Barras Horizontales de Ritmo Diario con Scroll */}
      <Card className="border-slate-800 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <CardTitle className="text-base font-semibold">Ritmo de Gasto Diario (Gráfico)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          {/* Contenedor con barra de desplazamiento */}
          <div className="max-h-[160px] overflow-y-auto pr-2 space-y-2.5 scrollbar-thin scrollbar-thumb-slate-800">
            {diasOrdenados.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-4">No hay días registrados.</p>
            ) : (
              diasOrdenados.map((fecha) => {
                const monto = gastosPorDia[fecha];
                const porcentaje = (monto / maxMontoDiario) * 100;

                return (
                  <div key={fecha} className="bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/80 space-y-1.5 text-xs">
                    <div className="flex justify-between items-center font-medium">
                      <span className="text-slate-300">📅 {fecha}</span>
                      <span className="font-bold text-emerald-400">S/ {monto.toFixed(2)}</span>
                    </div>
                    {/* Barra horizontal proporcional */}
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(porcentaje, 4)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          <div className="space-y-1 pt-2 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-purple-400" /> Métodos de pago más usados:
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {Object.entries(metodosPago).map(([metodo, total]) => (
                <span key={metodo} className="text-[10px] bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800">
                  {metodo}: <strong>S/ {total.toFixed(2)}</strong>
                </span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};