import { X } from 'lucide-react';
import type { Category, DetailsType } from '../types';
import { formatMoney } from '../utils/helpers';

interface DetailsModalProps {
  isOpen: boolean;
  type: DetailsType;
  categories: Category[];
  onClose: () => void;
}

export default function DetailsModal({ isOpen, type, categories, onClose }: DetailsModalProps) {
  if (!isOpen || !type) return null;

  const titleMap: Record<string, string> = {
    adquiridos: 'Artículos Adquiridos',
    pendientes: 'Artículos Pendientes',
    total: 'Proyecto Completo',
  };

  const filteredCategories = categories
    .map(cat => {
      let products = cat.products;
      if (type === 'adquiridos') products = cat.products.filter(p => p.adquirido);
      if (type === 'pendientes') products = cat.products.filter(p => !p.adquirido);
      return { ...cat, products };
    })
    .filter(cat => cat.products.length > 0);

  const grandTotal = filteredCategories.reduce(
    (sum, cat) => sum + cat.products.reduce((s, p) => s + (Number(p.precio) || 0), 0),
    0
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-2xl max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="p-5 border-b border-zinc-800 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-base font-bold text-zinc-100">{titleMap[type]}</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Total: {formatMoney(grandTotal)}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto flex-1">
          {filteredCategories.length === 0 ? (
            <p className="text-center text-zinc-500 py-10 text-sm">No hay artículos en este listado.</p>
          ) : (
            <div className="space-y-5">
              {filteredCategories.map(cat => {
                const catSubtotal = cat.products.reduce((sum, p) => sum + (Number(p.precio) || 0), 0);
                return (
                  <div key={cat.id}>
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-2">
                      <h3 className="font-semibold text-sm text-zinc-300">{cat.name}</h3>
                      <span className="font-bold text-sm text-zinc-200 tabular-nums">{formatMoney(catSubtotal)}</span>
                    </div>
                    <ul className="space-y-1.5">
                      {cat.products.map(p => (
                        <li key={p.id} className="flex justify-between items-center text-xs">
                          <span className="text-zinc-500 truncate pr-4">{p.nombre}</span>
                          <span className="font-semibold text-zinc-400 tabular-nums shrink-0">{formatMoney(p.precio)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}