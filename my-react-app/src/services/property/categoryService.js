import { mockDb } from "./mockDb";

export async function listCategories(tripId) {
  return mockDb.categories.filter(c => c.trip === tripId);
}

export async function createCategory({ trip, name }) {
  const category = {
    id: crypto.randomUUID(),
    trip,
    name,
  };
  mockDb.categories.push(category);
  return category;
}

export async function updateCategory(id, { name }) {
  const category = mockDb.categories.find(c => c.id === id);
  if (!category) throw "Category not found";
  category.name = name;
  return category;
}

export async function deleteCategory(id) {
  mockDb.categories = mockDb.categories.filter(c => c.id !== id);
}
