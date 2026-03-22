import { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Trash2, Edit } from 'lucide-react';
import type { Category, Alternative } from '../types';
import { formatMoney } from '../utils/helpers';
import ProductItem from './ProductItem';

interface CategoryCardProps {
  category: Category;
  onEditCategory: () => void;
  onDeleteCategory: () => void;
  onToggleProduct: (prodId: string) => void;
  onEditProduct: (prodId: string) => void;
  onDeleteProduct: (prodId: string) => void;
  onAddProduct: () => void;
  onAddAlternative: (prodId: string) => void;
  onEditAlternative: (prodId: string, alt: Alternative) => void;
  onDeleteAlternative: (prodId: string, altId: string) => void;
  onSwapAlternative: (prodId: string, altId: string) => void;
}

export default function CategoryCard({
  category,
  onEditCategory,
  onDeleteCategory,
  onToggleProduct,
  onEditProduct,
  onDeleteProduct,
  onAddProduct,
  onAddAlternative,
  onEditAlternative,
  onDeleteAlternative,
  onSwapAlternative,
}: CategoryCardProps) {
  const [isOpen, setIsOpen] = useState(true);

  const catTotals = category.products.reduce(
    (acc, p) => {
      const price = Number(p.precio) || 0;
      if (p.adquirido) acc.adquiridos += price;
      else acc.pendientes += price;
      acc.total += price;
      return acc;
    },
    { adquiridos: 0, pendientes: 0, total: 0 }
  );

  const acquiredCount = category.products.filter(p => p.adquirido).length;
  const totalCount = category.products.length;
  const progressPct = totalCount > 0 ? Math.round((acquiredCount / totalCount) * 100) : 0;

  return (
    <div className="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden shadow-lg">

      {/* Header */}
      <div
        className="p-3 sm:p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
        onClick={() => setIsOpen(p => !p)}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <button className="text-zinc-500 hover:text-zinc-200 shrink-0 mt-0.5">
              {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            <div className="min-w-0">
              <h2 className="text-sm sm:text-base font-bold text-zinc-100 leading-snug">{category.name}</h2>
              <p className="text-[10px] sm:text-xs text-zinc-500 mt-0.5">{acquiredCount}/{totalCount} adquiridos</p>
            </div>
          </div>

          <div className="flex items-center gap-0.5 shrink-0" onClick={e => e.stopPropagation()}>
            <button onClick={onEditCategory} className="p-1.5 text-zinc-600 hover:text-emerald-400 rounded transition-colors">
              <Edit size={14} />
            </button>
            <button onClick={onDeleteCategory} className="p-1.5 text-zinc-600 hover:text-red-400 rounded transition-colors">
              <Trash2 size={14} />
            </button>
          </div>
        </div>

        {/* Badges */}
        <div className="flex flex-wrap items-center gap-1.5 mt-2 ml-6">
          <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 text-[10px] sm:text-xs font-semibold rounded-full border border-emerald-900 tabular-nums">
            ✓ {formatMoney(catTotals.adquiridos)}
          </span>
          <span className="px-2 py-0.5 bg-amber-950 text-amber-400 text-[10px] sm:text-xs font-semibold rounded-full border border-amber-900 tabular-nums">
            ⏳ {formatMoney(catTotals.pendientes)}
          </span>
          <span className="px-2 py-0.5 bg-zinc-800 text-zinc-300 text-[10px] sm:text-xs font-semibold rounded-full border border-zinc-700 tabular-nums">
            {formatMoney(catTotals.total)}
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-2.5 ml-6">
          <div className="h-1 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Products */}
      {isOpen && (
        <div className="border-t border-zinc-800">
          <ul>
            {category.products.map(product => (
              <ProductItem
                key={product.id}
                product={product}
                categoryId={category.id}
                onToggleAcquired={() => onToggleProduct(product.id)}
                onEditProduct={() => onEditProduct(product.id)}
                onDeleteProduct={() => onDeleteProduct(product.id)}
                onAddAlternative={() => onAddAlternative(product.id)}
                onEditAlternative={(altId) => {
                  const alt = product.alternativas.find(a => a.id === altId);
                  if (alt) onEditAlternative(product.id, alt);
                }}
                onDeleteAlternative={(altId) => onDeleteAlternative(product.id, altId)}
                onSwapAlternative={(altId) => onSwapAlternative(product.id, altId)}
              />
            ))}
          </ul>

          <div className="p-3 sm:p-4">
            <button
              onClick={onAddProduct}
              className="w-full py-2.5 border border-dashed border-zinc-700 text-zinc-500 rounded-lg hover:border-emerald-600 hover:text-emerald-400 transition-colors flex items-center justify-center gap-2 text-xs sm:text-sm font-medium active:scale-95"
            >
              <Plus size={15} /> Nuevo ítem
            </button>
          </div>
        </div>
      )}
    </div>
  );
}