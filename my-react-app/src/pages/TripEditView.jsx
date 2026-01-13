import { useState, useEffect } from "react";
import { useTripEdit } from "../hooks/useTripEdit";
import "../css/TripEditView.css";

function TripEditView({ tripId }) {
  const {
    properties,
    categories,
    image,
    loadImage,
    createProperty,
    createCategory,
    uploadImage,
  } = useTripEdit(tripId);

  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [newPropertyName, setNewPropertyName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const [message, setMessage] = useState("");

  // Load image when both selections exist
  useEffect(() => {
    if (selectedProperty && selectedCategory) {
      loadImage(selectedProperty, selectedCategory);
    }
  }, [selectedProperty, selectedCategory]);

  // Auto-hide message
  useEffect(() => {
    if (!message) return;
    const t = setTimeout(() => setMessage(""), 3000);
    return () => clearTimeout(t);
  }, [message]);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    await uploadImage({
      property: selectedProperty,
      category: selectedCategory,
      file,
    });

    loadImage(selectedProperty, selectedCategory);
    setMessage("Image uploaded");
  };

  return (
    <div className="trip-edit-container">
      <h2>Trip Edit View</h2>

      <div className="edit-grid">
        {/* PROPERTY LIST */}
        <div>
          <h3>Property</h3>
          <div className="scroll-list">
            {properties.map((p) => (
              <button
                key={p.id}
                className={selectedProperty === p.id ? "selected" : ""}
                onClick={() => setSelectedProperty(p.id)}
              >
                {p.name}
              </button>
            ))}
          </div>

          <input
            placeholder="Enter new Property"
            value={newPropertyName}
            onChange={(e) => setNewPropertyName(e.target.value)}
          />
          <button
            onClick={async () => {
              if (!newPropertyName) return;
              await createProperty(newPropertyName);
              setNewPropertyName("");
              setMessage("Property created");
            }}
          >
            Create new Property
          </button>
        </div>

        {/* CATEGORY LIST */}
        <div>
          <h3>Category</h3>
          <div className="scroll-list">
            {categories.map((c) => (
              <button
                key={c.id}
                className={selectedCategory === c.id ? "selected" : ""}
                onClick={() => setSelectedCategory(c.id)}
              >
                {c.name}
              </button>
            ))}
          </div>

          <input
            placeholder="Enter new Category"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
          />
          <button
            onClick={async () => {
              if (!newCategoryName) return;
              await createCategory(newCategoryName);
              setNewCategoryName("");
              setMessage("Category created");
            }}
          >
            Create new Category
          </button>
        </div>

        {/* IMAGE */}
        <div className="image-panel">
          {image ? (
            <img src={image.url} alt="Uploaded" />
          ) : (
            <p>No image for this selection</p>
          )}

          <input
            type="file"
            disabled={!selectedProperty || !selectedCategory}
            onChange={handleUpload}
          />
        </div>
      </div>

      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default TripEditView;
