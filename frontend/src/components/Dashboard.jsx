import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import BuildForm from "./BuildForm";
import { IoMdArrowRoundBack } from "react-icons/io";
const Dashboard = () => {
  const [searchParams] = useSearchParams();
  const id = searchParams.get("edit");
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      {id ? (
        <div className="edit-build-container">
          <div className="edit-build-header">
            <h2 className="edit-build-title">Ndrysho Pjeset</h2>
            <button
              className="back-button"
              onClick={() => navigate("/my-builds")}
            >
              <IoMdArrowRoundBack />
              Kompiuterat e mi
            </button>
          </div>
          <BuildForm editId={id} />
        </div>
      ) : (
        <div className="new-build-container">
          <h2 className="new-build-title">Krijo nje Kompiuter te Ri</h2>
          <BuildForm />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
