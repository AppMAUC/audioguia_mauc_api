const Exposition = require("../models/Exposition");
const ArtWork = require("../models/ArtWork");
const Artist = require("../models/Artist");
const { getDataWithPaginate } = require("../utils/paginate");

const searchGeneral = async (req, res, next) => {
  try {
    const data = await getDataWithPaginate([Exposition, ArtWork, Artist], req);
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchGeneral,
};
