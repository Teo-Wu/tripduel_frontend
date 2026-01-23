// services/property/imageService.js

// Upload an image
export async function uploadImage({ property, category, file }) {
  const formData = new FormData();
  formData.append("property", property);
  formData.append("category", category);
  formData.append("file", file);

  const res = await fetch(`https://gruppe8.sccprak.netd.cs.tu-dresden.de/images`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload image");
  return res.json(); // returns { id, property, category }
}

// List all images for a trip
export async function listImages(tripId) {
  const res = await fetch(`https://gruppe8.sccprak.netd.cs.tu-dresden.de/images?trip=${tripId}`);
  if (!res.ok) throw new Error("Failed to fetch images");
  return res.json(); // returns array of { id, property, category }
}

// Delete image by id
export async function deleteImage(id) {
  const res = await fetch(`https://gruppe8.sccprak.netd.cs.tu-dresden.de/images/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete image");
  return true;
}
