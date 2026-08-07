import React, { useState } from 'react';
import { crearGasto } from '../../lib/gastosService';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { PlusCircle, DollarSign, Tag, User, CreditCard } from 'lucide-react';

interface FormularioGastoProps {
  onGastoCreado: () => void;
}

export const FormularioGasto = ({ onGastoCreado }: FormularioGastoProps) => {
  const [descripcion, setDescripcion] = useState('');
  const [monto, setMonto] = useState('');
  // 1. Iniciamos los estados en vacío para obligar al usuario a elegir
  const [categoria, setCategoria] = useState('');
  const [pagadoPor, setPagadoPor] = useState('');
  const [metodoPago, setMetodoPago] = useState('');
  const [esPersonal, setEsPersonal] = useState(false);
  const [cargando, setCargando] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // 2. Validamos que se hayan seleccionado obligatoriamente
    if (!descripcion || !monto || !categoria || !pagadoPor || !metodoPago) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    setCargando(true);
    try {
      await crearGasto({
        fecha: new Date().toISOString().split('T')[0],
        descripcion,
        monto: parseFloat(monto),
        categoria,
        pagado_por: pagadoPor,
        metodo_pago: metodoPago,
        es_personal: esPersonal,
      });

      // Limpiamos el formulario y restablecemos los selectores a vacío
      setDescripcion('');
      setMonto('');
      setCategoria('');
      setPagadoPor('');
      setMetodoPago('');
      setEsPersonal(false);
      onGastoCreado(); 
    } catch (error) {
      console.error(error);
    } finally {
      setCargando(false);
    }
  };

  return (
    <Card className="border-purple-950/50 shadow-2xl shadow-purple-950/20">
      <CardHeader className="flex flex-row items-center justify-between pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
            <PlusCircle className="w-5 h-5" />
          </div>
          <CardTitle className="text-base font-semibold">Registrar Nuevo Gasto</CardTitle>
        </div>
        <span className="text-[10px] bg-purple-950/60 text-purple-300 px-2.5 py-1 rounded-full border border-purple-800/40">
          Soles (S/)
        </span>
      </CardHeader>

      <CardContent className="pt-5 space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-purple-400" /> Descripción
            </label>
            <Input
              type="text"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Ej: Supermercado, luz, cena..."
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> Monto (S/)
              </label>
              <Input
                type="number"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0.00"
                className="font-semibold text-emerald-400"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-purple-400" /> Categoría
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                required
                className="flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all"
              >
                <option value="" disabled>Seleccionar categoría...</option>
                <option value="Alimentación">Alimentación</option>
                <option value="Servicios">Servicios</option>
                <option value="Alquiler">Alquiler</option>
                <option value="Transporte">Transporte</option>
                <option value="Hogar">Hogar</option>
                <option value="Salud">Salud</option>
                <option value="Ocio">Ocio</option>
                <option value="Regalos">Regalos</option>
                <option value="Gustos">Gustos</option>
                <option value="Vacaciones">Vacaciones</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-pink-400" /> Pagado por
              </label>
              <select
                value={pagadoPor}
                onChange={(e) => setPagadoPor(e.target.value)}
                required
                className="flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-white font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all"
              >
                <option value="" disabled>¿Quién pagó?...</option>
                <option value="Jazmine">Jazmine</option>
                <option value="Marcos">Marcos</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-indigo-400" /> Método de Pago
              </label>
              <select
                value={metodoPago}
                onChange={(e) => setMetodoPago(e.target.value)}
                required
                className="flex h-10 w-full rounded-xl border border-slate-800 bg-slate-950/80 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-500 transition-all"
              >
                <option value="" disabled>Seleccionar método...</option>
                <option value="Yape">Yape</option>
                <option value="Plin">Plin</option>
                <option value="Efectivo">Efectivo</option>
                <option value="Tarjeta Débito">Tarjeta Débito</option>
                <option value="Tarjeta Crédito">Tarjeta Crédito</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-1 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80">
            <input
              type="checkbox"
              id="esPersonal"
              checked={esPersonal}
              onChange={(e) => setEsPersonal(e.target.value === 'true' || e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
            />
            <label htmlFor="esPersonal" className="text-xs text-slate-300 cursor-pointer select-none">
              Gasto personal (excluir de deuda compartida)
            </label>
          </div>

          <Button type="submit" variant="gradient" className="w-full py-3 text-sm font-semibold">
            {cargando ? 'Guardando...' : 'Registrar Gasto'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
