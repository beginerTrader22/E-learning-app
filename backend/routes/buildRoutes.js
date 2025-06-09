const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createBuild,
  getBuilds,
  deleteBuild,
  updateBuild,
  getOtherUsersBuilds
} = require('../controllers/buildController');

router.route('/').post(protect, createBuild).get(protect, getBuilds);
router.route('/:id').delete(protect, deleteBuild).put(protect, updateBuild);
router.get('/others', protect, getOtherUsersBuilds);

module.exports = router;
