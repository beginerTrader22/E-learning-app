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

    // Validate all parts selected
    for (const key of Object.keys(selectedParts)) {
      if (!selectedParts[key]) {
        toast.error(`Please select a ${key}`);
        return;
      }
    }

    // If editing and no change, block update
    if (editId && isFormUnchanged()) {
      toast.info("No changes made to the build.");
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
      toast.error(err.data?.message || "Something went wrong");
    }
  };

  if (loadingParts) return <p>Loading parts...</p>;

  const partTypes = [
    { key: "cpu", name: "CPU" },
    { key: "motherboard", name: "Motherboard" },
    { key: "ram", name: "RAM" },
    { key: "gpu", name: "GPU" },
    { key: "ssd", name: "SSD" },
    { key: "powerSupply", name: "Power Supply" },
  ];

  return (
    <div className="build-form-container">
      <form onSubmit={handleSubmit} className="build-form">
        <div className="parts-grid">
          {partTypes.map(({ key, name }) => (
            <div key={key} className="part-card">
              <h3>{name}</h3>
              {selectedParts[key] ? (
                <div className="selected-part">
                  <img
                    src={selectedParts[key].image || "/default-part.png"}
                    alt={selectedParts[key].name}
                    className="part-image"
                  />
                  <p>{selectedParts[key].name}</p>
                  <button
                    type="button"
                    onClick={() => setActiveModal(key)}
                    className="change-btn"
                  >
                    Change
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveModal(key)}
                  className="select-btn"
                >
                  Select {name}
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {editId ? "Update Build" : "Create Build"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => navigate("/my-builds")}
              className="cancel-btn"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {activeModal && partsData && (
        <PartSelectionModal
          partType={activeModal}
          parts={partsData[activeModal]}
          onSelect={(part) => handlePartSelect(activeModal, part)}
          onClose={() => setActiveModal(null)}
          selectedPart={selectedParts[activeModal]}
        />
      )}
    </div>
  );
};

export default BuildForm;
