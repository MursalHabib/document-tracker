const { Documents, Users, Files } = require("../../db/models");
const { Op } = require("sequelize");

module.exports = {
  createDocument: async (req, res) => {
    const { title, type, pic, position, info, status } = req.body;
    try {
      const document = await Documents.create({
        title,
        type,
        pic,
        position,
        info,
        status,
      });
      return res.status(201).json({ message: "Document Created...", document });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  getAllDocuments: async (req, res) => {
    try {
      const documents = await Documents.findAll();
      return res.json(documents);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  },

  updateDocument: async (req, res) => {
    const { title, pic, position, type, info, status } = req.body;
    const id = req.params.id;
    try {
      await Documents.update(
        { title, type, pic, position, info, status },
        { where: { id } }
      );
      return res.json({ message: "DATA BERHASIL DIUPDATE..." });
    } catch (error) {
      res.status(500).json({ message: error.message });
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
        return res.status(404).json({
          message: `TIDAK BERHASIL MENGHAPUS DATA DENGAN ID: ${id}`,
        });
      }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
  uploadFile: async (req, res) => {
    const fileUrl =
      req.protocol + "://" + req.get("host") + "/uploads/" + req.file.filename;
    try {
      const uploaded = await Files.create({
        title: req.body.title,
        nama_file: fileUrl,
      });
      res.status(201).json({
        message: "File uploaded",
        data: uploaded,
      });
    } catch (error) {
      res.status(404).json({ message: error.message });
    }
  },
  getAllFiles: async (req, res) => {
    try {
      const allFiles = await Files.findAll();
      return res.json(allFiles);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "SERVER ERROR" });
    }
  },
  getOneFile: async (req, res) => {
    const { id } = req.params;
    try {
      const singleFile = await Files.findByPk(id);
      if (singleFile) {
        res.send(singleFile);
      } else {
        res.status(404).send({
          message: `Cannot find File with id=${id}.`,
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "SERVER ERROR" });
    }
  },
  deleteFiles: async (req, res) => {
    const { id } = req.body;
    try {
      await Files.destroy({
        where: { id },
      });
      return res.json({ message: "DATA BERHASIL DIHAPUS..." });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "SERVER ERROR" });
    }
  },
  searchFiles: async (req, res) => {
    const { title } = req.query;
    try {
      const condition = title ? { title: { [Op.iLike]: `%${title}%` } } : null;
      const result = await Files.findAll({ where: condition });
      res.send(result);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "SERVER ERROR" });
    }
  },
};
