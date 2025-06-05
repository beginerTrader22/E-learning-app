import React, { useState, useEffect } from "react";
import {
  useGetBuildsQuery,
  useDeleteBuildMutation,
} from "../store/api/buildApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const MyBuilds = () => {
  const { data: builds = [], isLoading, refetch } = useGetBuildsQuery();
  const [deleteBuild] = useDeleteBuildMutation();
  const navigate = useNavigate();
  // Track which build was just updated to show notification
  const [justUpdatedId, setJustUpdatedId] = useState(null);
  const { user } = useSelector((state) => state.user);

  // Check URL param "updated" to highlight build just updated
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const updatedId = params.get("updated");
    if (updatedId) {
      setJustUpdatedId(updatedId);

      // Clear the param after 3 seconds so notification disappears
      setTimeout(() => {
        setJustUpdatedId(null);
        // Optionally remove updated param from URL without reload
        params.delete("updated");
        const newUrl =
          window.location.pathname +
          (params.toString() ? `?${params.toString()}` : "");
        window.history.replaceState({}, "", newUrl);
      }, 3000);
    }
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteBuild(id).unwrap();
      toast.success("Build deleted");
      refetch();
    } catch {
      toast.error("Error deleting build");
    }
  };

  const handleEdit = (id) => {
    // Navigate to dashboard with edit param to open BuildForm for that build
    navigate(`/?edit=${id}`);
  };

  if (isLoading) return <p>Loading builds...</p>;

  if (builds.length === 0) return <p>No builds created yet.</p>;

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-bold mb-4">
        Welcome, {user?.name || "User"}!
      </h2>
      {builds.map((build) => (
        <div
          key={build._id}
          className={`p-4 border rounded shadow ${
            justUpdatedId === build._id ? "border-green-500 bg-green-100" : ""
          }`}
        >
          <p>
            <strong>Score:</strong> {build.score}
          </p>
          <ul className="list-disc list-inside">
            {Object.entries(build.parts).map(([type, part]) => (
              <li key={type}>
                <strong>{type.toUpperCase()}:</strong> {part.name || part}
              </li>
            ))}
          </ul>
          {justUpdatedId === build._id && (
            <p className="text-green-700 font-semibold mt-2">
              Build updated successfully!
            </p>
          )}
          <div className="mt-2 space-x-2">
            <button onClick={() => handleEdit(build._id)} className="btn">
              Edit
            </button>
            <button
              onClick={() => handleDelete(build._id)}
              className="btn btn-danger"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyBuilds;
