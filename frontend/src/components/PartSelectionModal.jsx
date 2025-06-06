import React, { useState, useEffect } from "react";

const PartSelectionModal = ({
  partType,
  parts,
  onSelect,
  onClose,
  selectedPart,
}) => {
  const [expandedNotes, setExpandedNotes] = useState({});
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    if (!parts || parts.length === 0) {
      setImagesLoaded(true);
      return;
    }

    let loadedCount = 0;
    const totalImages = parts.length;

    const handleImageLoad = () => {
      loadedCount++;
      if (loadedCount === totalImages) {
        setImagesLoaded(true);
      }
    };

    parts.forEach((part) => {
      const img = new Image();
      img.src = part.image || "/default-part.png";
      img.onload = handleImageLoad;
      img.onerror = handleImageLoad;
    });
  }, [parts]);

  const toggleNotes = (partId) => {
    setExpandedNotes((prev) => ({
      ...prev,
      [partId]: !prev[partId],
    }));
  };

  const renderCompatibilityNotes = (part) => {
    if (!expandedNotes[part._id]) return null;

    const staticHints = {
      ram: "Min 16GB recommended",
      ssd: "Min 500gb recommended",
      powerSupply: "Min 650 wats recomended ",
    };

    const hasDynamicCompatibility =
      part.compatibleWith && Object.keys(part.compatibleWith).length > 0;

    return (
      <div className="compatibility-info">
        <p>Compatibility Notes:</p>
        <ul>
          {/* Static hints for RAM and PSU */}
          {staticHints[partType] && <li>{staticHints[partType]}</li>}

          {/* Dynamic compatibility info */}
          {hasDynamicCompatibility && (
            <>
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

              {partType === "gpu" && (
                <>
                  {part.compatibleWith.powerSupply?.minWattage && (
                    <li>
                      Min PSU: {part.compatibleWith.powerSupply.minWattage}W
                    </li>
                  )}
                  {part.compatibleWith.cpu && (
                    <li>CPUs: {part.compatibleWith.cpu.join(", ")}</li>
                  )}
                </>
              )}
            </>
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

        {!imagesLoaded ? (
          <div className="loading-content">Loading parts...</div>
        ) : (
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
                  <button
                    className="toggle-notes-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleNotes(part._id);
                    }}
                  >
                    {expandedNotes[part._id] ? "Hide Hints" : "Show Hints"}
                  </button>
                  {renderCompatibilityNotes(part)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PartSelectionModal;
