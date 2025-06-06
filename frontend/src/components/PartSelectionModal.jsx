import React from "react";

const PartSelectionModal = ({
  partType,
  parts,
  onSelect,
  onClose,
  selectedPart,
}) => {
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
                {part.compatibleWith &&
                  Object.keys(part.compatibleWith).length > 0 && (
                    <div className="compatibility-info">
                      <p>Compatibility Notes:</p>
                      <ul>
                        {part.compatibleWith.motherboard && (
                          <li>
                            Socket: {part.compatibleWith.motherboard.join(", ")}
                          </li>
                        )}
                        {part.compatibleWith.powerSupply?.minWattage && (
                          <li>
                            Min PSU:{" "}
                            {part.compatibleWith.powerSupply.minWattage}W
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartSelectionModal;
