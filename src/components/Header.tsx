import { Home, Download, Upload, List } from 'lucide-react';
import type { Totals } from '../types';
import { formatMoney } from '../utils/helpers';

interface HeaderProps {
  totals: Totals;
  onExport: () => void;
  onImportClick: () => void;
  onShowAdquiridos: () => void;
  onShowPendientes: () => void;
  onShowTotal: () => void;
}

export default function Header({
  totals,
  onExport,
  onImportClick,
  onShowAdquiridos,
  onShowPendientes,
  onShowTotal,
}: HeaderProps) {
  return (
    <header className="bg-zinc-900/90 backdrop-blur-sm border-b border-zinc-800 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-3 sm:py-4">

        {/* Top row: logo + buttons */}
        <div className="flex items-center justify-between gap-3 mb-3 sm:mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
              <Home size={16} className="text-zinc-900" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold text-zinc-100 leading-none">Lista Hogar</h1>
              <p className="text-[10px] sm:text-xs text-zinc-500 mt-0.5 hidden sm:block">Seguimiento de compras</p>
            </div>
          </div>

          <div className="flex gap-2 shrink-0">
            <button
              onClick={onImportClick}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-xs sm:text-sm font-medium border border-zinc-700"
            >
              <Upload size={13} />
              <span className="sm:inline">Importar</span>
            </button>
            <button
              onClick={onExport}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-xs sm:text-sm font-medium"
            >
              <Download size={13} />
              <span className="sm:inline">Exportar</span>
            </button>
          </div>
        </div>

        {/* Totals grid — cada card es también un botón */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3">

          <button
            onClick={onShowAdquiridos}
            className="bg-zinc-800/60 border border-emerald-900/50 px-2 py-2.5 sm:p-3 rounded-xl flex flex-col items-center hover:bg-zinc-800 transition-colors group active:scale-95"
          >
            <span className="text-emerald-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-1">Adquirido</span>
            <span className="text-[13px] sm:text-base font-bold text-emerald-400 tabular-nums leading-tight break-all text-center">
              {formatMoney(totals.adquiridos)}
            </span>
            <span className="text-[9px] text-zinc-600 group-hover:text-emerald-500 flex items-center gap-0.5 mt-1.5 transition-colors">
              <List size={8} /> Ver detalle
            </span>
          </button>

          <button
            onClick={onShowPendientes}
            className="bg-zinc-800/60 border border-amber-900/50 px-2 py-2.5 sm:p-3 rounded-xl flex flex-col items-center hover:bg-zinc-800 transition-colors group active:scale-95"
          >
            <span className="text-amber-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-1">Pendiente</span>
            <span className="text-[13px] sm:text-base font-bold text-amber-400 tabular-nums leading-tight break-all text-center">
              {formatMoney(totals.pendientes)}
            </span>
            <span className="text-[9px] text-zinc-600 group-hover:text-amber-500 flex items-center gap-0.5 mt-1.5 transition-colors">
              <List size={8} /> Ver detalle
            </span>
          </button>

          <button
            onClick={onShowTotal}
            className="bg-zinc-800/60 border border-zinc-700/50 px-2 py-2.5 sm:p-3 rounded-xl flex flex-col items-center hover:bg-zinc-800 transition-colors group active:scale-95"
          >
            <span className="text-zinc-400 text-[9px] sm:text-[10px] font-bold uppercase tracking-wider mb-1">Total</span>
            <span className="text-[13px] sm:text-base font-bold text-zinc-200 tabular-nums leading-tight break-all text-center">
              {formatMoney(totals.total)}
            </span>
            <span className="text-[9px] text-zinc-600 group-hover:text-zinc-300 flex items-center gap-0.5 mt-1.5 transition-colors">
              <List size={8} /> Ver detalle
            </span>
          </button>

        </div>
      </div>
    </header>
  );
}