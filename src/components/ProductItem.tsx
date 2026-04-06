import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Edit, ExternalLink, Image as ImageIcon, CheckCircle2, Circle } from 'lucide-react';
import type { Product, MedioDePago } from '../types';
import { formatMoney } from '../utils/helpers';
import AlternativeItem from './AlternativeItem';

interface ProductItemProps {
  product: Product;
  categoryId: string;
  mediosDePago: MedioDePago[];
  onToggleAcquired: () => void;
  onEditProduct: () => void;
  onDeleteProduct: () => void;
  onAddAlternative: () => void;
  onEditAlternative: (altId: string) => void;
  onDeleteAlternative: (altId: string) => void;
  onSwapAlternative: (altId: string) => void;
}

export default function ProductItem({
  product,
  mediosDePago,
  onToggleAcquired,
  onEditProduct,
  onDeleteProduct,
  onAddAlternative,
  onEditAlternative,
  onDeleteAlternative,
  onSwapAlternative,
}: ProductItemProps) {
  const [altsOpen, setAltsOpen] = useState(false);
  const hasAlternatives = product.alternativas && product.alternativas.length > 0;

  const medio = product.medioDePagoId
    ? mediosDePago.find(m => m.id === product.medioDePagoId)
    : null;

  return (
    <li className={`px-3 sm:px-4 py-3 transition-colors border-b border-zinc-800/80 last:border-b-0 ${
      product.adquirido ? 'bg-emerald-950/20' : 'hover:bg-zinc-800/30'
    }`}>
      <div className="flex items-start gap-2.5 sm:gap-3">

        {/* Checkbox */}
        <button
          onClick={onToggleAcquired}
          className={`mt-0.5 shrink-0 transition-colors active:scale-90 ${
            product.adquirido ? 'text-emerald-400' : 'text-zinc-600 hover:text-zinc-400'
          }`}
        >
          {product.adquirido ? <CheckCircle2 size={20} /> : <Circle size={20} />}
        </button>

        <div className="flex-1 min-w-0">
          {/* Name + price + actions */}
          <div className="flex items-start justify-between gap-2">
            <h3 className={`text-sm font-semibold leading-snug flex-1 min-w-0 ${
              product.adquirido ? 'text-zinc-500 line-through decoration-zinc-600' : 'text-zinc-100'
            }`}>
              {product.nombre}
            </h3>

            <div className="flex items-center gap-2 shrink-0">
              <span className={`text-sm font-bold tabular-nums ${
                product.precio === 0 ? 'text-zinc-700' : product.adquirido ? 'text-emerald-500' : 'text-zinc-300'
              }`}>
                {product.precio > 0 ? formatMoney(product.precio) : '—'}
              </span>
              <div className="flex gap-0.5">
                <button onClick={onEditProduct} className="p-1.5 text-zinc-600 hover:text-emerald-400 transition-colors rounded active:scale-90">
                  <Edit size={13} />
                </button>
                <button onClick={onDeleteProduct} className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors rounded active:scale-90">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          </div>

          {/* Meta: tienda, medio de pago, links */}
          <div className="flex items-center flex-wrap gap-x-3 gap-y-1 mt-1 text-[11px] text-zinc-500">
            {product.tienda && <span>🏬 {product.tienda}</span>}

            {/* Badge medio de pago */}
            {medio && (
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold text-white ${medio.color}`}>
                {medio.nombre}
              </span>
            )}

            {product.link && (
              <a href={product.link} target="_blank" rel="noreferrer"
                className="flex items-center gap-0.5 text-emerald-500 hover:text-emerald-400">
                <ExternalLink size={11} /> Link
              </a>
            )}
            {product.imagen && (
              <a href={product.imagen} target="_blank" rel="noreferrer"
                className="flex items-center gap-0.5 text-violet-400 hover:text-violet-300">
                <ImageIcon size={11} /> Foto
              </a>
            )}
          </div>

          {/* Alternatives toggle */}
          <div className="flex items-center gap-2 mt-2">
            {hasAlternatives && (
              <button
                onClick={() => setAltsOpen(p => !p)}
                className="text-[11px] font-medium text-zinc-500 hover:text-zinc-300 flex items-center gap-1 bg-zinc-800 px-2 py-1 rounded-md transition-colors"
              >
                {altsOpen ? <ChevronUp size={11} /> : <ChevronDown size={11} />}
                {product.alternativas.length} alt.
              </button>
            )}
            <button
              onClick={onAddAlternative}
              className="text-[11px] font-medium text-emerald-600 hover:text-emerald-400 flex items-center gap-0.5 transition-colors"
            >
              <Plus size={11} /> Alternativa
            </button>
          </div>

          {/* Alternatives list */}
          {hasAlternatives && altsOpen && (
            <div className="mt-2 pl-3 border-l-2 border-zinc-700/60 space-y-2">
              {product.alternativas.map(alt => (
                <AlternativeItem
                  key={alt.id}
                  alt={alt}
                  onEdit={() => onEditAlternative(alt.id)}
                  onDelete={() => onDeleteAlternative(alt.id)}
                  onSwap={() => onSwapAlternative(alt.id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </li>
  );
}