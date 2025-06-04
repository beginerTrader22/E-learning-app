import React, { useState } from "react";
import {
  useGetBuildsQuery,
  useDeleteBuildMutation,
  useUpdateBuildMutation,
} from "../store/api/buildApi";
import BuildForm from "./BuildForm";
import { toast } from "react-toastify";

const MyBuilds = () => {
  const { data: builds = [], isLoading, refetch } = useGetBuildsQuery();
  const [deleteBuild] = useDeleteBuildMutation();
  const [updateBuild] = useUpdateBuildMutation();
  const [editingBuild, setEditingBuild] = useState(null);

  const handleDelete = async (id) => {
    try {
      await deleteBuild(id).unwrap();
      toast.success("Build deleted");
      refetch();
    } catch {
      toast.error("Error deleting build");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">My Builds</h2>

      {editingBuild && (
        <BuildForm
          editingBuild={editingBuild}
          setEditingBuild={setEditingBuild}
          onBuildCreated={refetch}
        />
      )}

      {isLoading ? (
        <p>Loading builds...</p>
      ) : builds.length === 0 ? (
        <p>No builds created yet.</p>
      ) : (
        <div className="grid gap-4">
          {builds.map((build) => (
            <div key={build._id} className="p-4 border rounded shadow">
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
              <div className="mt-2 space-x-2">
                <button onClick={() => setEditingBuild(build)} className="btn">
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
      )}
    </div>
  );
};

export default MyBuilds;
