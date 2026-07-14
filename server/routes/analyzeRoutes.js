const express = require("express");
const router = express.Router();

const controller = require("../controllers/analyzeController");

router.post("/analyze", controller.analyzeWebsite);
router.get("/reports", controller.getReports);
router.get("/reports/:id", controller.getReportById);

module.exports = router;