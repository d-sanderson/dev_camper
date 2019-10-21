const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse')
// @desc Create a new bootcamp
// @route /api/v1/bootcamps
// @access user reqd
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  } catch (err) {
    next(err)
  }
};
// @desc Show all bootcamps
// @route /api/v1/bootcamps
// @access public
exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find({});
    res
      .status(200)
      .send({
        success: true,
        count: bootcamps.length,
        data: bootcamps
      });
  } catch (err) {
   next(err)
  }
};
// @desc Get one bootcamps
// @route /api/v1/bootcamp/:id
// @access public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      )
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    next(err)
  }
};

exports.updateBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      )
    }
    res.status(200).json({ success: true, data: bootcamp });
  } catch (err) {
    next(err)
  }
};

exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      )
    }
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    next(err)
  }
};
