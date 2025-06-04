// routes/partRoutes.js
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getParts,
  getPartById
} = require('../controllers/partController');

router.get('/', protect, getParts);
router.get('/:id', protect, getPartById);

module.exports = router;