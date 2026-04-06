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
import type { Category, MedioDePago } from '../types';

export interface ListaDoc {
  id: string;
  nombre: string;
  ownerUid: string;
  colaboradores: string[];
  codigoInvitacion: string;
  categorias: Category[];
  mediosDePago: MedioDePago[];
  updatedAt: unknown;
}

const generarCodigo = (): string =>
  Math.random().toString(36).substring(2, 8).toUpperCase();

const generarListaId = (): string =>
  Math.random().toString(36).substring(2, 11);

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
    mediosDePago: [],
    updatedAt: serverTimestamp(),
  };

  await setDoc(doc(db, 'listas', listaId), lista);
  await setDoc(doc(db, 'invitaciones', codigo), { listaId });
  await setDoc(doc(db, 'usuarios', uid), { listaIds: arrayUnion(listaId) }, { merge: true });

  return { id: listaId, ...lista };
};

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

export const obtenerListasDeUsuario = async (uid: string): Promise<ListaDoc[]> => {
  const usuarioSnap = await getDoc(doc(db, 'usuarios', uid));
  if (!usuarioSnap.exists()) return [];

  const data = usuarioSnap.data() as { listaIds?: string[]; listaId?: string };
  const ids = data.listaIds ?? (data.listaId ? [data.listaId] : []);
  if (ids.length === 0) return [];

  const listas = await Promise.all(
    ids.map(async (id) => {
      const snap = await getDoc(doc(db, 'listas', id));
      if (!snap.exists()) return null;
      const d = snap.data() as Omit<ListaDoc, 'id'>;
      // Compatibilidad: listas antiguas sin mediosDePago
      return { id, ...d, mediosDePago: d.mediosDePago ?? [] } as ListaDoc;
    })
  );

  return listas.filter(Boolean) as ListaDoc[];
};

export const abandonarLista = async (uid: string, listaId: string): Promise<void> => {
  await updateDoc(doc(db, 'usuarios', uid), { listaIds: arrayRemove(listaId) });
  await updateDoc(doc(db, 'listas', listaId), { colaboradores: arrayRemove(uid) });
};

export const renombrarLista = async (listaId: string, nombre: string): Promise<void> => {
  await updateDoc(doc(db, 'listas', listaId), { nombre });
};

export const suscribirseALista = (
  listaId: string,
  onUpdate: (data: Pick<ListaDoc, 'categorias' | 'mediosDePago'>) => void
): (() => void) => {
  return onSnapshot(doc(db, 'listas', listaId), (snap) => {
    if (snap.exists()) {
      const data = snap.data() as Omit<ListaDoc, 'id'>;
      onUpdate({
        categorias: data.categorias,
        mediosDePago: data.mediosDePago ?? [],
      });
    }
  });
};

export const guardarCategorias = async (
  listaId: string,
  categorias: Category[]
): Promise<void> => {
  await updateDoc(doc(db, 'listas', listaId), {
    categorias,
    updatedAt: serverTimestamp(),
  });
};

export const guardarMediosDePago = async (
  listaId: string,
  mediosDePago: MedioDePago[]
): Promise<void> => {
  await updateDoc(doc(db, 'listas', listaId), { mediosDePago });
};