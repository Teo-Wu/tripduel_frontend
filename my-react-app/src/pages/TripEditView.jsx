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
  const [confirmed, setConfirmed] = useState(false);

  const [newPropertyName, setNewPropertyName] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  const [showPropertyModal, setShowPropertyModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);

  const [message, setMessage] = useState("");

  useEffect(() => {
    if (confirmed && selectedProperty && selectedCategory) {
      loadImage(selectedProperty, selectedCategory);
    }
  }, [selectedProperty, selectedCategory, confirmed]);

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
        {/* PROPERTY */}
        <div className="list-card">
          <h3>Property</h3>

          <div className="scroll-area">
            {properties.map((p) => (
              <div
                key={p.id}
                className={`list-item ${
                  selectedProperty === p.id ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedProperty(p.id);
                  setConfirmed(false);
                }}
              >
                {p.name}
              </div>
            ))}
          </div>

          <button className="add-btn" onClick={() => setShowPropertyModal(true)}>
            + Add Property
          </button>
        </div>

        {/* CATEGORY */}
        <div className="list-card">
          <h3>Category</h3>

          <div className="scroll-area">
            {categories.map((c) => (
              <div
                key={c.id}
                className={`list-item ${
                  selectedCategory === c.id ? "selected" : ""
                }`}
                onClick={() => {
                  setSelectedCategory(c.id);
                  setConfirmed(false);
                }}
              >
                {c.name}
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
          Show Upload Panel for this combination
        </button>
      ) : null}

      {/* IMAGE PANEL */}
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
            <button
              onClick={async () => {
                if (!newPropertyName) return;
                await createProperty(newPropertyName);
                setNewPropertyName("");
                setShowPropertyModal(false);
                setMessage("Property created");
              }}
            >
              Add
            </button>
            <button
              className="cancel"
              onClick={() => setShowPropertyModal(false)}
            >
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
            <button
              onClick={async () => {
                if (!newCategoryName) return;
                await createCategory(newCategoryName);
                setNewCategoryName("");
                setShowCategoryModal(false);
                setMessage("Category created");
              }}
            >
              Add
            </button>
            <button
              className="cancel"
              onClick={() => setShowCategoryModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default TripEditView;
