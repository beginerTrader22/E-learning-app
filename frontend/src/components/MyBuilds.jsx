import React, { useState, useEffect } from "react";
import {
  useGetBuildsQuery,
  useDeleteBuildMutation,
} from "../store/api/buildApi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";

const MyBuilds = () => {
  const { data: builds = [], isLoading, refetch } = useGetBuildsQuery();
  const [deleteBuild] = useDeleteBuildMutation();
  const navigate = useNavigate();
  const [justUpdatedId, setJustUpdatedId] = useState(null);
  const [updatedPart, setUpdatedPart] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState({});
  const { user } = useSelector((state) => state.user);

  // Check URL param "updated" to highlight build just updated
  // Check URL param "updated" to highlight build just updated
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const updatedId = params.get("updated");
    const updatedPartParam = params.get("updatedPart");

    if (updatedId) {
      setJustUpdatedId(updatedId);
      if (updatedPartParam) {
        // Split the parts by comma to get an array
        setUpdatedPart(updatedPartParam.split(","));
      }

      setTimeout(() => {
        setJustUpdatedId(null);
        setUpdatedPart(null);
        params.delete("updated");
        params.delete("updatedPart");
        const newUrl =
          window.location.pathname +
          (params.toString() ? `?${params.toString()}` : "");
        window.history.replaceState({}, "", newUrl);
      }, 3000);
    }
  }, []);

  // Preload images for all builds
  useEffect(() => {
    if (!builds || builds.length === 0) return;

    const loadStatus = {};
    builds.forEach((build) => {
      loadStatus[build._id] = false;
      const img = new Image();
      img.src =
        "https://www.memorypc.eu/media/0c/98/4a/1745838104/563472-05-1745838101-secondlast-1745838102.webp";
      img.onload = () => {
        loadStatus[build._id] = true;
        setImagesLoaded({ ...loadStatus });
      };
      img.onerror = () => {
        loadStatus[build._id] = true;
        setImagesLoaded({ ...loadStatus });
      };
    });
  }, [builds]);

  const handleDelete = async (id) => {
    try {
      await deleteBuild(id).unwrap();
      toast.success("Kompiuteri u fshi me sukses");
      refetch();
    } catch {
      toast.error("Pati error");
    }
  };

  const handleEdit = (id) => {
    // Wait for images to load before navigating
    if (imagesLoaded[id]) {
      navigate(`/?edit=${id}`);
    }
  };

  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Duke ngarkuar...</p>
      </div>
    );
  }

  if (builds.length === 0) {
    return (
      <motion.div
        className="empty-state"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h2>Nuk keni krijuar asnjë kompiuter akoma</h2>
        <p>Fillo duke krijuar kompiuterin tënd të parë</p>
        <button onClick={() => navigate("/")} className="btn-primary">
          Krijo Kompiuter
        </button>
      </motion.div>
    );
  }

  return (
    <div className="builds-container">
      <motion.h2
        className="welcome-heading"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Mirë se vini, {user?.name || "User"}!
      </motion.h2>

      <motion.div
        className="builds-grid"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <AnimatePresence>
          {builds.map((build, index) => (
            <motion.div
              key={build._id}
              className={`build-card ${
                justUpdatedId === build._id ? "updated" : ""
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              {!imagesLoaded[build._id] ? (
                <div className="image-placeholder">
                  <div className="loading-spinner small"></div>
                </div>
              ) : (
                <motion.img
                  src="https://www.memorypc.eu/media/0c/98/4a/1745838104/563472-05-1745838101-secondlast-1745838102.webp"
                  alt="PC build"
                  className="build-image"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                />
              )}

              <div className="build-content">
                <div className="build-score">
                  <span>Pikët: </span>
                  <span className="score-value">{build.score}</span>
                </div>

                <ul className="parts-list">
                  {Object.entries(build.parts).map(([type, part]) => (
                    <motion.li
                      key={type}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.2 + index * 0.05,
                        ...(justUpdatedId === build._id && updatedPart === type
                          ? {
                              repeat: 3,
                              repeatType: "reverse",
                              duration: 0.5,
                            }
                          : {}),
                      }}
                      className={
                        justUpdatedId === build._id &&
                        updatedPart?.includes(type)
                          ? "part-item highlighted-part"
                          : "part-item"
                      }
                    >
                      <span className="part-type">{type.toUpperCase()}:</span>
                      <span className="part-name">{part.name || part}</span>
                    </motion.li>
                  ))}
                </ul>
                <div className="build-actions">
                  <motion.button
                    onClick={() => handleEdit(build._id)}
                    className="btn-edit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!imagesLoaded[build._id]}
                  >
                    {imagesLoaded[build._id]
                      ? "Ndrysho pjesët"
                      : "Duke u ngarkuar..."}
                  </motion.button>
                  <motion.button
                    onClick={() => handleDelete(build._id)}
                    className="btn-delete"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Fshi
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default MyBuilds;
