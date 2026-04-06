export interface MedioDePago {
  id: string;
  nombre: string;
  color: string; // tailwind bg color class ej: 'bg-blue-500'
}

export interface Alternative {
  id: string;
  nombre: string;
  tienda: string;
  precio: number;
  link: string;
  imagen: string;
}

export interface Product {
  id: string;
  adquirido: boolean;
  nombre: string;
  tienda: string;
  precio: number;
  link: string;
  imagen: string;
  alternativas: Alternative[];
  medioDePagoId?: string | null;
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

export interface Totals {
  adquiridos: number;
  pendientes: number;
  total: number;
}

export type ModalType = 'category' | 'product' | 'alternative' | '';
export type DetailsType = 'adquiridos' | 'pendientes' | 'total' | null;

export interface ModalState {
  isOpen: boolean;
  type: ModalType;
  categoryId: string | null;
  productId: string | null;
  editData: Category | Product | Alternative | null;
}

export interface DetailsModalState {
  isOpen: boolean;
  type: DetailsType;
}