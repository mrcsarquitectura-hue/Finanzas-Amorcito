import { FormularioGasto } from '../shared/FormularioGasto';
import { X } from 'lucide-react';

interface ModalRegistroMovilProps {
  isOpen: boolean;
  onClose: () => void;
  onGastoAgregado: () => void; // <-- Mantenemos este nombre que usa VistaMovil
}

export const ModalRegistroMovil = ({
  isOpen,
  onClose,
  onGastoAgregado,
}: ModalRegistroMovilProps) => {
  if (!isOpen) return null;

  const manejarExito = () => {
    onGastoAgregado();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-3xl p-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Botón para cerrar el modal */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-white transition-all z-10"
          title="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Formulario compartido (le pasamos manejarExito a onGastoCreado que es lo que pide FormularioGasto) */}
        <div className="pt-2">
          <FormularioGasto onGastoCreado={manejarExito} />
        </div>
      </div>
    </div>
  );
};