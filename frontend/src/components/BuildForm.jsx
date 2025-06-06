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
import "../BuildForm.css";

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
    if (editId && builds) {
      const buildToEdit = builds.find((b) => b._id === editId);
      if (buildToEdit) {
        const normalizedParts = {
          cpu: buildToEdit.parts.cpu || null,
          ram: buildToEdit.parts.ram || null,
          gpu: buildToEdit.parts.gpu || null,
          ssd: buildToEdit.parts.ssd || null,
          motherboard: buildToEdit.parts.motherboard || null,
          powerSupply: buildToEdit.parts.powerSupply || null,
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
              loadStatus[key] = true;
              setImagesLoaded({ ...loadStatus });
            };
            img.onerror = () => {
              loadStatus[key] = true;
              setImagesLoaded({ ...loadStatus });
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

  const handlePartSelect = (partType, part) => {
    setSelectedParts((prev) => ({
      ...prev,
      [partType]: part,
    }));
    setActiveModal(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate all parts selected
    for (const key of Object.keys(selectedParts)) {
      if (!selectedParts[key]) {
        toast.error(`Please select a ${key}`);
        setIsSubmitting(false);
        return;
      }
    }

    // If editing and no change, block update
    if (editId && isFormUnchanged()) {
      toast.info("No changes made to the build.");
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
        toast.success("Build updated");
        setTimeout(() => {
          navigate(`/my-builds?updated=${editId}`);
        }, 500);
      } else {
        await createBuild(buildData).unwrap();
        toast.success("Build created");
        navigate(`/my-builds`);
      }
    } catch (err) {
      console.error("Build API error:", err);
      const res = err?.data;
      if (res?.errors && Array.isArray(res.errors)) {
        res.errors.forEach((error) => toast.error(error));
      } else {
        toast.error(res?.message || "Something went wrong");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const partTypes = [
    { key: "cpu", name: "CPU" },
    { key: "motherboard", name: "Motherboard" },
    { key: "ram", name: "RAM" },
    { key: "gpu", name: "GPU" },
    { key: "ssd", name: "SSD" },
    { key: "powerSupply", name: "Power Supply" },
  ];

  if (loadingParts) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading parts data...</p>
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
          {partTypes.map(({ key, name }, index) => (
            <motion.div
              key={key}
              className="part-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.05, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <h3>{name}</h3>
              {selectedParts[key] ? (
                <motion.div
                  className="selected-part"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {!imagesLoaded[key] ? (
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
                    />
                  )}
                  <p>{selectedParts[key].name}</p>
                  <motion.button
                    type="button"
                    onClick={() => setActiveModal(key)}
                    className="change-btn"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Change
                  </motion.button>
                </motion.div>
              ) : (
                <motion.button
                  type="button"
                  onClick={() => setActiveModal(key)}
                  className="select-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Select {name}
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
                {editId ? "Updating..." : "Creating..."}
              </span>
            ) : editId ? (
              "Update Build"
            ) : (
              "Create Build"
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
              Cancel
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
