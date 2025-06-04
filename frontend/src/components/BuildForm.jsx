import React, { useEffect, useState } from "react";
import {
  useCreateBuildMutation,
  useUpdateBuildMutation,
  useGetBuildsQuery,
} from "../store/api/buildApi";
import { useGetPartsQuery } from "../store/api/partApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BuildForm = ({ editId }) => {
  const { data: partsData, isLoading: loadingParts } = useGetPartsQuery();
  const { data: builds } = useGetBuildsQuery();
  const [createBuild] = useCreateBuildMutation();
  const [updateBuild] = useUpdateBuildMutation();
  const navigate = useNavigate();

  const initialParts = {
    cpu: "",
    ram: "",
    gpu: "",
    ssd: "",
    motherboard: "",
    powerSupply: "",
  };

  const [formParts, setFormParts] = useState(initialParts);
  const [originalParts, setOriginalParts] = useState(null);

  useEffect(() => {
    if (editId && builds) {
      const buildToEdit = builds.find((b) => b._id === editId);
      if (buildToEdit) {
        const normalizedParts = {
          cpu: buildToEdit.parts.cpu?._id || buildToEdit.parts.cpu || "",
          ram: buildToEdit.parts.ram?._id || buildToEdit.parts.ram || "",
          gpu: buildToEdit.parts.gpu?._id || buildToEdit.parts.gpu || "",
          ssd: buildToEdit.parts.ssd?._id || buildToEdit.parts.ssd || "",
          motherboard:
            buildToEdit.parts.motherboard?._id ||
            buildToEdit.parts.motherboard ||
            "",
          powerSupply:
            buildToEdit.parts.powerSupply?._id ||
            buildToEdit.parts.powerSupply ||
            "",
        };
        setFormParts(normalizedParts);
        setOriginalParts(normalizedParts);
      }
    } else {
      setFormParts(initialParts);
      setOriginalParts(null);
    }
  }, [editId, builds]);

  // Check if formParts equals originalParts
  const isFormUnchanged = () => {
    if (!originalParts) return false;
    return Object.keys(formParts).every(
      (key) => formParts[key] === originalParts[key]
    );
  };

  const handleChange = (e) => {
    setFormParts({ ...formParts, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all parts selected
    for (const key of Object.keys(formParts)) {
      if (!formParts[key]) {
        toast.error(`Please select a ${key}`);
        return;
      }
    }

    // If editing and no change, block update
    if (editId && isFormUnchanged()) {
      toast.info("No changes made to the build.");
      return;
    }

    const buildData = { parts: formParts };

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
      setFormParts(initialParts);
      setOriginalParts(null);
    } catch (err) {
      console.error("Build API error:", err);
      toast.error(err.data?.message || "Something went wrong");
    }
  };

  if (loadingParts) return <p>Loading parts...</p>;

  const renderSelect = (label, name) => (
    <div>
      <label>{label}</label>
      <select name={name} value={formParts[name]} onChange={handleChange}>
        <option value="">Select {label}</option>
        {partsData?.[name]?.map((part) => (
          <option key={part._id} value={part._id}>
            {part.name}
          </option>
        ))}
      </select>
    </div>
  );

  return (
    <form onSubmit={handleSubmit}>
      {renderSelect("CPU", "cpu")}
      {renderSelect("RAM", "ram")}
      {renderSelect("GPU", "gpu")}
      {renderSelect("SSD", "ssd")}
      {renderSelect("Motherboard", "motherboard")}
      {renderSelect("Power Supply", "powerSupply")}
      <button type="submit">{editId ? "Update" : "Create"} Build</button>
    </form>
  );
};

export default BuildForm;
