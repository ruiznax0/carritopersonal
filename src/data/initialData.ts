import type { Category } from '../types';

export const INITIAL_DATA: Category[] = [
  {
    id: 'c1', name: '🛏️ Dormitorio Principal (Pareja)',
    products: [
      { id: 'p1_1', adquirido: false, nombre: 'Combo Cama 2 Plazas (Base + Colchón + Respaldo + 2 Veladores)', tienda: 'Hites', precio: 260000, link: '', imagen: '', alternativas: [] },
      { id: 'p1_2', adquirido: false, nombre: 'Armario o Clóset', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p1_3', adquirido: false, nombre: 'Cómoda', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p1_4', adquirido: false, nombre: 'Juego de sábanas', tienda: 'Hites', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p1_5', adquirido: false, nombre: 'Protector de colchón', tienda: 'Hites', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p1_6', adquirido: false, nombre: 'Plumón', tienda: 'Hites', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p1_7', adquirido: false, nombre: 'Almohadas (2 unidades)', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p1_8', adquirido: false, nombre: 'Lámparas de velador (2 unidades)', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p1_9', adquirido: false, nombre: 'Alfombras de pie de cama (2 unidades)', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p1_10', adquirido: false, nombre: 'Colgadores de ropa (Perchas)', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p1_11', adquirido: false, nombre: 'Espejo de cuerpo completo', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
    ]
  },
  {
    id: 'c2', name: '👧 Dormitorio Hija',
    products: [
      { id: 'p2_1', adquirido: false, nombre: 'Combo Cama 1.5 Plazas (Base + Colchón + Respaldo)', tienda: 'Hites', precio: 170000, link: '', imagen: '', alternativas: [] },
      { id: 'p2_2', adquirido: false, nombre: 'Armario o Clóset', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p2_3', adquirido: false, nombre: 'Estantes o Repisas', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p2_4', adquirido: false, nombre: 'Juego de sábanas', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p2_5', adquirido: false, nombre: 'Cubre colchón', tienda: 'Hites', precio: 8000, link: '', imagen: '', alternativas: [] },
      { id: 'p2_6', adquirido: false, nombre: 'Plumón 1.5', tienda: 'Hites', precio: 40000, link: '', imagen: '', alternativas: [] },
      { id: 'p2_7', adquirido: false, nombre: 'Almohada', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p2_8', adquirido: false, nombre: 'Escritorio pequeño', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p2_9', adquirido: false, nombre: 'Lámpara de estudio', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p2_10', adquirido: false, nombre: 'Caja organizadora bajo cama', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
    ]
  },
  {
    id: 'c3', name: '🔥 Calefacción y Climatización',
    products: [
      { id: 'p3_1', adquirido: false, nombre: 'Estufa a Pellet', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p3_2', adquirido: false, nombre: 'Kit de cañones (Instalación)', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p3_3', adquirido: false, nombre: 'Instalación Certificada', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p3_4', adquirido: false, nombre: 'Aspiradora de cenizas', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p3_5', adquirido: false, nombre: 'Pellet (Carga inicial - 10 sacos)', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
    ]
  },
  {
    id: 'c4', name: '🍳 Cocina (Línea Blanca y Electro)',
    products: [
      { id: 'p4_1', adquirido: false, nombre: 'Refrigerador Midea (4 puertas)', tienda: 'Dimarsa/Líder', precio: 550000, link: '', imagen: '', alternativas: [] },
      { id: 'p4_2', adquirido: false, nombre: 'Estufa a gas Samsung (con plancha)', tienda: 'Ripley', precio: 300000, link: '', imagen: '', alternativas: [] },
      { id: 'p4_3', adquirido: false, nombre: 'Cilindro de Gas', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p4_4', adquirido: false, nombre: 'Flexible de gas (Certificado)', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p4_5', adquirido: false, nombre: 'Regulador de gas', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p4_6', adquirido: false, nombre: 'Microondas', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p4_7', adquirido: false, nombre: 'Basurero de cocina (grande)', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p4_8', adquirido: false, nombre: 'Tostador de pan (malla)', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p4_9', adquirido: false, nombre: 'Licuadora', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p4_10', adquirido: false, nombre: 'Organizador de cubiertos', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p4_11', adquirido: false, nombre: 'Porta papel absorbente (Nova)', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p4_12', adquirido: true, nombre: 'Hervidor eléctrico', tienda: 'Ya tenemos', precio: 0, link: '', imagen: '', alternativas: [] },
    ]
  },
  {
    id: 'c5', name: '🍽️ Menaje y Utensilios',
    products: [
      { id: 'p5_1', adquirido: true, nombre: '2 Juegos de vajillas', tienda: 'Comprado', precio: 36990, link: '', imagen: '', alternativas: [] },
      { id: 'p5_2', adquirido: true, nombre: 'Set de cubiertos', tienda: 'Comprado', precio: 9990, link: '', imagen: '', alternativas: [] },
      { id: 'p5_3', adquirido: true, nombre: 'Set de ollas', tienda: 'Comprado', precio: 39990, link: '', imagen: '', alternativas: [] },
      { id: 'p5_4', adquirido: false, nombre: '2 Juegos de vasos', tienda: 'Dimarsa', precio: 14000, link: '', imagen: '', alternativas: [] },
      { id: 'p5_5', adquirido: false, nombre: 'Cucharas de madera', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p5_6', adquirido: false, nombre: 'Espátulas de cocina', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p5_7', adquirido: false, nombre: 'Pelador de papas', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p5_8', adquirido: false, nombre: 'Rallador', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p5_9', adquirido: false, nombre: 'Abrelatas', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p5_10', adquirido: false, nombre: 'Sacacorchos', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p5_11', adquirido: false, nombre: 'Colador', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p5_12', adquirido: false, nombre: 'Embudo', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p5_13', adquirido: false, nombre: 'Tabla para picar', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p5_14', adquirido: false, nombre: 'Escurridor de platos', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p5_15', adquirido: false, nombre: 'Set de cuchillos de cocina', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p5_16', adquirido: false, nombre: 'Paños de cocina', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
    ]
  },
  {
    id: 'c6', name: '🧺 Logia y Aseo',
    products: [
      { id: 'p6_1', adquirido: false, nombre: 'Lavadora Midea', tienda: 'La Polar', precio: 310000, link: '', imagen: '', alternativas: [] },
      { id: 'p6_2', adquirido: false, nombre: 'Tendedero de ropa plegable', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p6_3', adquirido: false, nombre: 'Canasto para ropa sucia', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p6_4', adquirido: false, nombre: 'Escoba, Pala, Mopa, Balde', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p6_5', adquirido: false, nombre: 'Artículos de limpieza (Guantes, bolsas, desinfectante, lavaloza)', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
    ]
  },
  {
    id: 'c7', name: '🛋️ Living / Comedor',
    products: [
      { id: 'p7_1', adquirido: false, nombre: 'Sillón', tienda: 'Hites', precio: 449000, link: '', imagen: '', alternativas: [] },
      {
        id: 'p7_2', adquirido: false, nombre: 'Juego de comedor (4 sillas)', tienda: 'Ripley', precio: 470000, link: '', imagen: '', alternativas: [
          { id: 'a7_2_1', nombre: 'Mesa comedor blanca', tienda: 'Sodimac Alerce', precio: 280000, link: '', imagen: '' }
        ]
      },
      { id: 'p7_3', adquirido: false, nombre: 'Mesa de centro', tienda: 'Sodimac Alerce', precio: 79990, link: '', imagen: '', alternativas: [] },
      { id: 'p7_4', adquirido: false, nombre: 'Rack para TV', tienda: 'Hites', precio: 80000, link: '', imagen: '', alternativas: [] },
      { id: 'p7_5', adquirido: false, nombre: 'Televisor (TV)', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p7_6', adquirido: false, nombre: 'Estantes o repisas', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p7_7', adquirido: false, nombre: 'Individuales (set de 4)', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p7_8', adquirido: false, nombre: 'Limpiapiés (Entrada)', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p7_9', adquirido: false, nombre: 'Alargadores con interruptor (3 unidades)', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
    ]
  },
  {
    id: 'c8', name: '🚿 Baño',
    products: [
      { id: 'p8_1', adquirido: false, nombre: 'Espejo de baño', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p8_2', adquirido: false, nombre: 'Basurero pequeño', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p8_3', adquirido: false, nombre: 'Cortina de baño y ganchos', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p8_4', adquirido: false, nombre: 'Alfombra antideslizante', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p8_5', adquirido: false, nombre: 'Juego de Toallas', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
    ]
  },
  {
    id: 'c9', name: '🛠️ Herramientas y Seguridad',
    products: [
      { id: 'p9_1', adquirido: false, nombre: 'Set de Herramientas (Martillo, destornilladores, huincha)', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p9_2', adquirido: false, nombre: 'Cerradura nueva (Puerta)', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p9_3', adquirido: false, nombre: 'Botiquín de primeros auxilios', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
      { id: 'p9_4', adquirido: false, nombre: 'Ampolletas LED repuesto', tienda: '', precio: 0, link: '', imagen: '', alternativas: [] },
    ]
  }
];