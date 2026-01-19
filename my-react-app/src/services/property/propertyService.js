// services/property/propertyService.js

export async function listProperties(tripId) {
  const res = await fetch(`/api/properties?trip=${tripId}`);
  if (!res.ok) throw new Error("Failed to fetch properties");
  return res.json();
}

export async function createProperty({ trip, name }) {
  const res = await fetch(`/api/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trip, name }),
  });
  if (!res.ok) throw new Error("Failed to create property");
  return res.json();
}

export async function updateProperty(id, { name }) {
  const res = await fetch(`/api/properties/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to update property");
  return res.json();
}

export async function deleteProperty(id) {
  const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete property");
  return true;
}
