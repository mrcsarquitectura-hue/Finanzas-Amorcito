import { useState, useEffect } from 'react';
import { Navbar } from './components/shared/Navbar';
import { FormularioGasto } from './components/shared/FormularioGasto';
import { ResumenFinanciero } from './components/desktop/ResumenFinanciero';
import { HistorialFiltros } from './components/desktop/HistorialFiltros';
import { GraficoCategorias } from './components/desktop/GraficoCategorias';
import { EstadisticasAvanzadas } from './components/desktop/EstadisticasAvanzadas';
import { VistaMovil } from './components/mobile/VistaMovil';
import { obtenerGastos } from './lib/gastosService';
import type { Gasto } from './interfaces/gasto';

export function App() {
  const [vistaActual, setVistaActual] = useState<'desktop' | 'mobile'>('desktop');
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [cargando, setCargando] = useState(true);

  const cargarDatos = async () => {
    setCargando(true);
    const data = await obtenerGastos();
    setGastos(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar vistaActual={vistaActual} setVistaActual={setVistaActual} />

      <main className="flex-1 p-6 flex flex-col items-center justify-start">
        {vistaActual === 'desktop' ? (
          <div className="w-full max-w-5xl space-y-6">
            <div className="text-center space-y-1">
              <h1 className="text-2xl font-bold text-purple-400">Dashboard de Escritorio</h1>
              <p className="text-xs text-slate-400">Control de finanzas en pareja en Soles peruanos (S/)</p>
            </div>

            <ResumenFinanciero gastos={gastos} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2">
              <FormularioGasto onGastoCreado={cargarDatos} />
              <GraficoCategorias gastos={gastos} />
            </div>

            {/* Nuevas Estadísticas Avanzadas */}
            <EstadisticasAvanzadas gastos={gastos} />

            <div className="w-full pt-2">
              <HistorialFiltros gastos={gastos} cargando={cargando} onGastoActualizado={cargarDatos} />
            </div>
          </div>
        ) : (
          <div className="w-full">
            <VistaMovil gastos={gastos} onGastoCreado={cargarDatos} />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;