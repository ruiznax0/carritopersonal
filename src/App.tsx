import { useState, useEffect, useRef } from 'react';
import { Plus, Copy, Check, LogOut, Loader2, ChevronLeft, DoorOpen } from 'lucide-react';
import type { Category, ModalState, DetailsModalState, Alternative, Product } from './types';
import { generateId } from './utils/helpers';
import { obtenerListasDeUsuario, suscribirseALista, guardarCategorias, abandonarLista, renombrarLista } from './lib/firestore';
import type { ListaDoc } from './lib/firestore';
import { useAuth } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen';
import MisListas from './components/MisListas';
import Header from './components/Header';
import CategoryCard from './components/CategoryCard';
import FormModal from './components/FormModal';
import DetailsModal from './components/DetailsModal';

export default function App() {
  const { user, loading: authLoading, logout } = useAuth();

  const [listas, setListas] = useState<ListaDoc[]>([]);
  const [listaActiva, setListaActiva] = useState<ListaDoc | null>(null);
  const [loadingListas, setLoadingListas] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [copiado, setCopiado] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const listaActivaRef = useRef<ListaDoc | null>(null);
  useEffect(() => { listaActivaRef.current = listaActiva; }, [listaActiva]);

  // Estado
  const [editandoNombre, setEditandoNombre] = useState(false);
  const [nuevoNombre, setNuevoNombre] = useState('');

  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    type: '',
    categoryId: null,
    productId: null,
    editData: null,
  });

  const [detailsModal, setDetailsModal] = useState<DetailsModalState>({
    isOpen: false,
    type: null,
  });



  // Cargar todas las listas del usuario
  useEffect(() => {
    if (!user) {
      setListas([]);
      setListaActiva(null);
      setCategories([]);
      return;
    }
    setLoadingListas(true);
    obtenerListasDeUsuario(user.uid)
      .then(ls => setListas(ls))
      .finally(() => setLoadingListas(false));
  }, [user]);

  // Suscribirse en tiempo real cuando hay lista activa
  useEffect(() => {
    if (!listaActiva) return;

    const unsub = suscribirseALista(listaActiva.id, (cats) => {
      setCategories(cats);
    });

    return () => unsub();
  }, [listaActiva]);

  const guardar = (cats: Category[]) => {
    if (listaActivaRef.current) {
      guardarCategorias(listaActivaRef.current.id, cats);
    }
  };

  // Handler
  const handleRenombrar = async () => {
    if (!listaActiva || !nuevoNombre.trim()) return;
    await renombrarLista(listaActiva.id, nuevoNombre.trim());
    setListaActiva(prev => prev ? { ...prev, nombre: nuevoNombre.trim() } : prev);
    setEditandoNombre(false);
  };

  const handleEntrarLista = (lista: ListaDoc) => {
    setListaActiva(lista);
    setCategories(lista.categorias);
  };

  const handleListaCreada = (lista: ListaDoc) => {
    setListas(prev => {
      const existe = prev.find(l => l.id === lista.id);
      if (existe) return prev;
      return [...prev, lista];
    });
    handleEntrarLista(lista);
  };

  const handleVolverAListas = () => {
    setListaActiva(null);
    setCategories([]);
    // Recargar listas por si hubo cambios
    if (user) {
      obtenerListasDeUsuario(user.uid).then(ls => setListas(ls));
    }
  };

  const handleAbandonarLista = async () => {
    if (!user || !listaActiva) return;
    if (!confirm(`¿Abandonar la lista "${listaActiva.nombre}"? Podrás volver a unirte con el código.`)) return;
    await abandonarLista(user.uid, listaActiva.id);
    setListas(prev => prev.filter(l => l.id !== listaActiva.id));
    handleVolverAListas();
  };

  // --- TOTALS ---
  const globalTotals = categories.reduce(
    (acc, cat) => {
      cat.products.forEach(p => {
        const price = Number(p.precio) || 0;
        if (p.adquirido) acc.adquiridos += price;
        else acc.pendientes += price;
        acc.total += price;
      });
      return acc;
    },
    { adquiridos: 0, pendientes: 0, total: 0 }
  );

  // --- IMPORT / EXPORT ---
  const handleExport = () => {
    const blob = new Blob([JSON.stringify(categories, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lista-hogar-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          setCategories(parsed);
          guardar(parsed);
          alert('¡Lista importada con éxito!');
        } else {
          alert('El formato del archivo no es válido.');
        }
      } catch {
        alert('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const copiarCodigo = async () => {
    if (!listaActiva) return;
    await navigator.clipboard.writeText(listaActiva.codigoInvitacion);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  };

  // --- MODAL HELPERS ---
  const openModal = (
    type: ModalState['type'],
    categoryId: string | null = null,
    productId: string | null = null,
    editData: ModalState['editData'] = null
  ) => setModalState({ isOpen: true, type, categoryId, productId, editData });

  const closeModal = () =>
    setModalState({ isOpen: false, type: '', categoryId: null, productId: null, editData: null });

  // --- CRUD HANDLERS ---
  const handleToggleProduct = (catId: string, prodId: string) => {
    setCategories(prev => {
      const updated = prev.map(cat =>
        cat.id !== catId
          ? cat
          : { ...cat, products: cat.products.map(p => p.id === prodId ? { ...p, adquirido: !p.adquirido } : p) }
      );
      guardar(updated);
      return updated;
    });
  };

  const handleDeleteCategory = (catId: string) => {
    if (confirm('¿Eliminar este ambiente y todos sus productos?')) {
      setCategories(prev => {
        const updated = prev.filter(c => c.id !== catId);
        guardar(updated);
        return updated;
      });
    }
  };

  const handleDeleteProduct = (catId: string, prodId: string) => {
    if (confirm('¿Eliminar este producto?')) {
      setCategories(prev => {
        const updated = prev.map(cat =>
          cat.id !== catId ? cat : { ...cat, products: cat.products.filter(p => p.id !== prodId) }
        );
        guardar(updated);
        return updated;
      });
    }
  };

  const handleDeleteAlternative = (catId: string, prodId: string, altId: string) => {
    if (confirm('¿Eliminar esta alternativa?')) {
      setCategories(prev => {
        const updated = prev.map(cat =>
          cat.id !== catId
            ? cat
            : {
              ...cat,
              products: cat.products.map(prod =>
                prod.id !== prodId
                  ? prod
                  : { ...prod, alternativas: prod.alternativas.filter(a => a.id !== altId) }
              ),
            }
        );
        guardar(updated);
        return updated;
      });
    }
  };

  // Swap alternativa ↔ principal
  const handleSwapAlternative = (catId: string, prodId: string, altId: string) => {
    setCategories(prev => {
      const updated = prev.map(cat => {
        if (cat.id !== catId) return cat;
        return {
          ...cat,
          products: cat.products.map(prod => {
            if (prod.id !== prodId) return prod;

            const alt = prod.alternativas.find(a => a.id === altId);
            if (!alt) return prod;

            // El producto actual baja a alternativa
            const anteriorComoAlternativa: Alternative = {
              id: generateId(),
              nombre: prod.nombre,
              tienda: prod.tienda,
              precio: prod.precio,
              link: prod.link,
              imagen: prod.imagen,
            };

            // La alternativa sube a principal
            const newProd: Product = {
              ...prod,
              nombre: alt.nombre,
              tienda: alt.tienda,
              precio: alt.precio,
              link: alt.link,
              imagen: alt.imagen,
              alternativas: [
                anteriorComoAlternativa,
                ...prod.alternativas.filter(a => a.id !== altId),
              ],
            };
            return newProd;
          }),
        };
      });
      guardar(updated);
      return updated;
    });
  };

  // --- FORM SUBMIT ---
  const handleModalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const { type, categoryId, productId, editData } = modalState;

    setCategories(prev => {
      let updated = prev;

      if (type === 'category') {
        if (editData) {
          updated = prev.map(c => c.id === (editData as Category).id ? { ...c, name: data.name } : c);
        } else {
          updated = [...prev, { id: generateId(), name: data.name, products: [] }];
        }
      } else if (type === 'product') {
        const productObj: Product = {
          id: editData ? (editData as Product).id : generateId(),
          adquirido: editData ? (editData as Product).adquirido : false,
          nombre: data.nombre,
          tienda: data.tienda ?? '',
          precio: Number(data.precio) || 0,
          link: data.link ?? '',
          imagen: data.imagen ?? '',
          alternativas: editData ? (editData as Product).alternativas : [],
        };
        updated = prev.map(cat => {
          if (cat.id !== categoryId) return cat;
          return {
            ...cat,
            products: editData
              ? cat.products.map(p => p.id === productObj.id ? productObj : p)
              : [...cat.products, productObj],
          };
        });
      } else if (type === 'alternative') {
        const altObj: Alternative = {
          id: editData ? (editData as Alternative).id : generateId(),
          nombre: data.nombre,
          tienda: data.tienda ?? '',
          precio: Number(data.precio) || 0,
          link: data.link ?? '',
          imagen: data.imagen ?? '',
        };
        updated = prev.map(cat => {
          if (cat.id !== categoryId) return cat;
          return {
            ...cat,
            products: cat.products.map(prod => {
              if (prod.id !== productId) return prod;
              return {
                ...prod,
                alternativas: editData
                  ? prod.alternativas.map(a => a.id === altObj.id ? altObj : a)
                  : [...prod.alternativas, altObj],
              };
            }),
          };
        });
      }

      guardar(updated);
      return updated;
    });

    closeModal();
  };

  // --- RENDER STATES ---
  if (authLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 size={28} className="text-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  // Sin lista activa → Mis Listas
  if (!listaActiva) {
    return (
      <MisListas
        listas={listas}
        loadingListas={loadingListas}
        onEntrar={handleEntrarLista}
        onListaCreada={handleListaCreada}
      />
    );
  }

  // Lista activa → Vista de lista
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-24">

      <Header
        totals={globalTotals}
        nombreLista={listaActiva.nombre}
        onExport={handleExport}
        onImportClick={() => fileInputRef.current?.click()}
        onShowAdquiridos={() => setDetailsModal({ isOpen: true, type: 'adquiridos' })}
        onShowPendientes={() => setDetailsModal({ isOpen: true, type: 'pendientes' })}
        onShowTotal={() => setDetailsModal({ isOpen: true, type: 'total' })}
      />

      <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />

      {/* Barra de navegación + acciones */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 pt-3 flex items-center justify-between gap-3 flex-wrap">

        {/* Izquierda: volver + nombre lista */}
        <div className="flex items-center gap-2 min-w-0">
          <button
            onClick={handleVolverAListas}
            className="flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-200 transition-colors shrink-0"
          >
            <ChevronLeft size={15} /> Mis listas
          </button>
          <span className="text-zinc-700 text-xs">/</span>
          {editandoNombre ? (
            <input
              autoFocus
              value={nuevoNombre}
              onChange={e => setNuevoNombre(e.target.value)}
              onBlur={handleRenombrar}
              onKeyDown={e => e.key === 'Enter' && handleRenombrar()}
              className="bg-zinc-800 border border-emerald-500 text-zinc-100 text-xs font-semibold rounded px-2 py-0.5 outline-none w-36"
            />
          ) : (
            <button
              onClick={() => { setNuevoNombre(listaActiva.nombre); setEditandoNombre(true); }}
              className="text-xs font-semibold text-zinc-300 hover:text-zinc-100 truncate transition-colors"
            >
              {listaActiva.nombre}
            </button>
          )}        </div>

        {/* Derecha: código + abandonar + logout */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={copiarCodigo}
            className="flex items-center gap-1.5 px-2.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-xs font-medium text-zinc-400 transition-colors active:scale-95"
          >
            {copiado ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
            <span className="font-mono font-bold text-zinc-100 tracking-widest">{listaActiva.codigoInvitacion}</span>
          </button>

          <button
            onClick={handleAbandonarLista}
            className="flex items-center gap-1 p-1.5 text-zinc-600 hover:text-amber-400 transition-colors"
            title="Abandonar lista"
          >
            <DoorOpen size={15} />
          </button>

          <button
            onClick={logout}
            className="flex items-center gap-1 p-1.5 text-zinc-600 hover:text-red-400 transition-colors"
            title="Cerrar sesión"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-3 sm:px-4 py-4 space-y-4">
        {categories.map(category => (
          <CategoryCard
            key={category.id}
            category={category}
            onEditCategory={() => openModal('category', category.id, null, category)}
            onDeleteCategory={() => handleDeleteCategory(category.id)}
            onToggleProduct={(prodId) => handleToggleProduct(category.id, prodId)}
            onEditProduct={(prodId) => {
              const prod = category.products.find(p => p.id === prodId);
              if (prod) openModal('product', category.id, prodId, prod);
            }}
            onDeleteProduct={(prodId) => handleDeleteProduct(category.id, prodId)}
            onAddProduct={() => openModal('product', category.id)}
            onAddAlternative={(prodId) => openModal('alternative', category.id, prodId)}
            onEditAlternative={(prodId, alt) => openModal('alternative', category.id, prodId, alt)}
            onDeleteAlternative={(prodId, altId) => handleDeleteAlternative(category.id, prodId, altId)}
            onSwapAlternative={(prodId, altId) => handleSwapAlternative(category.id, prodId, altId)}
          />
        ))}

        <button
          onClick={() => openModal('category')}
          className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-xl border border-dashed border-zinc-700 hover:border-emerald-600 transition-all flex items-center justify-center gap-2 text-sm font-semibold active:scale-95"
        >
          <Plus size={18} /> Nueva Categoría
        </button>
      </main>

      <FormModal modalState={modalState} onClose={closeModal} onSubmit={handleModalSubmit} />
      <DetailsModal
        isOpen={detailsModal.isOpen}
        type={detailsModal.type}
        categories={categories}
        onClose={() => setDetailsModal({ isOpen: false, type: null })}
      />
    </div>
  );
}