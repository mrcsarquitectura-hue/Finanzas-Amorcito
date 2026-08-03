import type { Gasto } from '../../interfaces/gasto';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { BarChart3, Award, Flame, Calendar, CreditCard } from 'lucide-react';

interface EstadisticasAvanzadasProps {
  gastos: Gasto[];
  mesSeleccionadoGlobal: string;
}

export const EstadisticasAvanzadas = ({ gastos, mesSeleccionadoGlobal }: EstadisticasAvanzadasProps) => {
  const gastosCompartidos = gastos.filter((g) => !g.es_personal);

  // 1. Evolución Mensual (Para el gráfico de barras verticales)
  const evolucionMensual: { [key: string]: number } = {};
  gastosCompartidos.forEach((g) => {
    const mes = g.fecha ? g.fecha.substring(0, 7) : 'Sin fecha';
    if (!evolucionMensual[mes]) evolucionMensual[mes] = 0;
    evolucionMensual[mes] += Number(g.monto);
  });
  const mesesOrdenados = Object.keys(evolucionMensual).sort();
  const maxMontoMensual = Math.max(...Object.values(evolucionMensual), 100);

  // 2. Categoría Top (Histórico general)
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

  // 3. Gastos Hormiga (Acumulado Anual / Histórico general)
  const categoriasHormigaPermitidas = ['Ocio', 'Regalos', 'Gustos', 'Otros'];
  const gastosHormigaAnual = gastosCompartidos.filter((g) => {
    const esCategoriaValida = categoriasHormigaPermitidas.includes(g.categoria);
    const esMontoMenor = Number(g.monto) <= 10;
    return esCategoriaValida && esMontoMenor;
  });
  const totalHormigaAnual = gastosHormigaAnual.reduce((acc, g) => acc + Number(g.monto), 0);

  // 4. Ritmo de Gasto Diario Dinámico usando el mes global de la cabecera
  const mesActivo = mesSeleccionadoGlobal;
  const gastosMesSeleccionado = gastosCompartidos.filter((g) => g.fecha && g.fecha.startsWith(mesActivo));

  const gastosPorDia: { [key: string]: number } = {};
  gastosMesSeleccionado.forEach((g) => {
    const fecha = g.fecha;
    if (!gastosPorDia[fecha]) gastosPorDia[fecha] = 0;
    gastosPorDia[fecha] += Number(g.monto);
  });

  const [anioStr, mesStr] = mesActivo.split('-');
  const anioNum = parseInt(anioStr) || new Date().getFullYear();
  const mesNum = parseInt(mesStr) ? parseInt(mesStr) - 1 : new Date().getMonth();
  const diasEnMes = new Date(anioNum, mesNum + 1, 0).getDate();

  const datosGraficoLinea = Array.from({ length: diasEnMes }, (_, i) => {
    const diaNum = String(i + 1).padStart(2, '0');
    const fechaStr = `${mesActivo}-${diaNum}`;
    return {
      dia: `${i + 1}`,
      fecha: fechaStr,
      total: gastosPorDia[fechaStr] || 0
    };
  });

  const maxMontoDiario = Math.max(...datosGraficoLinea.map((d) => d.total), 50);

  // 5. Métodos de pago (Filtrados al mes seleccionado)
  const metodosPagoMes: { [key: string]: number } = {};
  gastosMesSeleccionado.forEach((g) => {
    const metodo = g.metodo_pago || 'Efectivo';
    if (!metodosPagoMes[metodo]) metodosPagoMes[metodo] = 0;
    metodosPagoMes[metodo] += Number(g.monto);
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      
      {/* 1. Fila Superior Izquierda: Categoría Principal (Top Gasto) */}
      <Card className="border-slate-800 shadow-xl flex flex-col justify-between">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
              <Award className="w-5 h-5" />
            </div>
            <CardTitle className="text-base font-semibold">Categoría Principal (Top Gasto)</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6 flex flex-col items-center justify-center text-center space-y-2 my-auto">
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

      {/* 2. Fila Superior Derecha: Alerta de Gastos Hormiga Anual */}
      <Card className="border-amber-950/50 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <Flame className="w-5 h-5" />
            </div>
            <CardTitle className="text-base font-semibold">Alerta de Gastos Hormiga (Anual)</CardTitle>
          </div>
          <span className="text-[10px] bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-800/40">
            ≤ S/ 10.00
          </span>
        </CardHeader>
        <CardContent className="pt-4 space-y-3">
          <div className="flex justify-between items-center bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-300">Total acumulado en micro-antojos:</span>
            <span className="font-bold text-amber-400">S/ {totalHormigaAnual.toFixed(2)}</span>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-medium text-slate-400 block">Historial de micro-antojos registrados:</span>
            {gastosHormigaAnual.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-3 text-center bg-slate-950/30 rounded-xl border border-slate-900">
                No hay gastos hormiga registrados.
              </p>
            ) : (
              <div className="max-h-[140px] overflow-y-auto pr-1 space-y-1.5 scrollbar-thin scrollbar-thumb-slate-800">
                {gastosHormigaAnual.map((g) => (
                  <div key={g.id} className="bg-slate-950/80 px-3 py-2 rounded-xl border border-slate-800/80 flex justify-between items-center text-xs">
                    <div>
                      <p className="font-semibold text-slate-200">{g.descripcion}</p>
                      <span className="text-[10px] text-slate-400">{g.categoria} • {g.fecha}</span>
                    </div>
                    <span className="font-bold text-amber-400">S/ {Number(g.monto).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* 3. Fila Inferior Izquierda: Evolución Mensual en Gráfico de Barras Verticales limpio */}
      <Card className="border-slate-800 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
              <BarChart3 className="w-5 h-5" />
            </div>
            <CardTitle className="text-base font-semibold">Evolución Mensual del Hogar</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {mesesOrdenados.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">No hay datos suficientes.</p>
          ) : (
            <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-3">
              {/* Contenedor del Gráfico de Columnas Verticales */}
              <div className="relative h-52 w-full flex items-end justify-around gap-4 pt-6 px-3 border-b border-slate-800/80 pb-2">
                {/* Líneas de referencia horizontales */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-3 py-5">
                  {[0, 0.5, 1].map((ratio, idx) => (
                    <div key={idx} className="w-full border-b border-slate-800/50 text-[9px] text-slate-600 flex justify-end">
                      <span>S/ {Math.round(maxMontoMensual * (1 - ratio))}</span>
                    </div>
                  ))}
                </div>

                {/* Barras verticales */}
                {mesesOrdenados.map((mes) => {
                  const totalMes = evolucionMensual[mes];
                  const alturaPorcentaje = Math.max((totalMes / maxMontoMensual) * 100, 8);

                  return (
                    <div key={mes} className="relative flex flex-col items-center h-full justify-end group z-10 w-full max-w-[56px]">
                      {/* Tooltip flotante al pasar el mouse */}
                      <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none bg-slate-900 border border-purple-500/50 text-[10px] text-white text-center rounded px-2 py-1 shadow-xl whitespace-nowrap">
                        {mes}: <span className="text-emerald-400 font-bold">S/ {totalMes.toFixed(2)}</span>
                      </div>

                      {/* Columna / Barra vertical */}
                      <div
                        style={{ height: `${alturaPorcentaje}%` }}
                        className="w-full bg-gradient-to-t from-purple-600 to-indigo-500 rounded-t-lg transition-all duration-300 group-hover:from-purple-500 group-hover:to-emerald-400 shadow-md shadow-purple-950"
                      ></div>
                    </div>
                  );
                })}
              </div>

              {/* Etiquetas de los meses abajo */}
              <div className="flex justify-around text-[11px] text-slate-300 font-medium px-2">
                {mesesOrdenados.map((mes) => (
                  <span key={mes} className="truncate text-center">
                    {mes}
                  </span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Fila Inferior Derecha: Ritmo de Gasto Diario y Métodos de Pago */}
      <Card className="border-slate-800 shadow-xl">
        <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <CardTitle className="text-base font-semibold">Ritmo de Gasto Diario ({mesActivo})</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <div className="relative h-40 w-full">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 600 140" preserveAspectRatio="none">
                {[0, 35, 70, 105, 140].map((y) => (
                  <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
                ))}

                <polyline
                  fill="none"
                  stroke="url(#purpleGradient)"
                  strokeWidth="3"
                  points={datosGraficoLinea
                    .map((d, index) => {
                      const x = (index / (datosGraficoLinea.length - 1)) * 580 + 10;
                      const y = 130 - (d.total / maxMontoDiario) * 115;
                      return `${x},${y}`;
                    })
                    .join(' ')}
                />

                <defs>
                  <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#6366f1" />
                  </linearGradient>
                </defs>

                {datosGraficoLinea.map((d, index) => {
                  const x = (index / (datosGraficoLinea.length - 1)) * 580 + 10;
                  const y = 130 - (d.total / maxMontoDiario) * 115;
                  return (
                    <g key={d.fecha} className="group cursor-pointer">
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        className="fill-purple-400 stroke-slate-950 stroke-2 transition-all group-hover:r-7 group-hover:fill-emerald-400"
                      />
                      <foreignObject x={x - 40} y={y - 45} width="80" height="35" className="opacity-0 group-hover:opacity-100 transition-opacity overflow-visible pointer-events-none">
                        <div className="bg-slate-900 border border-purple-500/50 text-[10px] text-white text-center rounded px-1 py-0.5 shadow-xl">
                          Día {d.dia}: <span className="text-emerald-400 font-bold">S/ {d.total.toFixed(0)}</span>
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div className="flex justify-between text-[10px] text-slate-400 pt-2 border-t border-slate-800/80 mt-2">
              <span>Día 1</span>
              <span>Día {Math.round(diasEnMes / 2)}</span>
              <span>Día {diasEnMes}</span>
            </div>
          </div>

          <div className="space-y-1 pt-1 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <CreditCard className="w-3.5 h-3.5 text-purple-400" /> Métodos de pago ({mesActivo}):
            </span>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {Object.keys(metodosPagoMes).length === 0 ? (
                <span className="text-[10px] text-slate-400">Sin registros en este mes.</span>
              ) : (
                Object.entries(metodosPagoMes).map(([metodo, total]) => (
                  <span key={metodo} className="text-[10px] bg-slate-900 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-800">
                    {metodo}: <strong>S/ {total.toFixed(2)}</strong>
                  </span>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};