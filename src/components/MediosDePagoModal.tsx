import { useState } from 'react';
import { X, Plus, Trash2, Edit, Check } from 'lucide-react';
import type { MedioDePago } from '../types';
import { generateId } from '../utils/helpers';

const COLORES: { label: string; value: string }[] = [
  { label: 'Azul', value: 'bg-blue-500' },
  { label: 'Verde', value: 'bg-emerald-500' },
  { label: 'Violeta', value: 'bg-violet-500' },
  { label: 'Naranja', value: 'bg-orange-500' },
  { label: 'Rosa', value: 'bg-pink-500' },
  { label: 'Rojo', value: 'bg-red-500' },
  { label: 'Amarillo', value: 'bg-yellow-500' },
  { label: 'Celeste', value: 'bg-sky-500' },
];

interface MediosDePagoModalProps {
  medios: MedioDePago[];
  onClose: () => void;
  onGuardar: (medios: MedioDePago[]) => void;
}

export default function MediosDePagoModal({ medios, onClose, onGuardar }: MediosDePagoModalProps) {
  const [lista, setLista] = useState<MedioDePago[]>(medios);
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [nombre, setNombre] = useState('');
  const [color, setColor] = useState(COLORES[0].value);
  const [modoNuevo, setModoNuevo] = useState(false);

  const resetForm = () => {
    setNombre('');
    setColor(COLORES[0].value);
    setEditandoId(null);
    setModoNuevo(false);
  };

  const handleGuardarItem = () => {
    if (!nombre.trim()) return;

    if (editandoId) {
      setLista(prev => prev.map(m => m.id === editandoId ? { ...m, nombre: nombre.trim(), color } : m));
    } else {
      setLista(prev => [...prev, { id: generateId(), nombre: nombre.trim(), color }]);
    }
    resetForm();
  };

  const handleEditar = (medio: MedioDePago) => {
    setEditandoId(medio.id);
    setNombre(medio.nombre);
    setColor(medio.color);
    setModoNuevo(false);
  };

  const handleEliminar = (id: string) => {
    setLista(prev => prev.filter(m => m.id !== id));
    if (editandoId === id) resetForm();
  };

  const handleGuardarTodo = () => {
    onGuardar(lista);
    onClose();
  };

  const inputClass = 'w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none placeholder-zinc-600';

  const formularioVisible = modoNuevo || editandoId !== null;

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-700 rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-md flex flex-col max-h-[90vh]">

        {/* Drag handle móvil */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
          <div className="w-10 h-1 bg-zinc-700 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex justify-between items-center px-4 sm:px-5 pt-3 sm:pt-5 pb-3 shrink-0">
          <h2 className="text-base font-bold text-zinc-100">Medios de Pago</h2>
          <button onClick={onClose} className="p-1.5 text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Lista de medios */}
        <div className="overflow-y-auto flex-1 px-4 sm:px-5 space-y-2">
          {lista.length === 0 && !formularioVisible && (
            <p className="text-xs text-zinc-600 text-center py-6">No hay medios de pago. Agrega uno.</p>
          )}

          {lista.map(medio => (
            <div key={medio.id} className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg border ${editandoId === medio.id ? 'border-emerald-600 bg-zinc-800' : 'border-zinc-800 bg-zinc-800/40'}`}>
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-3 h-3 rounded-full shrink-0 ${medio.color}`} />
                <span className="text-sm text-zinc-200 truncate">{medio.nombre}</span>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => handleEditar(medio)} className="p-1.5 text-zinc-600 hover:text-emerald-400 transition-colors">
                  <Edit size={13} />
                </button>
                <button onClick={() => handleEliminar(medio.id)} className="p-1.5 text-zinc-600 hover:text-red-400 transition-colors">
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}

          {/* Formulario inline */}
          {formularioVisible && (
            <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3 space-y-3 mt-1">
              <input
                autoFocus
                value={nombre}
                onChange={e => setNombre(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleGuardarItem()}
                className={inputClass}
                placeholder="Ej: Tarjeta Banco A, Efectivo..."
              />
              {/* Selector de color */}
              <div>
                <p className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-2">Color</p>
                <div className="flex flex-wrap gap-2">
                  {COLORES.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setColor(c.value)}
                      className={`w-6 h-6 rounded-full ${c.value} flex items-center justify-center transition-transform ${color === c.value ? 'ring-2 ring-white ring-offset-1 ring-offset-zinc-800 scale-110' : 'hover:scale-105'}`}
                    >
                      {color === c.value && <Check size={12} className="text-white" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={resetForm} className="flex-1 py-2 text-xs text-zinc-400 hover:text-zinc-100 hover:bg-zinc-700 rounded-lg transition-colors">
                  Cancelar
                </button>
                <button
                  onClick={handleGuardarItem}
                  disabled={!nombre.trim()}
                  className="flex-1 py-2 text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg font-semibold transition-colors"
                >
                  {editandoId ? 'Actualizar' : 'Agregar'}
                </button>
              </div>
            </div>
          )}

          {/* Botón nuevo */}
          {!formularioVisible && (
            <button
              onClick={() => setModoNuevo(true)}
              className="w-full py-2.5 border border-dashed border-zinc-700 hover:border-emerald-600 text-zinc-500 hover:text-emerald-400 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus size={13} /> Nuevo medio de pago
            </button>
          )}

          <div className="h-2" />
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-5 py-4 border-t border-zinc-800 shrink-0">
          <button
            onClick={handleGuardarTodo}
            className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-semibold transition-colors active:scale-95"
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </div>
  );
}