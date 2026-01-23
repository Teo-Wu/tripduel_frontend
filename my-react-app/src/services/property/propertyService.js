// services/property/propertyService.js

export async function listProperties(tripId) {
  const res = await fetch(`https://gruppe8.sccprak.netd.cs.tu-dresden.de/properties?trip=${tripId}`);
  if (!res.ok) throw new Error("Failed to fetch properties");
  return res.json();
}

export async function createProperty({ trip, name }) {
  const res = await fetch(`https://gruppe8.sccprak.netd.cs.tu-dresden.de/properties`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trip, name }),
  });
  if (!res.ok) throw new Error("Failed to create property");
  return res.json();
}

export async function updateProperty(id, { name }) {
  const res = await fetch(`https://gruppe8.sccprak.netd.cs.tu-dresden.de/properties/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to update property");
  return res.json();
}

export async function deleteProperty(id) {
  const res = await fetch(`https://gruppe8.sccprak.netd.cs.tu-dresden.de/properties/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete property");
  return true;
}

// Get a property by ID
export async function getPropertyById(id) {
  const res = await fetch(`https://gruppe8.sccprak.netd.cs.tu-dresden.de/properties/${id}`);
  if (!res.ok) throw new Error("Failed to fetch property");
  return res.json(); // returns { id, trip, name }
}