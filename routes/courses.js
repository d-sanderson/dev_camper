const express = require('express');
const {
  getCourses
} = require('../controllers/courses');

const router = express.Router({mergeParams: true});
// GET ALL BOOTCAMPS FROM THE DB

// CRUD Routes
router
  .route('/')
  .get(getCourses)

module.exports = router;
