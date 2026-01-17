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
  getImage,
} from "../services/property/imageService";

import "../css/TripEditView.css";

function TripEditView({ tripId }) {
  const [properties, setProperties] = useState([]);
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);

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

  // Fetch initial lists
  useEffect(() => {
    async function load() {
      const props = await listProperties(tripId);
      const cats = await listCategories(tripId);
      setProperties(props);
      setCategories(cats);
    }
    load();
  }, [tripId]);

  // Fetch image when confirmed
  useEffect(() => {
    async function fetchImage() {
      if (confirmed && selectedProperty && selectedCategory) {
        try {
          const img = await getImage(selectedProperty, selectedCategory);
          setImage(img);
        } catch {
          setImage(null);
        }
      }
    }
    fetchImage();
  }, [confirmed, selectedProperty, selectedCategory]);

  // Auto-hide message
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(t);
  }, [message]);

  // Handle upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const img = await uploadImage({
      property: selectedProperty,
      category: selectedCategory,
      file,
    });

    setImage(img);
    setMessage("Image uploaded");
    setShowImageModal(true);
  };

  // Filtered lists for search
  const filteredProperties = useMemo(() => {
    return properties.filter((p) =>
      p.name.toLowerCase().includes(searchProperty.toLowerCase())
    );
  }, [properties, searchProperty]);

  const filteredCategories = useMemo(() => {
    return categories.filter((c) =>
      c.name.toLowerCase().includes(searchCategory.toLowerCase())
    );
  }, [categories, searchCategory]);

  // Add / Delete handlers
  const handleAddProperty = async () => {
    if (!newPropertyName) return;
    const prop = await createProperty({ trip: tripId, name: newPropertyName });
    setProperties((prev) => [...prev, prop]);
    setNewPropertyName("");
    setShowPropertyModal(false);
    setMessage("Property created");
  };

  const handleDeleteProperty = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    await deleteProperty(id);
    setProperties((prev) => prev.filter((p) => p.id !== id));
    if (selectedProperty === id) setSelectedProperty(null);
    setMessage("Property deleted");
  };

  const handleAddCategory = async () => {
    if (!newCategoryName) return;
    const cat = await createCategory({ trip: tripId, name: newCategoryName });
    setCategories((prev) => [...prev, cat]);
    setNewCategoryName("");
    setShowCategoryModal(false);
    setMessage("Category created");
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Delete this category?")) return;
    await deleteCategory(id);
    setCategories((prev) => prev.filter((c) => c.id !== id));
    if (selectedCategory === id) setSelectedCategory(null);
    setMessage("Category deleted");
  };

  return (
    <div className="trip-edit-container">
      <h2>Trip Edit View</h2>

      <div className="edit-grid">
        {/* PROPERTY LIST */}
        <div className="list-card">
          <h3>Property</h3>
          <input
            className="search-input"
            placeholder="Search property..."
            value={searchProperty}
            onChange={(e) => setSearchProperty(e.target.value)}
            onBlur={() => setSearchProperty("")}
          />
          <div className="scroll-area">
            {filteredProperties.map((p) => (
              <div
                key={p.id}
                className={`list-item ${
                  selectedProperty === p.id ? "selected" : ""
                }`}
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
                  onClick={(e) => {
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

        {/* CATEGORY LIST */}
        <div className="list-card">
          <h3>Category</h3>
          <input
            className="search-input"
            placeholder="Search category..."
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          />
          <div className="scroll-area">
            {filteredCategories.map((c) => (
              <div
                key={c.id}
                className={`list-item ${
                  selectedCategory === c.id ? "selected" : ""
                }`}
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
                  onClick={(e) => {
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

      {/* GUIDANCE */}
      {!selectedProperty || !selectedCategory ? (
        <p className="notice">
          Please select <strong>one Property</strong> and{" "}
          <strong>one Category</strong> to upload an image.
        </p>
      ) : !confirmed ? (
        <button className="combine-btn" onClick={() => setConfirmed(true)}>
          Show Image Upload Panel
        </button>
      ) : null}

      {/* IMAGE UPLOAD PANEL */}
      {confirmed && selectedProperty && selectedCategory && (
        <div className="image-panel">
          {image ? (
            <img src={image.url} alt="Uploaded" />
          ) : (
            <p>No image for this selection</p>
          )}
          <input type="file" onChange={handleUpload} />
        </div>
      )}

      {message && <p className="message">{message}</p>}

      {/* PROPERTY MODAL */}
      {showPropertyModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h4>New Property</h4>
            <input
              autoFocus
              placeholder="Enter property name"
              value={newPropertyName}
              onChange={(e) => setNewPropertyName(e.target.value)}
            />
            <button onClick={handleAddProperty}>Add</button>
            <button className="cancel" onClick={() => setShowPropertyModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {showCategoryModal && (
        <div className="modal-backdrop">
          <div className="modal">
            <h4>New Category</h4>
            <input
              autoFocus
              placeholder="Enter category name"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
            />
            <button onClick={handleAddCategory}>Add</button>
            <button className="cancel" onClick={() => setShowCategoryModal(false)}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* IMAGE PREVIEW MODAL */}
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
