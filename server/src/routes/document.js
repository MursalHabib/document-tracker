const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize");
const controller = require("../controllers/docsController");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (
      file.mimetype === "image/jpeg" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/png"
    ) {
      cb(null, "./public/uploads");
    } else if (file.mimetype === "application/pdf") {
      cb(null, "./public/uploads");
    } else {
      console.log(file.mimetype);
      cb({ error: "Mime type not supported" });
    }
  },
  filename: (req, file, cb) => {
    cb(
      null,
      path.parse(file.originalname).name +
        "-" +
        Date.now() +
        path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.post("/create", authorize, controller.createDocument);
router.get("/documents", authorize, controller.getAllDocuments);
router.put("/update/:id", authorize, controller.updateDocument);
router.delete("/delete/:id", authorize, controller.deleteDocument);
router.post("/upload", upload.single("file"), controller.uploadFile);
router.get("/files", controller.getAllFiles);
router.get("/files/:id", controller.getOneFile);
router.delete("/files/delete", controller.deleteFiles);
router.get("/search/files", controller.searchFiles);

module.exports = router;
