import React, { useState } from "react";
import BuildForm from "./BuildForm";

const Dashboard = () => {
  const [editingBuild, setEditingBuild] = useState(null);

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Create a New PC Build</h2>
      <BuildForm
        editingBuild={editingBuild}
        setEditingBuild={setEditingBuild}
        onBuildCreated={() => {}}
      />
    </div>
  );
};

export default Dashboard;
