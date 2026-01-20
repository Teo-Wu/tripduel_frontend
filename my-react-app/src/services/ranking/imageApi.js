export function getImageById(id) {
  // Returns full URL for <img src="">
  return Promise.resolve(`/api/images/${id}`);
}
