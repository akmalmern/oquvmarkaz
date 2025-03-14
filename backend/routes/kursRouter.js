const express = require("express");
const { isAuthenticated, isAdmin } = require("../middlware/isAuth");
const {
  addKurs,
  getKurs,
  updateKurs,
  deleteKurs,
} = require("../conteroller/kursController.js");
const router = express.Router();

router.post("/add-kurs", isAuthenticated, isAdmin, addKurs);
router.get("/kurslar", getKurs);
router.put("/update-kurs/:id", isAuthenticated, isAdmin, updateKurs);
router.delete("/delete-kurs/:id", isAuthenticated, isAdmin, deleteKurs);

module.exports = router;
