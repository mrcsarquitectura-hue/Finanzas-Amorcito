interface NavbarProps {
  vistaActual: 'desktop' | 'mobile';
  setVistaActual: (vista: 'desktop' | 'mobile') => void;
}

export const Navbar = ({ vistaActual, setVistaActual }: NavbarProps) => {
  return (
    <header className="w-full bg-slate-950/80 backdrop-blur-md border-b border-purple-950/40 sticky top-0 z-50 px-6 py-4">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        {/* Logo / Título con gradiente neón */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-900/50 text-white font-black text-lg">
            S/
          </div>
          <div>
            <h1 className="text-base font-bold bg-gradient-to-r from-purple-400 via-fuchsia-300 to-pink-400 bg-clip-text text-transparent">
              GASTOS AMORCITOS
            </h1>
            <p className="text-[11px] text-slate-400">Jazmine & Marcos • Finanzas</p>
          </div>
        </div>

        {/* Botones de Cambio de Vista con efectos Neón */}
        <div className="flex bg-slate-900/90 p-1.5 rounded-2xl border border-purple-900/30 shadow-inner">
          <button
            onClick={() => setVistaActual('desktop')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
              vistaActual === 'desktop'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            💻 Dashboard PC
          </button>
          <button
            onClick={() => setVistaActual('mobile')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 flex items-center gap-2 ${
              vistaActual === 'mobile'
                ? 'bg-gradient-to-r from-pink-600 to-purple-600 text-white shadow-lg shadow-pink-600/30 border border-pink-400/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            📱 Mini-App Móvil
          </button>
        </div>
      </div>
    </header>
  );
};