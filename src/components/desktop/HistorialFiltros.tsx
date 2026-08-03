import { useState } from 'react';
import type { Gasto } from '../../interfaces/gasto';
import { actualizarGasto, eliminarGasto } from '../../lib/gastosService';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Search, History, Edit3, Trash2, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';

interface HistorialFiltrosProps {
  gastos: Gasto[];
  cargando: boolean;
  onGastoActualizado: () => void;
}

export const HistorialFiltros = ({ gastos, cargando, onGastoActualizado }: HistorialFiltrosProps) => {
  const [filtroCategoria, setFiltroCategoria] = useState('Todas');
  const [filtroPagadoPor, setFiltroPagadoPor] = useState('Todos');
  const [busqueda, setBusqueda] = useState('');
  
  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);
  const elementosPorPagina = 8; // Cantidad de gastos por página

  const [gastoEditando, setGastoEditando] = useState<Gasto | null>(null);
  const [descEdit, setDescEdit] = useState('');
  const [montoEdit, setMontoEdit] = useState('');
  const [catEdit, setCatEdit] = useState('');

  const iniciarEdicion = (g: Gasto) => {
    setGastoEditando(g);
    setDescEdit(g.descripcion);
    setMontoEdit(String(g.monto));
    setCatEdit(g.categoria);
  };

  const guardarEdicion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gastoEditando || !gastoEditando.id) return;

    try {
      await actualizarGasto(gastoEditando.id, {
        descripcion: descEdit,
        monto: parseFloat(montoEdit),
        categoria: catEdit,
      });
      setGastoEditando(null);
      onGastoActualizado();
    } catch (error) {
      console.error('No se pudo actualizar', error);
    }
  };

  const manejarEliminar = async (id?: string) => {
    if (!id) return;
    const confirmar = window.confirm('¿Estás seguro de que deseas eliminar este gasto?');
    if (!confirmar) return;

    try {
      await eliminarGasto(id);
      onGastoActualizado();
    } catch (error) {
      console.error('No se pudo eliminar el gasto', error);
    }
  };

  // Filtrado
  const gastosFiltrados = gastos.filter((g) => {
    const coincideCategoria = filtroCategoria === 'Todas' || g.categoria === filtroCategoria;
    const coincidePagadoPor = filtroPagadoPor === 'Todos' || g.pagado_por === filtroPagadoPor;
    const coincideBusqueda = g.descripcion.toLowerCase().includes(busqueda.toLowerCase());

    return coincideCategoria && coincidePagadoPor && coincideBusqueda;
  });

  // Lógica de Paginación
  const totalPaginas = Math.ceil(gastosFiltrados.length / elementosPorPagina) || 1;
  const indiceUltimoGasto = paginaActual * elementosPorPagina;
  const indicePrimerGasto = indiceUltimoGasto - elementosPorPagina;
  const gastosPaginados = gastosFiltrados.slice(indicePrimerGasto, indiceUltimoGasto);

  return (
    <Card className="border-slate-800 shadow-xl relative">
      <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
            <History className="w-5 h-5 text-purple-400" />
          </div>
          <CardTitle className="text-base sm:text-lg font-semibold">Historial de Movimientos</CardTitle>
        </div>
        <span className="text-xs sm:text-sm text-purple-400 bg-purple-950/60 px-3 py-1.5 rounded-lg border border-purple-800/40 font-medium">
          Mostrando {gastosFiltrados.length} resultados
        </span>
      </CardHeader>

      <CardContent className="pt-5 space-y-4">
        {/* Filtros */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3.5" />
            <Input
              type="text"
              value={busqueda}
              onChange={(e) => { setBusqueda(e.target.value); setPaginaActual(1); }}
              placeholder="Buscar descripción..."
              className="pl-9 text-sm sm:text-base py-2.5"
            />
          </div>

          <div className="relative">
            <select
              value={filtroCategoria}
              onChange={(e) => { setFiltroCategoria(e.target.value); setPaginaActual(1); }}
              className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm sm:text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all"
            >
              <option value="Todas">Todas las categorías</option>
              <option value="Alimentación">Alimentación</option>
              <option value="Servicios">Servicios</option>
              <option value="Alquiler">Alquiler</option>
              <option value="Transporte">Transporte</option>
              <option value="Salud">Salud</option>
              <option value="Ocio">Ocio</option>
              <option value="Regalos">Regalos</option>
              <option value="Gustos">Gustos</option>
              <option value="Vacaciones">Vacaciones</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          <div className="relative">
            <select
              value={filtroPagadoPor}
              onChange={(e) => { setFiltroPagadoPor(e.target.value); setPaginaActual(1); }}
              className="flex h-11 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm sm:text-base text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all"
            >
              <option value="Todos">Ambos (Jazmine y Marcos)</option>
              <option value="Jazmine">Jazmine</option>
              <option value="Marcos">Marcos</option>
            </select>
          </div>
        </div>

        {/* Lista de Movimientos */}
        {cargando ? (
          <p className="text-sm sm:text-base text-slate-400 text-center py-8">Cargando base de datos...</p>
        ) : gastosPaginados.length === 0 ? (
          <p className="text-sm sm:text-base text-slate-400 text-center py-8">No se encontraron gastos con estos filtros.</p>
        ) : (
          <div className="space-y-2.5 pt-1">
            {gastosPaginados.map((g) => (
              <div key={g.id} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 flex justify-between items-center text-sm sm:text-base hover:border-slate-700 transition-all">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-slate-100">{g.descripcion}</p>
                    {g.es_personal && (
                      <span className="text-[10px] bg-amber-950/80 text-amber-300 px-2 py-0.5 rounded-full border border-amber-800/60 font-medium">
                        Personal
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-purple-950/80 text-purple-300 px-2.5 py-0.5 rounded-full border border-purple-800/40 font-medium">
                      {g.categoria}
                    </span>
                    <span className="text-xs text-slate-400">• {g.metodo_pago} • {g.fecha}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="text-right">
                    <p className="font-bold text-emerald-400 text-base sm:text-lg">S/ {Number(g.monto).toFixed(2)}</p>
                    <span className="text-xs text-slate-400 font-medium">Pagó: {g.pagado_por}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => iniciarEdicion(g)}
                      className="p-2 sm:p-2.5 rounded-xl bg-slate-900 text-slate-300 hover:bg-purple-950/60 hover:text-purple-400 border border-slate-800 transition-all"
                      title="Editar gasto"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => manejarEliminar(g.id)}
                      className="p-2 sm:p-2.5 rounded-xl bg-slate-900 text-red-400 hover:bg-red-950/60 border border-slate-800 transition-all"
                      title="Eliminar gasto"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Controles de Paginación */}
        {totalPaginas > 1 && (
          <div className="flex justify-between items-center pt-3 border-t border-slate-800">
            <Button
              variant="outline"
              onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
              disabled={paginaActual === 1}
              className="flex items-center gap-1 text-xs sm:text-sm"
            >
              <ChevronLeft className="w-4 h-4" /> Anterior
            </Button>
            
            <span className="text-xs sm:text-sm text-slate-400 font-medium">
              Página <strong className="text-white">{paginaActual}</strong> de <strong className="text-white">{totalPaginas}</strong>
            </span>

            <Button
              variant="outline"
              onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
              disabled={paginaActual === totalPaginas}
              className="flex items-center gap-1 text-xs sm:text-sm"
            >
              Siguiente <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Modal flotante de Edición */}
        {gastoEditando && (
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-center items-center z-50 animate-in fade-in duration-200">
            <div className="w-full max-w-md bg-slate-900 border border-purple-900/50 p-6 rounded-3xl shadow-2xl space-y-4 relative">
              <button
                onClick={() => setGastoEditando(null)}
                className="absolute right-4 top-4 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-purple-400" /> Editar Gasto
              </h3>

              <form onSubmit={guardarEdicion} className="space-y-3">
                <div>
                  <label className="text-xs sm:text-sm text-slate-400 block mb-1">Descripción</label>
                  <Input
                    type="text"
                    value={descEdit}
                    onChange={(e) => setDescEdit(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs sm:text-sm text-slate-400 block mb-1">Monto (S/)</label>
                    <Input
                      type="number"
                      step="0.01"
                      value={montoEdit}
                      onChange={(e) => setMontoEdit(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm text-slate-400 block mb-1">Categoría</label>
                    <select
                      value={catEdit}
                      onChange={(e) => setCatEdit(e.target.value)}
                      className="flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all"
                    >
                      <option value="Alimentación">Alimentación</option>
                      <option value="Servicios">Servicios</option>
                      <option value="Alquiler">Alquiler</option>
                      <option value="Transporte">Transporte</option>
                      <option value="Salud">Salud</option>
                      <option value="Ocio">Ocio</option>
                      <option value="Regalos">Regalos</option>
                      <option value="Gustos">Gustos</option>
                      <option value="Vacaciones">Vacaciones</option>
                      <option value="Otros">Otros</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setGastoEditando(null)}
                    className="w-1/2"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" variant="gradient" className="w-1/2 flex items-center justify-center gap-1.5">
                    <Check className="w-4 h-4" /> Guardar Cambios
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};