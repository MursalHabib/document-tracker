const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize");
const controller = require("../controllers/docsController");
const multer = require("multer");

const upload = multer({ dest: "uploads/" });

router.post("/create", authorize, controller.createDocument);
router.get("/documents", authorize, controller.getAllDocuments);
router.put("/update/:id", authorize, controller.updateDocument);
router.delete("/delete/:id", authorize, controller.deleteDocument);
router.post("/upload", authorize, upload.single("file"), controller.uploadFile);
router.get("/files", authorize, controller.getAllFiles);

module.exports = router;
