import type { Gasto } from '../../interfaces/gasto';

interface GraficoCategoriasProps {
  gastos: Gasto[];
}

export const GraficoCategorias = ({ gastos }: GraficoCategoriasProps) => {
  // 1. Filtrar solo gastos compartidos
  const gastosCompartidos = gastos.filter((g) => !g.es_personal);
  const totalHogar = gastosCompartidos.reduce((acc, g) => acc + Number(g.monto), 0);

  // 2. Definir las categorías estándar
  const categorias = ['Alimentación', 'Servicios', 'Alquiler', 'Transporte', 'Salud', 'Ocio', 'Otros'];

  // 3. Calcular el total gastado por cada categoría
  const datosCategorias = categorias.map((cat) => {
    const totalCat = gastosCompartidos
      .filter((g) => g.categoria === cat)
      .reduce((acc, g) => acc + Number(g.monto), 0);
    
    const porcentaje = totalHogar > 0 ? (totalCat / totalHogar) * 100 : 0;
    return { categoria: cat, total: totalCat, porcentaje };
  }).filter((item) => item.total > 0); // Solo mostrar categorías que tengan gastos

  // Ordenar de mayor a menor gasto
  datosCategorias.sort((a, b) => b.total - a.total);

  // Colores modernos para las barras
  const colores = [
    'from-purple-500 to-indigo-500',
    'from-pink-500 to-rose-500',
    'from-emerald-500 to-teal-500',
    'from-amber-500 to-orange-500',
    'from-cyan-500 to-blue-500',
    'from-violet-500 to-purple-600',
    'from-slate-500 to-zinc-600',
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl space-y-4">
      <h3 className="text-lg font-bold text-white flex items-center gap-2">
        📊 Distribución de Gastos por Categoría
      </h3>

      {totalHogar === 0 ? (
        <p className="text-sm text-slate-400 text-center py-6">No hay datos suficientes para mostrar el gráfico.</p>
      ) : (
        <div className="space-y-3 pt-1">
          {datosCategorias.map((item, index) => (
            <div key={item.categoria} className="space-y-1">
              <div className="flex justify-between text-xs font-medium">
                <span className="text-slate-200">{item.categoria}</span>
                <span className="text-slate-400">
                  S/ {item.total.toFixed(2)} <strong className="text-white">({item.porcentaje.toFixed(1)}%)</strong>
                </span>
              </div>
              {/* Barra de progreso visual con degradado */}
              <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                <div
                  className={`h-full bg-gradient-to-r ${colores[index % colores.length]} transition-all duration-500 rounded-full`}
                  style={{ width: `${item.porcentaje}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};