const properties = {
  "property-1": "Hotel Zillertal",
  "property-2": "Hotel Ischgl",
  "property-3": "Hotel Kitzbühel",
};

export function getPropertyNameById(id) {
  return Promise.resolve(properties[id]);
}
