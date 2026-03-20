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
    <header className="bg-zinc-900/80 backdrop-blur-sm border-b border-zinc-800 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-emerald-500 rounded-lg flex items-center justify-center shrink-0">
              <Home size={18} className="text-zinc-900" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-zinc-100 leading-none">Lista Hogar</h1>
              <p className="text-xs text-zinc-500 mt-0.5">Seguimiento de compras</p>
            </div>
          </div>

          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={onImportClick}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors text-sm font-medium border border-zinc-700"
            >
              <Upload size={14} /> Importar
            </button>
            <button
              onClick={onExport}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg transition-colors text-sm font-medium"
            >
              <Download size={14} /> Exportar
            </button>
          </div>
        </div>

        {/* Totals */}
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-800/60 border border-emerald-900/50 p-3 rounded-xl flex flex-col items-center">
            <span className="text-emerald-400 text-[10px] font-bold uppercase tracking-wider mb-1">Adquirido</span>
            <span className="text-lg font-bold text-emerald-400 tabular-nums">{formatMoney(totals.adquiridos)}</span>
            <button
              onClick={onShowAdquiridos}
              className="mt-2 text-[10px] font-medium text-zinc-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <List size={10} /> Ver detalle
            </button>
          </div>

          <div className="bg-zinc-800/60 border border-amber-900/50 p-3 rounded-xl flex flex-col items-center">
            <span className="text-amber-400 text-[10px] font-bold uppercase tracking-wider mb-1">Pendiente</span>
            <span className="text-lg font-bold text-amber-400 tabular-nums">{formatMoney(totals.pendientes)}</span>
            <button
              onClick={onShowPendientes}
              className="mt-2 text-[10px] font-medium text-zinc-500 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <List size={10} /> Ver detalle
            </button>
          </div>

          <div className="bg-zinc-800/60 border border-zinc-700/50 p-3 rounded-xl flex flex-col items-center">
            <span className="text-zinc-400 text-[10px] font-bold uppercase tracking-wider mb-1">Total</span>
            <span className="text-lg font-bold text-zinc-200 tabular-nums">{formatMoney(totals.total)}</span>
            <button
              onClick={onShowTotal}
              className="mt-2 text-[10px] font-medium text-zinc-500 hover:text-zinc-300 flex items-center gap-1 transition-colors"
            >
              <List size={10} /> Ver detalle
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}