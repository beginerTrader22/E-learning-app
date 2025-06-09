// OtherUsersBuilds.js
import React from "react";
import { useGetOtherUsersBuildsQuery } from "../store/api/buildApi";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import "../MyBuilds.css";

const OtherUsersBuilds = () => {
  const { data: builds = [], isLoading } = useGetOtherUsersBuildsQuery();
  const { user } = useSelector((state) => state.user);

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
        <h2>Nuk ka kompjutera të studentëve të tjerë</h2>
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
        Kompjuterat e studentëve të tjerë
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
              className="build-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="build-owner">
                <span>Krijuar nga: </span>
                <span className="owner-name">{build.user.name}</span>
              </div>

              <img
                src="https://www.memorypc.eu/media/0c/98/4a/1745838104/563472-05-1745838101-secondlast-1745838102.webp"
                alt="PC build"
                className="build-image"
              />

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
                      transition={{ delay: 0.2 + index * 0.05 }}
                    >
                      <span className="part-type">{type.toUpperCase()}:</span>
                      <span className="part-name">{part.name || part}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default OtherUsersBuilds;
