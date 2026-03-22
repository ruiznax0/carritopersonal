import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Category } from '../types';

export interface ListaDoc {
  id: string;
  nombre: string;
  ownerUid: string;
  colaboradores: string[];
  codigoInvitacion: string;
  categorias: Category[];
  updatedAt: unknown;
}

// Genera código alfanumérico de 6 caracteres
const generarCodigo = (): string =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

// Genera un ID único para la lista
const generarListaId = (): string =>
  Math.random().toString(36).substring(2, 11);

// Crear una lista nueva
export const crearLista = async (
  uid: string,
  nombre: string,
  categorias: Category[]
): Promise<ListaDoc> => {
  const listaId = generarListaId();
  const codigo = generarCodigo();

  const lista: Omit<ListaDoc, 'id'> = {
    nombre,
    ownerUid: uid,
    colaboradores: [uid],
    codigoInvitacion: codigo,
    categorias,
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'listas', listaId), lista);

  // Guardar el código como índice para búsqueda rápida
  await setDoc(doc(db, 'invitaciones', codigo), { listaId });

  // Guardar referencia en el perfil del usuario
  await setDoc(doc(db, 'usuarios', uid), { listaId }, { merge: true });

  return { id: listaId, ...lista };
};

// Unirse a lista con código
export const unirseALista = async (
  uid: string,
  codigo: string
): Promise<ListaDoc | null> => {
  const codigoUpper = codigo.toUpperCase().trim();
  const invRef = doc(db, 'invitaciones', codigoUpper);
  const invSnap = await getDoc(invRef);

  if (!invSnap.exists()) return null;

  const { listaId } = invSnap.data() as { listaId: string };
  const listaRef = doc(db, 'listas', listaId);
  const listaSnap = await getDoc(listaRef);

  if (!listaSnap.exists()) return null;

  const listaData = listaSnap.data() as Omit<ListaDoc, 'id'>;

  // Agregar uid a colaboradores si no está ya
  if (!listaData.colaboradores.includes(uid)) {
    await updateDoc(listaRef, {
      colaboradores: [...listaData.colaboradores, uid],
    });
  }

  // Guardar referencia en perfil del usuario
  await setDoc(doc(db, 'usuarios', uid), { listaId }, { merge: true });

  return { id: listaId, ...listaData };
};

// Obtener la lista del usuario (si ya tiene una asignada)
export const obtenerListaDeUsuario = async (
  uid: string
): Promise<ListaDoc | null> => {
  const usuarioSnap = await getDoc(doc(db, 'usuarios', uid));
  if (!usuarioSnap.exists()) return null;

  const { listaId } = usuarioSnap.data() as { listaId?: string };
  if (!listaId) return null;

  const listaSnap = await getDoc(doc(db, 'listas', listaId));
  if (!listaSnap.exists()) return null;

  const data = listaSnap.data() as Omit<ListaDoc, 'id'>;

  // Verificar que el uid sigue siendo colaborador
  if (!data.colaboradores.includes(uid)) return null;

  return { id: listaId, ...data };
};

// Guardar categorías actualizadas
export const guardarCategorias = async (
  listaId: string,
  categorias: Category[]
): Promise<void> => {
  await updateDoc(doc(db, 'listas', listaId), {
    categorias,
    updatedAt: serverTimestamp(),
  });
};