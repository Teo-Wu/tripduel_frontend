import { mockDb } from "./mockDb";

export async function uploadImage({ property, category, file }) {
  const image = {
    id: crypto.randomUUID(),
    property,
    category,
    url: URL.createObjectURL(file),
  };

  mockDb.images = mockDb.images.filter(
    img => img.property !== property || img.category !== category
  );

  mockDb.images.push(image);
  return image;
}

export async function getImage(property, category) {
  const image = mockDb.images.find(
    img => img.property === property && img.category === category
  );

  if (!image) throw "Image not found";
  return image;
}
