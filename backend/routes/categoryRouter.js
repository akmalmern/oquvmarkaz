const express = require("express");
const {
  addCategory,
  getCategory,
  deletCategory,
  updateCategory,
} = require("../conteroller/categoryController");
const { isAuthenticated, isAdmin } = require("../middlware/isAuth");
const router = express.Router();

router.post("/add-category", isAuthenticated, isAdmin, addCategory);
router.get("/categories", getCategory);
router.delete("/delete-category/:id", isAuthenticated, isAdmin, deletCategory);
router.put("/update-category/:id", isAuthenticated, isAdmin, updateCategory);

module.exports = router;
