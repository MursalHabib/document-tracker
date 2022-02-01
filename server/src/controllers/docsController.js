const { Documents, Users } = require("../../db/models");
const { Op } = require("sequelize");

module.exports = {
  createDocument: async (req, res) => {
    const { title, type, pic, position, info } = req.body;
    try {
      const document = await Documents.create({
        title,
        type,
        pic,
        position,
        info,
      });
      return res.json({ message: "Document Created...", document });
    } catch (error) {
      res.status(500).json({ message: "SERVER ERROR" });
    }
  },

  getAllDocuments: async (req, res) => {
    try {
      const documents = await Documents.findAll();
      return res.json(documents);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "SERVER ERROR" });
    }
  },

  updateDocument: async (req, res) => {
    const { title, pic, position, type, info } = req.body;
    const id = req.params.id;
    try {
      await Documents.update(
        { title, type, pic, position, info },
        { where: { id } }
      );
      return res.json({ message: "DATA BERHASIL DIUPDATE..." });
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "SERVER ERROR :(" });
    }
  },
  deleteDocument: async (req, res) => {
    const id = req.params.id;
    try {
      const deleted = await Documents.destroy({
        where: { id },
      });
      if (deleted === 1) {
        return res.json({ message: "DATA BERHASIL DIHAPUS..." });
      } else {
        return res.json({
          message: `TIDAK BERHASIL MENGHAPUS DATA DENGAN ID: ${id}`,
        });
      }
    } catch (error) {
      console.error(error.message);
      res.status(500).json({ message: "SERVER ERROR :(" });
    }
  },
};
