const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const geocoder = require('../utils/geocoder');

// @desc Create a new bootcamp
// @route /api/v1/bootcamps
// @access user reqd
exports.createBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.create(req.body);
    res.status(201).json({
      success: true,
      data: bootcamp,
    });
  });

// @desc Show all bootcamps
// @route /api/v1/bootcamps
// @access public
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  // initialize query variable.
  let query;

  // copy req.query
  const reqQuery = { ...req.query };

  //  Fields to exclude
  const removeFields = ['select', 'sort', 'page', 'limit'];

  //  Loop over removeFields and delete them from reqQuery
  removeFields.forEach(param => delete reqQuery[param]);
  console.log(reqQuery)

  //  Create query string
  let queryStr = JSON.stringify(reqQuery);

  // Create operators ($gt, $gte, etc)
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  //  Query the db
  query = Bootcamp.find(JSON.parse(queryStr));

  //  Select fields
  if(req.query.select) {
    const fields = req.query.select.split(',').join(' ');
    query = query.select(fields)
  }

  //  Sort
  if(req.query.sort) {
    const sortBy = req.query.sort.split(',').join(' ')
    query = query.sort(sortBy)
  }
  else {
    query = query.sort('-createdAt')
  }


  //  Pagination
  const page = parseInt(req.query.page, 10) || 1; // page one is the default
  const limit = parseInt(req.query.limit, 10) || 1;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.find(JSON.parse(queryStr)).countDocuments();

  query = query.skip(startIndex).limit(limit);
  //  Executing query
  const bootcamps = await query;

  // Pagination result
  const pagination = {};

  if(endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit: limit
    }
  }

  if(startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit: limit
    }
  }
  res.status(200).json({
    success: true,
    pagination,
    count: bootcamps.length,
    data: bootcamps,

  });
});

// @desc Get one bootcamps
// @route /api/v1/bootcamp/:id
// @access public
exports.getBootcamp = asyncHandler(async (req, res, next) => {

    const bootcamp = await Bootcamp.findById(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: bootcamp });

});

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: bootcamp })

  });

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Resource not found with id of ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ success: true, data: {} });
});

// @ desc   Get bootcamps within a radius
// @ route  GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  //Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode)
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calculate radius using radians
  // Divide distance by radius of Earth
  // Radius of Earth = 3,963 mi / 6,378 km
  const miles = 3963
  const radius = distance / miles
  const bootcamps = await Bootcamp.find({
    location: {$geoWithin: { $centerSphere: [[lng, lat], radius ]} }
  });

  res.status(200).json({
    success: true,
    count: bootcamps.length,
    data: bootcamps,
  })

});
