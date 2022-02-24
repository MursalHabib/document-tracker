const { Documents, Users, Files } = require("../../db/models");
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
      res.status(500).json({ message: error.message });
    }
  },

  getAllDocuments: async (req, res) => {
    try {
      const documents = await Documents.findAll();
      return res.json(documents);
    } catch (error) {
      res.status(500).json({ message: error.message });
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
    console.log(fileUrl);
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
      allFiles.forEach((e) => console.log(e.dataValues.nama_file));
      return res.json(allFiles);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "SERVER ERROR" });
    }
  },
};
