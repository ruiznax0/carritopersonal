import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Edit, ExternalLink, Image as ImageIcon, CheckCircle2, Circle } from 'lucide-react';
import type { Product } from '../types';
import { formatMoney } from '../utils/helpers';
import AlternativeItem from './AlternativeItem';

interface ProductItemProps {
  product: Product;
  categoryId: string;
  onToggleAcquired: () => void;
  onEditProduct: () => void;
  onDeleteProduct: () => void;
  onAddAlternative: () => void;
  onEditAlternative: (altId: string) => void;
  onDeleteAlternative: (altId: string) => void;
}

export default function ProductItem({
  product,
  onToggleAcquired,
  onEditProduct,
  onDeleteProduct,
  onAddAlternative,
  onEditAlternative,
  onDeleteAlternative,
}: ProductItemProps) {
  const [altsOpen, setAltsOpen] = useState(false);
  const hasAlternatives = product.alternativas && product.alternativas.length > 0;

  return (
    <li className={`p-4 transition-colors border-b border-zinc-800 last:border-b-0 ${product.adquirido ? 'bg-emerald-950/20' : 'hover:bg-zinc-800/40'}`}>
      <div className="flex flex-col sm:flex-row gap-4">

        {/* Checkbox */}
        <button
          onClick={onToggleAcquired}
          className={`mt-1 shrink-0 transition-colors ${product.adquirido ? 'text-emerald-400' : 'text-zinc-600 hover:text-zinc-400'}`}
        >
          {product.adquirido ? <CheckCircle2 size={22} /> : <Circle size={22} />}
        </button>

        {/* Product Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <h3 className={`text-sm font-semibold leading-snug ${product.adquirido ? 'text-zinc-500 line-through decoration-zinc-600' : 'text-zinc-100'}`}>
                {product.nombre}
              </h3>
              <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1.5 text-xs text-zinc-500">
                {product.tienda && <span className="flex items-center gap-1">🏬 {product.tienda}</span>}
                {product.link && (
                  <a href={product.link} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300">
                    <ExternalLink size={12} /> Link
                  </a>
                )}
                {product.imagen && (
                  <a href={product.imagen} target="_blank" rel="noreferrer"
                    className="flex items-center gap-1 text-violet-400 hover:text-violet-300">
                    <ImageIcon size={12} /> Foto
                  </a>
                )}
              </div>
            </div>

            {/* Price + Actions */}
            <div className="text-left sm:text-right flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1 shrink-0">
              <span className={`text-base font-bold tabular-nums ${
                product.precio === 0 ? 'text-zinc-700' : product.adquirido ? 'text-emerald-500' : 'text-zinc-200'
              }`}>
                {formatMoney(product.precio)}
              </span>
              <div className="flex gap-1.5">
                <button onClick={onEditProduct} className="p-1 text-zinc-600 hover:text-emerald-400 transition-colors rounded">
                  <Edit size={14} />
                </button>
                <button onClick={onDeleteProduct} className="p-1 text-zinc-600 hover:text-red-400 transition-colors rounded">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>

          {/* Alternatives */}
          <div className="mt-3 flex items-center gap-3">
            {hasAlternatives && (
              <button
                onClick={() => setAltsOpen(p => !p)}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-300 flex items-center gap-1 bg-zinc-800 px-2.5 py-1 rounded-md transition-colors"
              >
                {altsOpen ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                {product.alternativas.length} alternativa{product.alternativas.length !== 1 && 's'}
              </button>
            )}
            <button
              onClick={onAddAlternative}
              className="text-xs font-medium text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"
            >
              <Plus size={12} /> Agregar alternativa
            </button>
          </div>

          {hasAlternatives && altsOpen && (
            <div className="mt-3 pl-4 border-l-2 border-zinc-700 space-y-2">
              {product.alternativas.map(alt => (
                <AlternativeItem
                  key={alt.id}
                  alt={alt}
                  onEdit={() => onEditAlternative(alt.id)}
                  onDelete={() => onDeleteAlternative(alt.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}