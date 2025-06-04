import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import BuildForm from "./BuildForm";

const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("edit");
  const navigate = useNavigate();

  return (
    <div className="p-4">
      {id ? (
        <>
          <h2 className="text-2xl font-bold mb-4">Edit Build</h2>
          <button className="btn mb-4" onClick={() => navigate("/my-builds")}>
            Back to Builds
          </button>
          <BuildForm editId={id} />
        </>
      ) : (
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Create a New PC Build</h2>
          <BuildForm />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
