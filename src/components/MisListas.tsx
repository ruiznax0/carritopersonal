import { useState } from 'react';
import { Plus, Hash, Loader2, LogIn, ArrowRight, LogOut, Users, ChevronDown, ChevronUp } from 'lucide-react';
import { crearLista, unirseALista } from '../lib/firestore';
import type { ListaDoc } from '../lib/firestore';
import type { Category } from '../types';
import { generateId } from '../utils/helpers';
import { useAuth } from '../contexts/AuthContext';

interface MisListasProps {
  listas: ListaDoc[];
  loadingListas: boolean;
  onEntrar: (lista: ListaDoc) => void;
  onListaCreada: (lista: ListaDoc) => void;
}

export default function MisListas({ listas, loadingListas, onEntrar, onListaCreada }: MisListasProps) {
  const { user, logout } = useAuth();
  const [panel, setPanel] = useState<'none' | 'crear' | 'unirse'>('none');

  // Formulario crear
  const [nombreLista, setNombreLista] = useState('');
  const [nombreCategoria, setNombreCategoria] = useState('');

  // Formulario unirse
  const [codigo, setCodigo] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCrear = async () => {
    if (!user || !nombreLista.trim()) return;
    setLoading(true);
    setError('');
    try {
      const categorias: Category[] = nombreCategoria.trim()
        ? [{ id: generateId(), name: nombreCategoria.trim(), products: [] }]
        : [];

      const lista = await crearLista(user.uid, nombreLista.trim(), categorias);
      onListaCreada(lista);
    } catch {
      setError('Error al crear la lista. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnirse = async () => {
    if (!user || !codigo.trim()) return;
    setLoading(true);
    setError('');
    try {
      const lista = await unirseALista(user.uid, codigo.trim());
      if (!lista) {
        setError('Código inválido. Verifica e intenta de nuevo.');
      } else {
        onListaCreada(lista);
      }
    } catch {
      setError('Error al unirse. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const togglePanel = (p: 'crear' | 'unirse') => {
    setPanel(prev => prev === p ? 'none' : p);
    setError('');
  };

  const inputClass = 'w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none placeholder-zinc-600';
  const labelClass = 'block text-[11px] font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider';

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 pb-20">

      {/* Header */}
      <div className="bg-zinc-900 border-b border-zinc-800 px-4 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-base font-bold text-zinc-100">Mis Listas</h1>
            <p className="text-xs text-zinc-500 mt-0.5 truncate max-w-[220px]">{user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-red-400 transition-colors"
          >
            <LogOut size={13} /> Salir
          </button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">

        {/* Listas existentes */}
        {loadingListas ? (
          <div className="flex justify-center py-12">
            <Loader2 size={24} className="text-emerald-500 animate-spin" />
          </div>
        ) : listas.length === 0 ? (
          <div className="text-center py-10 text-zinc-600 text-sm">
            No tienes listas aún.<br />Crea una o únete con un código.
          </div>
        ) : (
          <div className="space-y-3">
            {listas.map(lista => {
              const totalProductos = lista.categorias.reduce((sum, c) => sum + c.products.length, 0);
              const adquiridos = lista.categorias.reduce(
                (sum, c) => sum + c.products.filter(p => p.adquirido).length, 0
              );
              return (
                <div key={lista.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h2 className="font-bold text-zinc-100 text-sm">{lista.nombre}</h2>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-zinc-500">
                        <span className="flex items-center gap-1">
                          <Users size={11} /> {lista.colaboradores.length} colab.
                        </span>
                        <span>{adquiridos}/{totalProductos} items</span>
                        <span className="font-mono tracking-wider text-zinc-600">#{lista.codigoInvitacion}</span>
                      </div>
                      <div className="mt-2 h-1 bg-zinc-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: totalProductos > 0 ? `${Math.round((adquiridos / totalProductos) * 100)}%` : '0%' }}
                        />
                      </div>
                    </div>
                    <button
                      onClick={() => onEntrar(lista)}
                      className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold transition-colors active:scale-95 shrink-0"
                    >
                      Entrar <ArrowRight size={13} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Acciones */}
        <div className="space-y-2 pt-2">

          {/* Crear */}
          <button
            onClick={() => togglePanel('crear')}
            className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-dashed border-zinc-700 hover:border-emerald-600 text-zinc-400 hover:text-zinc-100 rounded-xl text-sm font-semibold transition-all"
          >
            <span className="flex items-center gap-2"><Plus size={16} /> Nueva lista</span>
            {panel === 'crear' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {panel === 'crear' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-4">
              <div>
                <label className={labelClass}>Nombre de la lista *</label>
                <input
                  value={nombreLista}
                  onChange={e => setNombreLista(e.target.value)}
                  className={inputClass}
                  placeholder="Ej: Lista Hogar, Depto Santiago..."
                  autoFocus
                />
              </div>
              <div>
                <label className={labelClass}>Primera categoría <span className="normal-case text-zinc-600 font-normal">(opcional)</span></label>
                <input
                  value={nombreCategoria}
                  onChange={e => setNombreCategoria(e.target.value)}
                  className={inputClass}
                  placeholder="Ej: 🛋️ Living, 🍳 Cocina..."
                />
              </div>
              <button
                onClick={handleCrear}
                disabled={loading || !nombreLista.trim()}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg text-sm font-semibold transition-colors active:scale-95"
              >
                {loading ? <><Loader2 size={15} className="animate-spin" /> Creando...</> : 'Crear lista'}
              </button>
            </div>
          )}

          {/* Unirse */}
          <button
            onClick={() => togglePanel('unirse')}
            className="w-full flex items-center justify-between px-4 py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 text-zinc-400 hover:text-zinc-100 rounded-xl text-sm font-semibold transition-all"
          >
            <span className="flex items-center gap-2"><LogIn size={16} /> Unirse con código</span>
            {panel === 'unirse' ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>

          {panel === 'unirse' && (
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 space-y-3">
              <div>
                <label className={labelClass}>Código de invitación</label>
                <div className="relative">
                  <Hash size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    value={codigo}
                    onChange={e => setCodigo(e.target.value.toUpperCase())}
                    maxLength={6}
                    placeholder="ABC123"
                    className={`${inputClass} pl-8 font-mono tracking-widest uppercase`}
                  />
                </div>
              </div>
              <button
                onClick={handleUnirse}
                disabled={loading || codigo.length < 6}
                className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-lg text-sm font-semibold transition-colors active:scale-95"
              >
                {loading ? <><Loader2 size={15} className="animate-spin" /> Buscando...</> : 'Unirse'}
              </button>
            </div>
          )}

          {error && (
            <p className="text-xs text-red-400 text-center bg-red-950/40 border border-red-900/40 rounded-lg px-3 py-2">
              {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}