const getStatuses = (req, res, next) => {
  res.status(200).json({
    meta: {
      total: 0,
    },
    results: {},
  });
};

module.exports = {
  getStatuses,
};
