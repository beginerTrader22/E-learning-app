import React from "react";

const PartSelectionModal = ({
  partType,
  parts,
  onSelect,
  onClose,
  selectedPart,
}) => {
  const renderCompatibilityNotes = (part) => {
    if (!part.compatibleWith || Object.keys(part.compatibleWith).length === 0) {
      if (partType === "ram") {
        return <p>Recommended: 16GB or more</p>;
      } else if (partType === "ssd") {
        return <p>Recommended: 500GB or more</p>;
      }
      return null;
    }

    return (
      <div className="compatibility-info">
        <p>Compatibility Notes:</p>
        <ul>
          {partType === "cpu" && (
            <>
              {part.compatibleWith.motherboard && (
                <li>
                  Motherboards: {part.compatibleWith.motherboard.join(", ")}
                </li>
              )}
              {part.compatibleWith.gpu && (
                <li>GPUs: {part.compatibleWith.gpu.join(", ")}</li>
              )}
            </>
          )}

          {partType === "motherboard" && part.compatibleWith.cpu && (
            <li>CPUs: {part.compatibleWith.cpu.join(", ")}</li>
          )}

          {partType === "gpu" &&
            part.compatibleWith.powerSupply?.minWattage && (
              <li>Min PSU: {part.compatibleWith.powerSupply.minWattage}W</li>
            )}
        </ul>
      </div>
    );
  };

  return (
    <div className="modal-overlay">
      <div className="part-modal">
        <div className="modal-header">
          <h2>Select {partType}</h2>
          <button onClick={onClose} className="close-btn">
            &times;
          </button>
        </div>

        <div className="parts-list">
          {parts.map((part) => (
            <div
              key={part._id}
              className={`part-item ${
                selectedPart?._id === part._id ? "selected" : ""
              }`}
              onClick={() => onSelect(part)}
            >
              <img
                src={part.image || "/default-part.png"}
                alt={part.name}
                className="part-image"
              />
              <div className="part-info">
                <h3>{part.name}</h3>
                <p>Score: {part.scoreValue}</p>
                {renderCompatibilityNotes(part)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartSelectionModal;
