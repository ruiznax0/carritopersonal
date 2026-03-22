import { useState } from 'react';
import { Plus, Hash, Loader2 } from 'lucide-react';
import { crearLista, unirseALista } from '../lib/firestore';
import type { ListaDoc } from '../lib/firestore';
import { INITIAL_DATA } from '../data/initialData';
import { useAuth } from '../contexts/AuthContext';

interface ListSetupProps {
  onListaLista: (lista: ListaDoc) => void;
}

export default function ListSetup({ onListaLista }: ListSetupProps) {
  const { user } = useAuth();
  const [tab, setTab] = useState<'crear' | 'unirse'>('crear');
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCrear = async () => {
    if (!user) return;
    setLoading(true);
    setError('');
    try {
      const lista = await crearLista(user.uid, 'Lista Hogar', INITIAL_DATA);
      onListaLista(lista);
    } catch (e) {
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
        onListaLista(lista);
      }
    } catch (e) {
      setError('Error al unirse. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">

        <h2 className="text-xl font-bold text-zinc-100 text-center mb-1">Bienvenido 👋</h2>
        <p className="text-sm text-zinc-500 text-center mb-8">
          ¿Primera vez? Crea tu lista. ¿Te invitaron? Únete con el código.
        </p>

        {/* Tabs */}
        <div className="flex bg-zinc-800 rounded-xl p-1 mb-6">
          <button
            onClick={() => { setTab('crear'); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
              tab === 'crear'
                ? 'bg-zinc-700 text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Crear lista
          </button>
          <button
            onClick={() => { setTab('unirse'); setError(''); }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${
              tab === 'unirse'
                ? 'bg-zinc-700 text-zinc-100'
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Unirse con código
          </button>
        </div>

        {tab === 'crear' ? (
          <div className="space-y-4">
            <p className="text-sm text-zinc-400">
              Se creará una lista nueva con los items por defecto. Luego puedes compartir el código de invitación con tu pareja.
            </p>
            <button
              onClick={handleCrear}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl font-semibold text-sm transition-colors active:scale-95"
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Creando...</>
                : <><Plus size={16} /> Crear mi lista</>
              }
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-zinc-400 mb-1.5 uppercase tracking-wider">
                Código de invitación
              </label>
              <div className="relative">
                <Hash size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  value={codigo}
                  onChange={e => setCodigo(e.target.value.toUpperCase())}
                  maxLength={6}
                  placeholder="ABC123"
                  className="w-full bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-lg pl-9 pr-3 py-3 text-sm font-mono tracking-widest uppercase focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none placeholder-zinc-600"
                />
              </div>
            </div>
            <button
              onClick={handleUnirse}
              disabled={loading || codigo.length < 6}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl font-semibold text-sm transition-colors active:scale-95"
            >
              {loading
                ? <><Loader2 size={16} className="animate-spin" /> Buscando...</>
                : 'Unirse a la lista'
              }
            </button>
          </div>
        )}

        {error && (
          <p className="mt-4 text-xs text-red-400 text-center bg-red-950/40 border border-red-900/40 rounded-lg px-3 py-2">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}