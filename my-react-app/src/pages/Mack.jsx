import { useState } from "react";
import "../css/mack.css"

export default function Mack() {
  const [listA, setListA] = useState([]);
  const [listB, setListB] = useState([]);
  const [activeList, setActiveList] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const openModal = (listName) => {
    setActiveList(listName);
    setInputValue("");
  };

  const addItem = () => {
    if (!inputValue.trim()) return;

    if (activeList === "A") {
      setListA([...listA, inputValue]);
    } else {
      setListB([...listB, inputValue]);
    }
    setActiveList(null);
  };

  return (
    <div className="container">
      {/* List A */}
      <ScrollList
        title="List A"
        items={listA}
        onAdd={() => openModal("A")}
      />

      {/* List B */}
      <ScrollList
        title="List B"
        items={listB}
        onAdd={() => openModal("B")}
      />

      {/* Modal */}
      {activeList && (
        <div className="modal-backdrop">
          <div className="modal">
            <input
              autoFocus
              type="text"
              placeholder="Enter item..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <button onClick={addItem}>Add</button>
            <button className="cancel" onClick={() => setActiveList(null)}>
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ScrollList({ title, items, onAdd }) {
  return (
    <div className="list-wrapper">
      <h3>{title}</h3>

      <div className="scroll-area">
        {items.map((item, index) => (
          <div key={index} className="list-item">
            {item}
          </div>
        ))}
      </div>

      <button className="add-btn" onClick={onAdd}>
        + Add New
      </button>
    </div>
  );
}
