import { mockDb } from "./mockDb";

export async function listProperties(tripId) {
  return mockDb.properties.filter(p => p.trip === tripId);
}

export async function createProperty({ trip, name }) {
  const property = {
    id: crypto.randomUUID(),
    trip,
    name,
  };
  mockDb.properties.push(property);
  return property;
}

export async function updateProperty(id, { name }) {
  const property = mockDb.properties.find(p => p.id === id);
  if (!property) throw "Property not found";
  property.name = name;
  return property;
}

export async function deleteProperty(id) {
  mockDb.properties = mockDb.properties.filter(p => p.id !== id);
}
