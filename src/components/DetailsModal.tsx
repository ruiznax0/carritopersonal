import { X } from 'lucide-react';
import type { Category, DetailsType, MedioDePago } from '../types';
import { formatMoney } from '../utils/helpers';

interface DetailsModalProps {
  isOpen: boolean;
  type: DetailsType;
  categories: Category[];
  mediosDePago: MedioDePago[];
  onClose: () => void;
}

export default function DetailsModal({ isOpen, type, categories, mediosDePago, onClose }: DetailsModalProps) {
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
    (sum, cat) => sum + cat.products.reduce((s, p) => s + (Number(p.precio) || 0), 0), 0
  );

  // Totales por medio de pago — solo para adquiridos y total
  const totalesPorMedio = mediosDePago.map(medio => {
    const total = filteredCategories.reduce((sum, cat) =>
      sum + cat.products
        .filter(p => p.medioDePagoId === medio.id)
        .reduce((s, p) => s + (Number(p.precio) || 0), 0),
      0
    );
    return { medio, total };
  }).filter(x => x.total > 0);

  const sinAsignar = filteredCategories.reduce((sum, cat) =>
    sum + cat.products
      .filter(p => !p.medioDePagoId)
      .reduce((s, p) => s + (Number(p.precio) || 0), 0),
    0
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 border border-zinc-700 rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-2xl sm:mx-4 flex flex-col"
        style={{ maxHeight: '88vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 bg-zinc-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-4 sm:px-5 pt-3 sm:pt-5 pb-3 border-b border-zinc-800 flex justify-between items-start shrink-0">
          <div>
            <h2 className="text-base font-bold text-zinc-100">{titleMap[type]}</h2>
            <p className="text-xs text-zinc-500 mt-0.5 tabular-nums">Total: {formatMoney(grandTotal)}</p>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="px-4 sm:px-5 py-4 overflow-y-auto flex-1 space-y-6">

          {/* Resumen por medio de pago */}
          {totalesPorMedio.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Por medio de pago</p>
              <div className="space-y-1.5">
                {totalesPorMedio.map(({ medio, total }) => (
                  <div key={medio.id} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${medio.color}`} />
                      <span className="text-xs text-zinc-300">{medio.nombre}</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-200 tabular-nums">{formatMoney(total)}</span>
                  </div>
                ))}
                {sinAsignar > 0 && (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full shrink-0 bg-zinc-600" />
                      <span className="text-xs text-zinc-500">Sin asignar</span>
                    </div>
                    <span className="text-xs font-bold text-zinc-500 tabular-nums">{formatMoney(sinAsignar)}</span>
                  </div>
                )}
              </div>
              <div className="border-t border-zinc-800 mt-3" />
            </div>
          )}

          {/* Detalle por categoría */}
          {filteredCategories.length === 0 ? (
            <p className="text-center text-zinc-500 py-6 text-sm">No hay artículos en este listado.</p>
          ) : (
            <div className="space-y-5">
              {filteredCategories.map(cat => {
                const catSubtotal = cat.products.reduce((sum, p) => sum + (Number(p.precio) || 0), 0);
                return (
                  <div key={cat.id}>
                    <div className="flex justify-between items-center border-b border-zinc-800 pb-1.5 mb-2">
                      <h3 className="font-semibold text-xs sm:text-sm text-zinc-300">{cat.name}</h3>
                      <span className="font-bold text-xs sm:text-sm text-zinc-200 tabular-nums shrink-0 ml-2">
                        {formatMoney(catSubtotal)}
                      </span>
                    </div>
                    <ul className="space-y-1.5">
                      {cat.products.map(p => {
                        const medio = p.medioDePagoId
                          ? mediosDePago.find(m => m.id === p.medioDePagoId)
                          : null;
                        return (
                          <li key={p.id} className="flex justify-between items-start gap-2 text-xs">
                            <div className="flex items-start gap-1.5 min-w-0">
                              {medio && (
                                <div className={`w-2 h-2 rounded-full shrink-0 mt-0.5 ${medio.color}`} />
                              )}
                              <span className="text-zinc-500 leading-snug">{p.nombre}</span>
                            </div>
                            <span className="font-semibold text-zinc-400 tabular-nums shrink-0">
                              {formatMoney(p.precio)}
                            </span>
                          </li>
                        );
                      })}
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