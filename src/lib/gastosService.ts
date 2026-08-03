import { supabase } from './supabase';
import type { Gasto } from '../interfaces/gasto';

// Obtener todos los gastos ordenados por fecha
export async function obtenerGastos(): Promise<Gasto[]> {
  const { data, error } = await supabase
    .from('gastos')
    .select('*')
    .order('fecha', { ascending: false });

  if (error) {
    console.error('Error al obtener gastos:', error.message);
    return [];
  }

  return data || [];
}

// Crear un nuevo gasto
export async function crearGasto(nuevoGasto: Omit<Gasto, 'id' | 'created_at'>): Promise<Gasto | null> {
  const { data, error } = await supabase
    .from('gastos')
    .insert([nuevoGasto])
    .select()
    .single();

  if (error) {
    console.error('Error al crear gasto:', error.message);
    return null;
  }

  return data;
}

// Actualizar un gasto existente
export async function actualizarGasto(id: string, gastoActualizado: Partial<Gasto>) {
  const { data, error } = await supabase
    .from('gastos')
    .update(gastoActualizado)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Error al actualizar el gasto:', error.message);
    throw error;
  }
  return data;
}

// Eliminar un gasto por su ID
export async function eliminarGasto(id: string) {
  const { error } = await supabase
    .from('gastos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error al eliminar el gasto:', error.message);
    throw error;
  }
}