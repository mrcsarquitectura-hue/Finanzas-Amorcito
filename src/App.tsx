import { useState, useEffect } from 'react';
import { Navbar } from './components/shared/Navbar';
import { FormularioGasto } from './components/shared/FormularioGasto';
import { ResumenFinanciero } from './components/desktop/ResumenFinanciero';
import { HistorialFiltros } from './components/desktop/HistorialFiltros';
import { GraficoCategorias } from './components/desktop/GraficoCategorias';
import { EstadisticasAvanzadas } from './components/desktop/EstadisticasAvanzadas';
import { AuditoriaSaldos } from './components/desktop/AuditoriaSaldos';
import { VistaMovil } from './components/mobile/VistaMovil';
import { obtenerGastos } from './lib/gastosService';
import type { Gasto } from './interfaces/gasto';
import { Calendar, BarChart3, History, Scale } from 'lucide-react';

export function App() {
  const [vistaActual, setVistaActual] = useState<'desktop' | 'mobile'>('desktop');
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [cargando, setCargando] = useState(true);

  // Pestañas de navegación para escritorio ('dashboard' | 'historial' | 'auditoria')
  const [pestanaActiva, setPestanaActiva] = useState<'dashboard' | 'historial' | 'auditoria'>('dashboard');

  const mesActualPorDefecto = new Date().toISOString().substring(0, 7);
  const [mesFiltroGlobal, setMesFiltroGlobal] = useState<string>(mesActualPorDefecto);

  const cargarDatos = async () => {
    setCargando(true);
    const data = await obtenerGastos();
    setGastos(data);
    setCargando(false);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const mesesDisponibles = Array.from(
    new Set(gastos.map((g) => (g.fecha ? g.fecha.substring(0, 7) : '')).filter(Boolean))
  ).sort().reverse();

  const mesActivo = mesesDisponibles.includes(mesFiltroGlobal) ? mesFiltroGlobal : (mesesDisponibles[0] || mesActualPorDefecto);
  const gastosDelMes = gastos.filter((g) => g.fecha && g.fecha.startsWith(mesActivo));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar vistaActual={vistaActual} setVistaActual={setVistaActual} />

      <main className="flex-1 p-6 md:p-8 flex flex-col items-center justify-start">
        {vistaActual === 'desktop' ? (
          // SE AMPLIÓ EL CONTENEDOR A max-w-7xl PARA APROVECHAR LOS LATERALES EN PANTALLAS 16:9
          <div className="w-full max-w-7xl space-y-6">
            
            {/* Cabecera Única con Selector Global y Menú de Pestañas */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-900 border border-slate-800 p-4 md:p-5 rounded-2xl shadow-xl">
              <div className="text-center md:text-left space-y-0.5">
                <h1 className="text-xl font-bold text-purple-400">Dashboard de Escritorio</h1>
                <p className="text-xs text-slate-400">Control de finanzas en pareja en Soles peruanos (S/)</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {/* Botones de navegación tipo pestañas */}
                <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
                  <button
                    onClick={() => setPestanaActiva('dashboard')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      pestanaActiva === 'dashboard'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <BarChart3 className="w-3.5 h-3.5" /> Dashboard
                  </button>
                  <button
                    onClick={() => setPestanaActiva('historial')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      pestanaActiva === 'historial'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <History className="w-3.5 h-3.5" /> Historial
                  </button>
                  <button
                    onClick={() => setPestanaActiva('auditoria')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      pestanaActiva === 'auditoria'
                        ? 'bg-purple-600 text-white shadow-lg'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" /> Auditoría
                  </button>
                </div>

                {/* Selector Global de Mes */}
                <div className="flex items-center gap-2 bg-slate-950 px-3 py-2 rounded-xl border border-slate-800">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="text-xs text-slate-300 font-medium">Periodo:</span>
                  <select
                    value={mesActivo}
                    onChange={(e) => setMesFiltroGlobal(e.target.value)}
                    className="bg-transparent text-xs text-white font-bold focus:outline-none cursor-pointer"
                  >
                    {mesesDisponibles.length === 0 ? (
                      <option value={mesActualPorDefecto}>{mesActualPorDefecto}</option>
                    ) : (
                      mesesDisponibles.map((m) => (
                        <option key={m} value={m} className="bg-slate-900 text-white">
                          {m}
                        </option>
                      ))
                    )}
                  </select>
                </div>
              </div>
            </div>

            {/* VISTAS CONDICIONALES SEGÚN LA PESTAÑA SELECCIONADA */}

            {pestanaActiva === 'dashboard' && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <ResumenFinanciero gastos={gastos} mesSeleccionadoGlobal={mesActivo} />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2">
                  <FormularioGasto onGastoCreado={cargarDatos} />
                  <GraficoCategorias gastos={gastosDelMes} />
                </div>

                <EstadisticasAvanzadas gastos={gastos} mesSeleccionadoGlobal={mesActivo} />
              </div>
            )}

            {pestanaActiva === 'historial' && (
              <div className="w-full pt-2 animate-in fade-in duration-200">
                <HistorialFiltros gastos={gastosDelMes} cargando={cargando} onGastoActualizado={cargarDatos} />
              </div>
            )}

            {pestanaActiva === 'auditoria' && (
              <div className="w-full pt-2 animate-in fade-in duration-200">
                <AuditoriaSaldos gastos={gastos} />
              </div>
            )}

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