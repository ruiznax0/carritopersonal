import { X } from 'lucide-react';
import type { ModalState } from '../types';

interface FormModalProps {
  modalState: ModalState;
  onClose: () => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function FormModal({ modalState, onClose, onSubmit }: FormModalProps) {
  if (!modalState.isOpen) return null;

  const { type, editData } = modalState;
  const isEdit = !!editData;

  const title = `${isEdit ? 'Editar' : 'Añadir'} ${type === 'category' ? 'Ambiente' : type === 'product' ? 'Producto' : 'Alternativa'
    }`;

  // Helper to get field value from editData safely
  const getVal = (field: string): string => {
    if (!editData) return '';
    return String((editData as unknown as Record<string, unknown>)[field] ?? '');
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl w-full max-w-md p-6 m-auto">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-lg font-bold text-zinc-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          {type === 'category' ? (
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Nombre del Ambiente
              </label>
              <input
                required
                name="name"
                defaultValue={getVal('name')}
                className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none placeholder-zinc-600"
                placeholder="Ej: 🪴 Terraza"
              />
            </div>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Nombre del {type === 'product' ? 'Producto' : 'Artículo'}
                </label>
                <input
                  required
                  name="nombre"
                  defaultValue={getVal('nombre')}
                  className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none placeholder-zinc-600"
                  placeholder="Ej: Mesa de centro"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Precio ($)
                  </label>
                  <input
                    type="number"
                    name="precio"
                    defaultValue={getVal('precio')}
                    className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none placeholder-zinc-600"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                    Tienda
                  </label>
                  <input
                    name="tienda"
                    defaultValue={getVal('tienda')}
                    className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none placeholder-zinc-600"
                    placeholder="Ej: Sodimac"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Link del Producto
                </label>
                <input
                  type="url"
                  name="link"
                  defaultValue={getVal('link')}
                  className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none placeholder-zinc-600"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                  Link de Imagen
                </label>
                <input
                  type="url"
                  name="imagen"
                  defaultValue={getVal('imagen')}
                  className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none placeholder-zinc-600"
                  placeholder="https://..."
                />
              </div>
            </>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 text-sm bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-colors"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}