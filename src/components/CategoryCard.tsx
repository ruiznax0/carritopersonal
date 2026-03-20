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
        className="p-4 cursor-pointer hover:bg-zinc-800/50 transition-colors"
        onClick={() => setIsOpen(p => !p)}
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-center gap-3">
            <button className="text-zinc-500 hover:text-zinc-200 shrink-0">
              {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
            <div>
              <h2 className="text-base font-bold text-zinc-100">{category.name}</h2>
              <p className="text-xs text-zinc-500 mt-0.5">{acquiredCount}/{totalCount} adquiridos</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 ml-7 sm:ml-0">
            <span className="px-2.5 py-1 bg-emerald-950 text-emerald-400 text-xs font-semibold rounded-full border border-emerald-900">
              ✓ {formatMoney(catTotals.adquiridos)}
            </span>
            <span className="px-2.5 py-1 bg-amber-950 text-amber-400 text-xs font-semibold rounded-full border border-amber-900">
              ⏳ {formatMoney(catTotals.pendientes)}
            </span>
            <span className="px-2.5 py-1 bg-zinc-800 text-zinc-300 text-xs font-semibold rounded-full border border-zinc-700">
              {formatMoney(catTotals.total)}
            </span>
            <div className="flex items-center gap-1 ml-1" onClick={e => e.stopPropagation()}>
              <button onClick={onEditCategory} className="p-1.5 text-zinc-600 hover:text-emerald-400 rounded transition-colors">
                <Edit size={14} />
              </button>
              <button onClick={onDeleteCategory} className="p-1.5 text-zinc-600 hover:text-red-400 rounded transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 ml-7">
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
              />
            ))}
          </ul>

          {/* Add Product */}
          <div className="p-4">
            <button
              onClick={onAddProduct}
              className="w-full py-2.5 border border-dashed border-zinc-700 text-zinc-500 rounded-lg hover:border-emerald-600 hover:text-emerald-400 transition-colors flex items-center justify-center gap-2 text-sm font-medium"
            >
              <Plus size={16} /> Añadir producto
            </button>
          </div>
        </div>
      )}
    </div>
  );
}