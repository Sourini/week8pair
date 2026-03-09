const express = require("express");
const router = express.Router();
const requireAuth = require("../middleware/requireAuth");
const {
  getAllProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
} = require("../controllers/propertyControllers");

// GET /api/properties
router.get("/", getAllProperties);

// GET /api/properties/:propertyId
router.get("/:propertyId", getPropertyById);

// POST /api/properties
router.post("/", requireAuth, createProperty);

// PUT /api/properties/:propertyId
router.put("/:propertyId", requireAuth, updateProperty);

// DELETE /api/properties/:propertyId
router.delete("/:propertyId", requireAuth, deleteProperty);

module.exports = router;
