import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  onSnapshot,
  arrayUnion,
  arrayRemove,
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

const generarCodigo = (): string =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

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
  await setDoc(doc(db, 'invitaciones', codigo), { listaId });
  // Guardar en array de listas del usuario
  await setDoc(doc(db, 'usuarios', uid), { listaIds: arrayUnion(listaId) }, { merge: true });

  return { id: listaId, ...lista };
};

// Unirse con código
export const unirseALista = async (
  uid: string,
  codigo: string
): Promise<ListaDoc | null> => {
  const codigoUpper = codigo.toUpperCase().trim();
  const invSnap = await getDoc(doc(db, 'invitaciones', codigoUpper));
  if (!invSnap.exists()) return null;

  const { listaId } = invSnap.data() as { listaId: string };
  const listaSnap = await getDoc(doc(db, 'listas', listaId));
  if (!listaSnap.exists()) return null;

  const listaData = listaSnap.data() as Omit<ListaDoc, 'id'>;

  if (!listaData.colaboradores.includes(uid)) {
    await updateDoc(doc(db, 'listas', listaId), {
      colaboradores: arrayUnion(uid),
    });
  }

  await setDoc(doc(db, 'usuarios', uid), { listaIds: arrayUnion(listaId) }, { merge: true });

  return { id: listaId, ...listaData };
};

// Obtener todas las listas del usuario
export const obtenerListasDeUsuario = async (uid: string): Promise<ListaDoc[]> => {
  const usuarioSnap = await getDoc(doc(db, 'usuarios', uid));
  if (!usuarioSnap.exists()) return [];

  const data = usuarioSnap.data() as { listaIds?: string[]; listaId?: string };

  // Compatibilidad con el modelo anterior (listaId singular)
  const ids = data.listaIds ?? (data.listaId ? [data.listaId] : []);
  if (ids.length === 0) return [];

  const listas = await Promise.all(
    ids.map(async (id) => {
      const snap = await getDoc(doc(db, 'listas', id));
      if (!snap.exists()) return null;
      return { id, ...snap.data() } as ListaDoc;
    })
  );

  return listas.filter(Boolean) as ListaDoc[];
};

// Abandonar una lista
export const abandonarLista = async (uid: string, listaId: string): Promise<void> => {
  // Quitar de las listas del usuario
  await updateDoc(doc(db, 'usuarios', uid), {
    listaIds: arrayRemove(listaId),
  });
  // Quitar de colaboradores de la lista
  await updateDoc(doc(db, 'listas', listaId), {
    colaboradores: arrayRemove(uid),
  });
};

// Suscribirse a cambios en tiempo real
export const suscribirseALista = (
  listaId: string,
  onUpdate: (categorias: Category[]) => void
): (() => void) => {
  return onSnapshot(doc(db, 'listas', listaId), (snap) => {
    if (snap.exists()) {
      const data = snap.data() as Omit<ListaDoc, 'id'>;
      onUpdate(data.categorias);
    }
  });
};

// Guardar categorías
export const guardarCategorias = async (
  listaId: string,
  categorias: Category[]
): Promise<void> => {
  await updateDoc(doc(db, 'listas', listaId), {
    categorias,
    updatedAt: serverTimestamp(),
  });
};

export const renombrarLista = async (listaId: string, nombre: string): Promise<void> => {
  await updateDoc(doc(db, 'listas', listaId), { nombre });
};