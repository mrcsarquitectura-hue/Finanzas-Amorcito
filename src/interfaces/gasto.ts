export type CategoriaGasto = 
  | 'Alimentación'
  | 'Servicios'
  | 'Alquiler'
  | 'Transporte'
  | 'Salud'
  | 'Ocio'
  | 'Otros';

export type MetodoPago = 
  | 'Yape'
  | 'Plin'
  | 'Efectivo'
  | 'Tarjeta Débito'
  | 'Tarjeta Crédito';

export type Gasto = {
  id: string;
  fecha: string;
  descripcion: string;
  monto: number;
  categoria: CategoriaGasto | string;
  pagado_por: string;
  metodo_pago: MetodoPago | string;
  es_personal: boolean;
  created_at?: string;
};