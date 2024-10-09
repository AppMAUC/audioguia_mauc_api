const Exposition = require("../models/Exposition");
const ArtWork = require("../models/ArtWork");
const Artist = require("../models/Artist");

const searchGeneral = async (req, res, next) => {
  try {
    const query = req.query.q || ""; // Query de busca
    const page = parseInt(req.query.page) || 1; // Página atual (default 1)
    const limit = parseInt(req.query.limit) || 10; // Itens por página (default 10)

    // Calculando os valores de paginação
    const skip = (page - 1) * limit;

    // Realizando a busca nos três modelos
    const searchQuery = { $text: { $search: query } };
    const projection = { score: { $meta: "textScore" } };

    // Pegar os dados de cada modelo
    const [dataModel1, dataModel2, dataModel3] = await Promise.all([
      ArtWork.find(searchQuery, projection)
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(limit),
      Artist.find(searchQuery, projection)
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(limit),
      Exposition.find(searchQuery, projection)
        .sort({ score: { $meta: "textScore" } })
        .skip(skip)
        .limit(limit),
    ]);

    // Unindo os dados
    const data = [...dataModel1, ...dataModel2, ...dataModel3];

    // Contagem total de itens em cada modelo
    const [countModel1, countModel2, countModel3] = await Promise.all([
      ArtWork.countDocuments(searchQuery),
      Artist.countDocuments(searchQuery),
      Exposition.countDocuments(searchQuery),
    ]);

    const totalItems = countModel1 + countModel2 + countModel3;
    const totalPages = Math.ceil(totalItems / limit);

    // Informações de paginação
    const pagination = {
      first: 1,
      prev: page > 1 ? page - 1 : null,
      next: page < totalPages ? page + 1 : null,
      last: totalPages,
      pages: totalPages,
      items: totalItems,
      data,
    };

    res.status(200).json(pagination);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchGeneral,
};
