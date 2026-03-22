import type { Category } from '../types';

export const INITIAL_DATA: Category[] = [
  {
    id: 'c1',
    name: '🛋️ Living / Comedor',
    products: [
      { id: 'p1_1', adquirido: false, nombre: 'Sofá', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p1_2', adquirido: true, nombre: 'Mesa de comedor', tienda: 'Sodimac', precio: 150000, link: '', imagen: '', alternativas: [] },
    ]
  },
  {
    id: 'c2',
    name: '🛏️ Dormitorio',
    products: [
      { id: 'p2_1', adquirido: false, nombre: 'Cama 2 plazas', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p2_2', adquirido: false, nombre: 'Velador', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
    ]
  },
  {
    id: 'c3',
    name: '🍳 Cocina',
    products: [
      { id: 'p3_1', adquirido: false, nombre: 'Refrigerador', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p3_2', adquirido: true, nombre: 'Hervidor eléctrico', tienda: 'Ripley', precio: 25000, link: '', imagen: '', alternativas: [] },
    ]
  },
];