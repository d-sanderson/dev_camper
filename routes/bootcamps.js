const express = require('express');
const {
  getBootcamps,
  getBootcamp,
  createBootcamp,
  updateBootcamp,
  deleteBootcamp,
  getBootcampsInRadius,
} = require('../controllers/bootcamps');

const router = express.Router();
// GET ALL BOOTCAMPS FROM THE DB

// CRUD Routes
router
  .route('/')
  .get(getBootcamps)
  .post(createBootcamp);

router
  .route('/:id')
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

// Geocode Route
router.route('/radius/:zipcode/:distance').get(getBootcampsInRadius);
module.exports = router;
