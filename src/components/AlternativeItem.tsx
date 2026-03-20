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
    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 text-sm flex flex-col sm:flex-row justify-between gap-2">
      <div>
        <p className="font-medium text-zinc-200">🔄 {alt.nombre}</p>
        <div className="flex gap-3 text-xs text-zinc-500 mt-1">
          {alt.tienda && <span>🏬 {alt.tienda}</span>}
          {alt.link && (
            <a href={alt.link} target="_blank" rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1">
              <ExternalLink size={12} /> Link
            </a>
          )}
        </div>
      </div>
      <div className="flex items-center sm:items-start justify-between sm:flex-col gap-2">
        <span className="font-semibold text-zinc-300">{formatMoney(alt.precio)}</span>
        <div className="flex gap-2">
          <button onClick={onEdit} className="text-zinc-500 hover:text-emerald-400 transition-colors">
            <Edit size={14} />
          </button>
          <button onClick={onDelete} className="text-zinc-500 hover:text-red-400 transition-colors">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}