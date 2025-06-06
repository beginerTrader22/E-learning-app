import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaLightbulb } from "react-icons/fa";
import "../Modal.css";

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
        setTimeout(() => setImagesLoaded(true), 300); // Small delay for smoothness
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

  // Animation variants
  const modalVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 500,
      },
    },
    exit: { opacity: 0, y: 20 },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.05,
        duration: 0.3,
      },
    }),
  };

  const notesVariants = {
    hidden: { height: 0, opacity: 0 },
    visible: {
      height: "auto",
      opacity: 1,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    exit: { height: 0, opacity: 0 },
  };

  const renderCompatibilityNotes = (part) => {
    const staticHints = {
      ram: "Min 16GB recommended",
      ssd: "Min 500gb recommended",
      powerSupply: "Min 650 wats recommended",
    };

    const hasDynamicCompatibility =
      part.compatibleWith && Object.keys(part.compatibleWith).length > 0;

    return (
      <motion.div
        className="compatibility-info"
        variants={notesVariants}
        initial="hidden"
        animate={expandedNotes[part._id] ? "visible" : "hidden"}
        exit="hidden"
      >
        <ul>
          {staticHints[partType] && <li>{staticHints[partType]}</li>}
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
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          className="part-modal"
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <motion.button
            onClick={onClose}
            className="close-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            &times;
          </motion.button>
          <div className="modal-header">
            <h2>Select {partType}</h2>
          </div>

          {!imagesLoaded ? (
            <motion.div
              className="loading-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="loading-spinner"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              />
              <p>Loading parts...</p>
            </motion.div>
          ) : (
            <div className="parts-list">
              {parts.map((part, index) => (
                <motion.div
                  key={part._id}
                  className={`part-item ${
                    selectedPart?._id === part._id ? "selected" : ""
                  }`}
                  onClick={() => onSelect(part)}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  custom={index}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.img
                    src={part.image || "/default-part.png"}
                    alt={part.name}
                    className="part-image"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.05 + 0.2 }}
                  />
                  <div className="part-info">
                    <h3>{part.name}</h3>
                    <p>Score: {part.scoreValue}</p>

                    <motion.button
                      className="toggle-notes-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleNotes(part._id);
                      }}
                    >
                      {" "}
                      <FaLightbulb />
                      {expandedNotes[part._id] ? "Hide Hints" : "Show Hints"}
                    </motion.button>

                    {renderCompatibilityNotes(part)}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PartSelectionModal;
