// src/controllers/categories.ts
import { Request, Response } from 'express';
import { db } from '../db/connection';
import { categories } from '../db/schema';
import { eq } from 'drizzle-orm';

// Obtener todas las categorías
export const getAllCategories = async (req: Request, res: Response) => {
  try {
    const allCategories = await db.select().from(categories);
    res.json(allCategories);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las categorías' });
  }
};

// Crear una nueva categoría
export const createCategory = async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const result = await db.insert(categories).values({ name });
    res.status(201).json({ message: 'Categoría creada', result });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la categoría' });
  }
};

// Actualizar una categoría
export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try {
    await db.update(categories)
      .set({ name })
      .where(eq(categories.id, Number(id)));
    res.json({ message: 'Categoría actualizada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la categoría' });
  }
};

// Eliminar una categoría
export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await db.delete(categories)
      .where(eq(categories.id, Number(id)));
    res.json({ message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la categoría' });
  }
};