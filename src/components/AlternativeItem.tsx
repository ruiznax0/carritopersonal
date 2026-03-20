import { ExternalLink, Edit, Trash2 } from 'lucide-react';
import type { Alternative } from '../types';
import { formatMoney } from '../utils/helpers';

interface AlternativeItemProps {
  alt: Alternative;
  onEdit: () => void;
  onDelete: () => void;
}

export default function AlternativeItem({ alt, onEdit, onDelete }: AlternativeItemProps) {
  return (
    <div className="bg-zinc-800/70 border border-zinc-700/60 rounded-lg p-2.5 flex items-start justify-between gap-2">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-zinc-200 leading-snug">🔄 {alt.nombre}</p>
        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-zinc-500 mt-1">
          {alt.tienda && <span>🏬 {alt.tienda}</span>}
          {alt.link && (
            <a href={alt.link} target="_blank" rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-0.5">
              <ExternalLink size={10} /> Link
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span className="text-xs font-semibold text-zinc-300 tabular-nums">{formatMoney(alt.precio)}</span>
        <div className="flex gap-0.5">
          <button onClick={onEdit} className="p-1 text-zinc-600 hover:text-emerald-400 transition-colors">
            <Edit size={12} />
          </button>
          <button onClick={onDelete} className="p-1 text-zinc-600 hover:text-red-400 transition-colors">
            <Trash2 size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}