import React, { useEffect, useState } from "react";
import {
  useCreateBuildMutation,
  useUpdateBuildMutation,
  useGetBuildsQuery,
} from "../store/api/buildApi";
import { useGetPartsQuery } from "../store/api/partApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import PartSelectionModal from "./PartSelectionModal";
import { motion, AnimatePresence } from "framer-motion";

import { FaInfoCircle } from "react-icons/fa";
import { IoCloseCircle } from "react-icons/io5";
const BuildForm = ({ editId }) => {
  const { data: partsData, isLoading: loadingParts } = useGetPartsQuery();
  const { data: builds } = useGetBuildsQuery();
  const [createBuild] = useCreateBuildMutation();
  const [updateBuild] = useUpdateBuildMutation();
  const navigate = useNavigate();

  const [selectedParts, setSelectedParts] = useState({
    cpu: null,
    ram: null,
    gpu: null,
    ssd: null,
    motherboard: null,
    powerSupply: null,
  });
  const [originalParts, setOriginalParts] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (!editId) {
      // Reset form when not in edit mode
      setSelectedParts({
        cpu: null,
        ram: null,
        gpu: null,
        ssd: null,
        motherboard: null,
        powerSupply: null,
      });
      setOriginalParts(null);
      setImagesLoaded({});
    }
  }, [editId]);

  useEffect(() => {
    if (editId && builds) {
      const buildToEdit = builds.find((b) => b._id === editId);
      if (buildToEdit) {
        const normalizedParts = {
          cpu: buildToEdit.parts.cpu
            ? { ...buildToEdit.parts.cpu, showDescription: false }
            : null,
          ram: buildToEdit.parts.ram
            ? { ...buildToEdit.parts.ram, showDescription: false }
            : null,
          gpu: buildToEdit.parts.gpu
            ? { ...buildToEdit.parts.gpu, showDescription: false }
            : null,
          ssd: buildToEdit.parts.ssd
            ? { ...buildToEdit.parts.ssd, showDescription: false }
            : null,
          motherboard: buildToEdit.parts.motherboard
            ? { ...buildToEdit.parts.motherboard, showDescription: false }
            : null,
          powerSupply: buildToEdit.parts.powerSupply
            ? { ...buildToEdit.parts.powerSupply, showDescription: false }
            : null,
        };
        setSelectedParts(normalizedParts);
        setOriginalParts(normalizedParts);

        // Preload images for existing parts
        const loadStatus = {};
        Object.entries(normalizedParts).forEach(([key, part]) => {
          if (part?.image) {
            loadStatus[key] = false;
            const img = new Image();
            img.src = part.image;
            img.onload = () => {
              setImagesLoaded((prev) => ({ ...prev, [key]: true }));
            };
            img.onerror = () => {
              setImagesLoaded((prev) => ({ ...prev, [key]: true }));
            };
          }
        });
      }
    }
  }, [editId, builds]);

  const isFormUnchanged = () => {
    if (!originalParts) return false;
    return Object.keys(selectedParts).every(
      (key) => selectedParts[key]?._id === originalParts[key]?._id
    );
  };

  const closeAllDescriptions = () => {
    setSelectedParts((prev) => {
      const updatedParts = { ...prev };
      Object.keys(updatedParts).forEach((key) => {
        if (updatedParts[key]) {
          updatedParts[key] = {
            ...updatedParts[key],
            showDescription: false,
          };
        }
      });
      return updatedParts;
    });
  };

  const handlePartSelect = (partType, part) => {
    setSelectedParts((prev) => ({
      ...prev,
      [partType]: part,
    }));

    // Reset the loaded state for this part type
    setImagesLoaded((prev) => ({ ...prev, [partType]: false }));

    // Load the new image
    if (part?.image) {
      const img = new Image();
      img.src = part.image;
      img.onload = () => {
        setImagesLoaded((prev) => ({ ...prev, [partType]: true }));
      };
      img.onerror = () => {
        setImagesLoaded((prev) => ({ ...prev, [partType]: true }));
      };
    } else {
      // If no image, mark as loaded
      setImagesLoaded((prev) => ({ ...prev, [partType]: true }));
    }

    setActiveModal(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all parts selected
    for (const key of Object.keys(selectedParts)) {
      if (!selectedParts[key]) {
        toast.error(`Ju lutem selektoni nje ${key}`);
        setIsSubmitting(false);
        return;
      }
    }

    // If editing and no change, block update
    if (editId && isFormUnchanged()) {
      toast.info("Nuk keni bere ndryshime ne kompjuter");
      setIsSubmitting(false);
      return;
    }

    const buildData = {
      parts: Object.fromEntries(
        Object.entries(selectedParts).map(([key, part]) => [key, part._id])
      ),
    };

    try {
      if (editId) {
        await updateBuild({ id: editId, data: buildData }).unwrap();
        toast.success("Kompjuteri u be update me pjeset e reja");

        const updatedParts = [];
        if (originalParts) {
          Object.keys(selectedParts).forEach((key) => {
            if (selectedParts[key]?._id !== originalParts[key]?._id) {
              updatedParts.push(key);
            }
          });
        }
        setTimeout(() => {
          navigate(
            `/my-builds?updated=${editId}${
              updatedParts.length
                ? `&updatedPart=${updatedParts.join(",")}`
                : ""
            }`
          );
        }, 500);
      } else {
        await createBuild(buildData).unwrap();
        toast.success("Kompjuteri u krijua");
        navigate(`/my-builds`);
      }
    } catch (err) {
      console.error("Build API error:", err);
      const res = err?.data;
      if (res?.errors && Array.isArray(res.errors)) {
        res.errors.forEach((error) => toast.error(error));
      } else {
        toast.error(res?.message || "Dicka shkoi keq");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const partTypes = [
    { key: "cpu", name: "Procesori (CPU)", name2: "Procesorin" },
    { key: "motherboard", name: "MotherBordi", name2: "MotherBordin" },
    { key: "ram", name: "Memorja (RAM)", name2: "Memorjen" },
    { key: "gpu", name: "Karta Grafike (GPU)", name2: "Kartën Grafike" },
    { key: "ssd", name: "Magazina (SSD)", name2: "Magazinën" },
    { key: "powerSupply", name: "Ushqyesi (PowerSupply)", name2: "Ushqyesin" },
  ];

  if (loadingParts) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Duke u ngrakuar...</p>
      </div>
    );
  }
  return (
    <motion.div
      className="build-form-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.form
        onSubmit={handleSubmit}
        className="build-form"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <motion.div
          className="parts-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          {partTypes.map(({ key, name, name2 }, index) => (
            <motion.div
              key={key}
              className="part-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
            >
              <h3>{name}</h3>

              {selectedParts[key] ? (
                <motion.div
                  className="selected-part"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {imagesLoaded[key] !== true ? (
                    <div className="image-placeholder">
                      <div className="loading-spinner small"></div>
                    </div>
                  ) : (
                    <motion.img
                      src={selectedParts[key].image || "/default-part.png"}
                      alt={selectedParts[key].name}
                      className="part-image"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      onError={(e) => {
                        e.target.src = "/default-part.png";
                      }}
                    />
                  )}
                  <p>{selectedParts[key].name}</p>

                  {selectedParts[key].description && (
                    <div className="description-container">
                      <motion.button
                        type="button"
                        className="description-toggle-btn"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedParts((prev) => ({
                            ...prev,
                            [key]: {
                              ...prev[key],
                              showDescription: !prev[key]?.showDescription,
                            },
                          }));
                        }}
                      >
                        {selectedParts[key]?.showDescription ? (
                          <IoCloseCircle
                            style={{ fontSize: "1.5rem", color: "white" }}
                          />
                        ) : (
                          <FaInfoCircle style={{ fontSize: "1.5rem" }} />
                        )}
                      </motion.button>

                      {/* Animated description panel */}
                      {selectedParts[key]?.showDescription && (
                        <motion.div
                          className="part-description"
                          initial={{ opacity: 0, y: -20, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: "100%" }}
                          exit={{ opacity: 0, y: -20, height: 0 }}
                          transition={{ type: "spring", damping: 25 }}
                          style={{
                            overflow: "hidden",
                          }}
                        >
                          <div className="description-content">
                            <h3>Informacion</h3>
                            {selectedParts[key].description}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  )}
                  <motion.button
                    type="button"
                    onClick={() => {
                      closeAllDescriptions();
                      setActiveModal(key);
                    }}
                    className="change-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Ndrysho Pjesën
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  type="button"
                  onClick={() => {
                    closeAllDescriptions();
                    setActiveModal(key);
                  }}
                  className="select-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Zgjidh {name2}
                </motion.button>
              )}
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="form-actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          <motion.button
            type="submit"
            className="submit-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="btn-loading">
                <span className="spinner"></span>
                {editId ? "Duke u perditsuar..." : "Duke krijuar..."}
              </span>
            ) : editId ? (
              "Perditeso Ndryshimet"
            ) : (
              "Krijo Kompjuter"
            )}
          </motion.button>
          {editId && (
            <motion.button
              type="button"
              onClick={() => navigate("/my-builds")}
              className="cancel-btn"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              Anullo veprimin
            </motion.button>
          )}
        </motion.div>
      </motion.form>

      {activeModal && partsData && (
        <PartSelectionModal
          partType={activeModal}
          parts={partsData[activeModal]}
          onSelect={(part) => handlePartSelect(activeModal, part)}
          onClose={() => setActiveModal(null)}
          selectedPart={selectedParts[activeModal]}
        />
      )}
    </motion.div>
  );
};

export default BuildForm;
