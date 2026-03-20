import { useState, useEffect, useRef } from 'react';
import { Plus } from 'lucide-react';
import type { Category, ModalState, DetailsModalState, Alternative, Product } from './types';
import { INITIAL_DATA } from './data/initialData';
import { generateId } from './utils/helpers';
import Header from './components/Header';
import CategoryCard from './components/CategoryCard';
import FormModal from './components/FormModal';
import DetailsModal from './components/DetailsModal';

export default function App() {
  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem('listaHogarData');
    return saved ? JSON.parse(saved) : INITIAL_DATA;
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    localStorage.setItem('listaHogarData', JSON.stringify(categories));
  }, [categories]);

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
    setCategories(prev =>
      prev.map(cat =>
        cat.id !== catId
          ? cat
          : { ...cat, products: cat.products.map(p => p.id === prodId ? { ...p, adquirido: !p.adquirido } : p) }
      )
    );
  };

  const handleDeleteCategory = (catId: string) => {
    if (confirm('¿Eliminar este ambiente y todos sus productos?')) {
      setCategories(prev => prev.filter(c => c.id !== catId));
    }
  };

  const handleDeleteProduct = (catId: string, prodId: string) => {
    if (confirm('¿Eliminar este producto?')) {
      setCategories(prev =>
        prev.map(cat =>
          cat.id !== catId ? cat : { ...cat, products: cat.products.filter(p => p.id !== prodId) }
        )
      );
    }
  };

  const handleDeleteAlternative = (catId: string, prodId: string, altId: string) => {
    if (confirm('¿Eliminar esta alternativa?')) {
      setCategories(prev =>
        prev.map(cat =>
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
        )
      );
    }
  };

  // --- FORM SUBMIT ---
  const handleModalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const { type, categoryId, productId, editData } = modalState;

    if (type === 'category') {
      if (editData) {
        setCategories(prev => prev.map(c => c.id === (editData as Category).id ? { ...c, name: data.name } : c));
      } else {
        setCategories(prev => [...prev, { id: generateId(), name: data.name, products: [] }]);
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
      setCategories(prev =>
        prev.map(cat => {
          if (cat.id !== categoryId) return cat;
          return {
            ...cat,
            products: editData
              ? cat.products.map(p => p.id === productObj.id ? productObj : p)
              : [...cat.products, productObj],
          };
        })
      );
    } else if (type === 'alternative') {
      const altObj: Alternative = {
        id: editData ? (editData as Alternative).id : generateId(),
        nombre: data.nombre,
        tienda: data.tienda ?? '',
        precio: Number(data.precio) || 0,
        link: data.link ?? '',
        imagen: data.imagen ?? '',
      };
      setCategories(prev =>
        prev.map(cat => {
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
        })
      );
    }

    closeModal();
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans pb-20">

      <Header
        totals={globalTotals}
        onExport={handleExport}
        onImportClick={() => fileInputRef.current?.click()}
        onShowAdquiridos={() => setDetailsModal({ isOpen: true, type: 'adquiridos' })}
        onShowPendientes={() => setDetailsModal({ isOpen: true, type: 'pendientes' })}
        onShowTotal={() => setDetailsModal({ isOpen: true, type: 'total' })}
      />

      <input type="file" ref={fileInputRef} onChange={handleImport} className="hidden" accept=".json" />

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
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
          className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 rounded-xl border border-dashed border-zinc-700 hover:border-emerald-600 transition-all flex items-center justify-center gap-2 text-sm font-semibold"
        >
          <Plus size={18} /> Agregar Nuevo Ambiente
        </button>
      </main>

      <FormModal
        modalState={modalState}
        onClose={closeModal}
        onSubmit={handleModalSubmit}
      />

      <DetailsModal
        isOpen={detailsModal.isOpen}
        type={detailsModal.type}
        categories={categories}
        onClose={() => setDetailsModal({ isOpen: false, type: null })}
      />
    </div>
  );
}