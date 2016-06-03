module.exports = function(err, req, res) {
  res.status(500).json({message: err.message});
};
