import { useState, useEffect, useMemo } from "react";
import {
  listProperties,
  createProperty,
  deleteProperty,
} from "../services/property/propertyService";

import {
  listCategories,
  createCategory,
  deleteCategory,
} from "../services/property/categoryService";

import {
  uploadImage,
  listImages,
  deleteImage,
} from "../services/property/imageService";

import "../css/TripEditView.css";
import { useParams } from "react-router-dom";

function TripEditView() {
  const { tripId } = useParams();
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]); // all images for trip
  const [image, setImage] = useState(null); // selected image

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  const [newPropertyName, setNewPropertyName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);

  const [searchProperty, setSearchProperty] = useState("");
  const [searchCategory, setSearchCategory] = useState("");

  const [message, setMessage] = useState("");

  // Fetch initial lists and images
  useEffect(() => {
    async function load() {
      try {
        const [props, cats, imgs] = await Promise.all([
          listProperties(tripId),
          listCategories(tripId),
          listImages(tripId),
        ]);
        setProperties(props);
        setCategories(cats);
        setImages(imgs);
      } catch (err) {
        setMessage("Failed to load data");
      }
    }
    load();
  }, [tripId]);

  // Update selected image when property + category selected
  useEffect(() => {
    if (confirmed && selectedProperty && selectedCategory) {
      const img = images.find(
        i => i.property === selectedProperty && i.category === selectedCategory
      );
      setImage(img ? { ...img, url: `/api/images/${img.id}` } : null);
    }
  }, [confirmed, selectedProperty, selectedCategory, images]);

  // Auto-hide messages
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(t);
  }, [message]);

  // Handle upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const img = await uploadImage({
        property: selectedProperty,
        category: selectedCategory,
        file,
      });
      const imgWithUrl = { ...img, url: `/api/images/${img.id}` };
      setImages(prev => {
        // remove previous image for same property/category
        const filtered = prev.filter(
          i => !(i.property === selectedProperty && i.category === selectedCategory)
        );
        return [...filtered, imgWithUrl];
      });
      setImage(imgWithUrl);
      setMessage("Image uploaded");
      setShowImageModal(true);
    } catch {
      setMessage("Failed to upload image");
    }
  };

  // Handle delete
  const handleDeleteImage = async () => {
    if (!window.confirm("Delete this image?")) return;
    if (!image?.id) return setMessage("No image to delete");

    try {
      await deleteImage(image.id);
      setImages(prev => prev.filter(i => i.id !== image.id));
      setImage(null);
      setMessage("Image deleted");
    } catch {
      setMessage("Failed to delete image");
    }
  };

  // Filtered lists
  const filteredProperties = useMemo(
    () => properties.filter(p => p.name.toLowerCase().includes(searchProperty.toLowerCase())),
    [properties, searchProperty]
  );

  const filteredCategories = useMemo(
    () => categories.filter(c => c.name.toLowerCase().includes(searchCategory.toLowerCase())),
    [categories, searchCategory]
  );

  // Add/Delete handlers for property/category
  const handleAddProperty = async () => {
    const name = newPropertyName.trim();
    if (!name) return setMessage("Property name cannot be empty");
    if (properties.some(p => p.name.toLowerCase() === name.toLowerCase()))
      return setMessage("Property name already exists");

    try {
      const prop = await createProperty({ trip: tripId, name });
      setProperties(prev => [...prev, prop]);
      setNewPropertyName("");
      setShowPropertyModal(false);
      setMessage("Property created");
    } catch {
      setMessage("Failed to create property");
    }
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      await deleteProperty(id);
      setProperties(prev => prev.filter(p => p.id !== id));
      if (selectedProperty === id) setSelectedProperty(null);
      setMessage("Property deleted");
    } catch {
      setMessage("Failed to delete property");
    }
  };

  const handleAddCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return setMessage("Category name cannot be empty");
    if (categories.some(c => c.name.toLowerCase() === name.toLowerCase()))
      return setMessage("Category name already exists");

    try {
      const cat = await createCategory({ trip: tripId, name });
      setCategories(prev => [...prev, cat]);
      setNewCategoryName("");
      setShowCategoryModal(false);
      setMessage("Category created");
    } catch {
      setMessage("Failed to create category");
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    try {
      await deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
      if (selectedCategory === id) setSelectedCategory(null);
      setMessage("Category deleted");
    } catch {
      setMessage("Failed to delete category");
    }
  };

  return (
    <div className="trip-edit-container">
      <div className="edit-grid">
        {/* Properties */}
        <div className="list-card">
          <h3>Property</h3>
          <input
            className="search-input"
            placeholder="Search property..."
            value={searchProperty}
            onChange={e => setSearchProperty(e.target.value)}
            onBlur={() => setSearchProperty("")}
          />
          <div className="scroll-area">
            {filteredProperties.map(p => (
              <div
                key={p.id}
                className={`list-item ${selectedProperty === p.id ? "selected" : ""}`}
              >
                <span
                  className="item-text"
                  onClick={() => {
                    setSelectedProperty(p.id);
                    setConfirmed(false);
                  }}
                >
                  {p.name}
                </span>
                <button
                  className="delete-btn"
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteProperty(p.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button className="add-btn" onClick={() => setShowPropertyModal(true)}>
            + Add Property
          </button>
        </div>

        {/* Categories */}
        <div className="list-card">
          <h3>Category</h3>
          <input
            className="search-input"
            placeholder="Search category..."
            value={searchCategory}
            onChange={e => setSearchCategory(e.target.value)}
          />
          <div className="scroll-area">
            {filteredCategories.map(c => (
              <div
                key={c.id}
                className={`list-item ${selectedCategory === c.id ? "selected" : ""}`}
              >
                <span
                  className="item-text"
                  onClick={() => {
                    setSelectedCategory(c.id);
                    setConfirmed(false);
                  }}
                >
                  {c.name}
                </span>
                <button
                  className="delete-btn"
                  onClick={e => {
                    e.stopPropagation();
                    handleDeleteCategory(c.id);
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button className="add-btn" onClick={() => setShowCategoryModal(true)}>
            + Add Category
          </button>
        </div>
      </div>

      {/* Image upload guidance */}
      {!selectedProperty || !selectedCategory ? (
        <p className="notice">
          Please select <strong>one Property</strong> and <strong>one Category</strong> to upload an image.
        </p>
      ) : !confirmed ? (
        <button className="combine-btn" onClick={() => setConfirmed(true)}>
          Show Image Upload Panel
        </button>
      ) : null}

      {/* Image Upload Panel */}
      {confirmed && selectedProperty && selectedCategory && (
        <div className="image-panel">
          {image ? (
            <>
              <img src={image.url} alt="Uploaded" />
              <button className="img-delete-btn" onClick={handleDeleteImage}>
                Delete Image
              </button>
            </>
          ) : (
            <p>No image for this selection</p>
          )}
          <input type="file" onChange={handleUpload} />
        </div>
      )}

      {message && <p className="message">{message}</p>}

      {/* Property Modal */}
      {showPropertyModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h4>New Property</h4>
            <input
              autoFocus
              placeholder="Enter property name"
              value={newPropertyName}
              onChange={e => setNewPropertyName(e.target.value)}
            />
            <button onClick={handleAddProperty}>Add</button>
            <button className="cancel" onClick={() => setShowPropertyModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Category Modal */}
      {showCategoryModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h4>New Category</h4>
            <input
              autoFocus
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={e => setNewCategoryName(e.target.value)}
            />
            <button onClick={handleAddCategory}>Add</button>
            <button className="cancel" onClick={() => setShowCategoryModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {showImageModal && image && (
        <div className="modal-backdrop">
          <div className="modal image-modal">
            <img src={image.url} alt="Preview" className="preview-img" />
            <button className="cancel" onClick={() => setShowImageModal(false)}>
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripEditView;
