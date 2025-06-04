import React, { useEffect, useState } from "react";
import {
  useCreateBuildMutation,
  useUpdateBuildMutation,
} from "../store/api/buildApi";
import { useGetPartsQuery } from "../store/api/partApi";
import { toast } from "react-toastify";

const BuildForm = ({ editingBuild, setEditingBuild, onBuildCreated }) => {
  const { data: partsData, isLoading: loadingParts } = useGetPartsQuery();
  const [createBuild] = useCreateBuildMutation();
  const [updateBuild] = useUpdateBuildMutation();

  const initialParts = {
    cpu: "",
    ram: "",
    gpu: "",
    ssd: "",
    motherboard: "",
    powerSupply: "",
  };

  const [formParts, setFormParts] = useState(initialParts);

  useEffect(() => {
    if (editingBuild) {
      setFormParts({
        cpu: editingBuild.parts.cpu?._id || editingBuild.parts.cpu || "",
        ram: editingBuild.parts.ram?._id || editingBuild.parts.ram || "",
        gpu: editingBuild.parts.gpu?._id || editingBuild.parts.gpu || "",
        ssd: editingBuild.parts.ssd?._id || editingBuild.parts.ssd || "",
        motherboard:
          editingBuild.parts.motherboard?._id ||
          editingBuild.parts.motherboard ||
          "",
        powerSupply:
          editingBuild.parts.powerSupply?._id ||
          editingBuild.parts.powerSupply ||
          "",
      });
    } else {
      setFormParts(initialParts);
    }
  }, [editingBuild]);

  const handleChange = (e) => {
    setFormParts({ ...formParts, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    for (const key of Object.keys(formParts)) {
      if (!formParts[key]) {
        toast.error(`Please select a ${key}`);
        return;
      }
    }

    const buildData = { parts: formParts };

    try {
      if (editingBuild) {
        await updateBuild({ id: editingBuild._id, data: buildData }).unwrap();
        toast.success("Build updated");
        setEditingBuild(null);
      } else {
        await createBuild(buildData).unwrap();
        toast.success("Build created");
      }
      setFormParts(initialParts);
      onBuildCreated();
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
      <button type="submit">{editingBuild ? "Update" : "Create"} Build</button>
    </form>
  );
};

export default BuildForm;
