export const formatMoney = (amount: number): string => {
  return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(amount || 0);
};

export const generateId = (): string => Math.random().toString(36).substr(2, 9);