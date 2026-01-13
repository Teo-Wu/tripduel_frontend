import { useEffect, useState } from "react";
import * as propertyService from "../services/property/propertyService";
import * as categoryService from "../services/property/categoryService";
import * as imageService from "../services/property/imageService";

export function useTripEdit(tripId) {
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
 
  useEffect(() => {
    propertyService.listProperties(tripId).then(setProperties);
    categoryService.listCategories(tripId).then(setCategories);
  }, [tripId]);

  const loadImage = async (propertyId, categoryId) => {
    try {
      const img = await imageService.getImage(propertyId, categoryId);
      setImage(img);
    } catch {
      setImage(null);
    }
  };

  return {
    properties,
    categories,
    image,
    loadImage,
    createProperty: async (name) => {
      const p = await propertyService.createProperty({ trip: tripId, name });
      setProperties(prev => [...prev, p]);
    },
    createCategory: async (name) => {
      const c = await categoryService.createCategory({ trip: tripId, name });
      setCategories(prev => [...prev, c]);
    },
    uploadImage: imageService.uploadImage,
  };
}
