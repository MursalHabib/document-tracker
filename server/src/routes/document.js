const express = require("express");
const router = express.Router();
const authorize = require("../middleware/authorize");
const controller = require("../controllers/docsController");

router.post("/create", authorize, controller.createDocument);
router.get("/documents", authorize, controller.getAllDocuments);
router.put("/update/:id", authorize, controller.updateDocument);
router.delete("/delete/:id", authorize, controller.deleteDocument);

module.exports = router;
