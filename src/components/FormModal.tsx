import { X } from 'lucide-react';
import type { ModalState, MedioDePago } from '../types';

interface FormModalProps {
  modalState: ModalState;
  mediosDePago: MedioDePago[];
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function FormModal({ modalState, mediosDePago, onClose, onSubmit }: FormModalProps) {
  if (!modalState.isOpen) return null;

  const { type, editData } = modalState;
  const isEdit = !!editData;

  const title = `${isEdit ? 'Editar' : 'Nueva'} ${
    type === 'category' ? 'Categoría' : type === 'product' ? 'Producto' : 'Alternativa'
  }`;

  const getVal = (field: string): string => {
    if (!editData) return '';
    return String((editData as unknown as Record<string, unknown>)[field] ?? '');
  };

  const inputClass = 'w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none placeholder-zinc-600';
  const labelClass = 'block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider';

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-md sm:mx-4 max-h-[92vh] flex flex-col">

        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 bg-zinc-700 rounded-full" />
        </div>

        <div className="flex justify-between items-center px-4 sm:px-5 pt-3 sm:pt-5 pb-3 shrink-0">
          <h2 className="text-base font-bold text-zinc-100">{title}</h2>
          <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="overflow-y-auto flex-1 px-4 sm:px-5 pb-4 sm:pb-5 space-y-4">
          {type === 'category' ? (
            <div>
              <label className={labelClass}>Nombre de la Categoría</label>
              <input
                required
                name="name"
                defaultValue={getVal('name')}
                className={inputClass}
                placeholder="Ej: 🪴 Terraza, 🛋️ Living..."
                autoFocus
              />
            </div>
          ) : (
            <>
              <div>
                <label className={labelClass}>
                  Nombre del {type === 'product' ? 'Producto' : 'Artículo'}
                </label>
                <input
                  required
                  name="nombre"
                  defaultValue={getVal('nombre')}
                  className={inputClass}
                  placeholder="Ej: Mesa de centro"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Precio ($)</label>
                  <input
                    type="number"
                    name="precio"
                    defaultValue={getVal('precio')}
                    className={inputClass}
                    placeholder="0"
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <label className={labelClass}>Tienda</label>
                  <input
                    name="tienda"
                    defaultValue={getVal('tienda')}
                    className={inputClass}
                    placeholder="Ej: Sodimac"
                  />
                </div>
              </div>

              {/* Medio de pago — solo en productos, no en alternativas */}
              {type === 'product' && mediosDePago.length > 0 && (
                <div>
                  <label className={labelClass}>Medio de Pago</label>
                  <select
                    name="medioDePagoId"
                    defaultValue={getVal('medioDePagoId')}
                    className={`${inputClass} cursor-pointer`}
                  >
                    <option value="">— Sin asignar —</option>
                    {mediosDePago.map(m => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                </div>
              )}

              <div>
                <label className={labelClass}>Link del Producto</label>
                <input
                  type="url"
                  name="link"
                  defaultValue={getVal('link')}
                  className={inputClass}
                  placeholder="https://..."
                  inputMode="url"
                />
              </div>

              <div>
                <label className={labelClass}>Link de Imagen</label>
                <input
                  type="url"
                  name="imagen"
                  defaultValue={getVal('imagen')}
                  className={inputClass}
                  placeholder="https://..."
                  inputMode="url"
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-2 border-t border-zinc-800">
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg font-medium transition-colors">
              Cancelar
            </button>
            <button type="submit" className="px-5 py-2.5 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors active:scale-95">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}