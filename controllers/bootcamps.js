  // @desc Show all bootcamps
  // @route /api/v1/bootcamps
  // @access public
exports.getBootcamps = (req, res, next) => {
  res.status(200).send({ success: true, message: 'Show all bootcamps'});
}
  // @desc Get one bootcamps
  // @route /api/v1/bootcamp/:id
  // @access public
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: 'get a bootcamp', id: req.params.id });
}

exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: 'create a new bootcamp' });
}

exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: `Update bootcamp ${req.params.id}` });
}

exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, message: `Delete bootcamp ${req.params.id}` });
}