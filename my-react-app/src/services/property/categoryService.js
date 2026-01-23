// services/property/categoryService.js

export async function listCategories(tripId) {
  const res = await fetch(`https://gruppe8.sccprak.netd.cs.tu-dresden.de/categories?trip=${tripId}`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

export async function createCategory({ trip, name }) {
  const res = await fetch(`https://gruppe8.sccprak.netd.cs.tu-dresden.de/categories`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trip, name }),
  });
  if (!res.ok) throw new Error("Failed to create category");
  return res.json();
}

export async function updateCategory(id, { name }) {
  const res = await fetch(`https://gruppe8.sccprak.netd.cs.tu-dresden.de/categories/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to update category");
  return res.json();
}

export async function deleteCategory(id) {
  const res = await fetch(`https://gruppe8.sccprak.netd.cs.tu-dresden.de/categories/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete category");
  return true;
}
