import { useState, useEffect, useRef } from 'react';
import { Plus, Copy, Check, LogOut, Loader2 } from 'lucide-react';
import type { Category, ModalState, DetailsModalState, Alternative, Product } from './types';
import { generateId } from './utils/helpers';
import { obtenerListaDeUsuario, suscribirseALista, guardarCategorias } from './lib/firestore';
import type { ListaDoc } from './lib/firestore';
import { useAuth } from './contexts/AuthContext';
import LoginScreen from './components/LoginScreen';
import ListSetup from './components/ListSetup';
import Header from './components/Header';
import CategoryCard from './components/CategoryCard';
import FormModal from './components/FormModal';
import DetailsModal from './components/DetailsModal';

export default function App() {
  const { user, loading: authLoading, logout } = useAuth();

  const [lista, setLista] = useState<ListaDoc | null>(null);
  const [listaLoading, setListaLoading] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [copiado, setCopiado] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  // Ref para tener siempre el listaId actualizado dentro de los handlers
  const listaRef = useRef<ListaDoc | null>(null);
  useEffect(() => { listaRef.current = lista; }, [lista]);

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

  // Cargar lista y suscribirse a cambios en tiempo real
  useEffect(() => {
    if (!user) {
      setLista(null);
      setCategories([]);
      return;
    }

    setListaLoading(true);
    let unsub: (() => void) | null = null;

    obtenerListaDeUsuario(user.uid).then(l => {
      if (!l) {
        setListaLoading(false);
        return;
      }
      setLista(l);

      unsub = suscribirseALista(l.id, (cats) => {
        setCategories(cats);
        setListaLoading(false);
      });
    });

    return () => unsub?.();
  }, [user]);

  // Helper: guarda en Firestore usando siempre el listaId más reciente
  const guardar = (cats: Category[]) => {
    if (listaRef.current) {
      guardarCategorias(listaRef.current.id, cats);
    }
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

  // --- COPIAR CÓDIGO ---
  const copiarCodigo = async () => {
    if (!lista) return;
    await navigator.clipboard.writeText(lista.codigoInvitacion);
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

  // --- CRUD HANDLERS — todos guardan en Firestore ---

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

  if (listaLoading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center gap-3">
        <Loader2 size={28} className="text-emerald-500 animate-spin" />
        <p className="text-zinc-500 text-sm">Cargando tu lista...</p>
      </div>
    );
  }

  if (!lista) {
    return <ListSetup onListaLista={(l) => { setLista(l); setCategories(l.categorias); }} />;
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-24">

      <Header
        totals={globalTotals}
        onExport={handleExport}
        onImportClick={() => fileInputRef.current?.click()}
        onShowAdquiridos={() => setDetailsModal({ isOpen: true, type: 'adquiridos' })}
        onShowPendientes={() => setDetailsModal({ isOpen: true, type: 'pendientes' })}
        onShowTotal={() => setDetailsModal({ isOpen: true, type: 'total' })}
      />

      <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />

      {/* Barra de código + logout */}
      <div className="max-w-5xl mx-auto px-3 sm:px-4 pt-3 flex items-center justify-between gap-3">
        <button
          onClick={copiarCodigo}
          className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-xs font-medium text-zinc-400 transition-colors active:scale-95"
        >
          {copiado
            ? <Check size={13} className="text-emerald-400" />
            : <Copy size={13} />
          }
          Invitar:&nbsp;
          <span className="font-mono font-bold text-zinc-100 tracking-widest">
            {lista.codigoInvitacion}
          </span>
        </button>

        <button
          onClick={logout}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-zinc-600 hover:text-red-400 transition-colors"
        >
          <LogOut size={13} /> Salir
        </button>
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
          />
        ))}

        <button
          onClick={() => openModal('category')}
          className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-xl border border-dashed border-zinc-700 hover:border-emerald-600 transition-all flex items-center justify-center gap-2 text-sm font-semibold active:scale-95"
        >
          <Plus size={18} /> Agregar Nuevo Ambiente
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