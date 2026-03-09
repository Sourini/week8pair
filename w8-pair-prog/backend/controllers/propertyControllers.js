const Property = require("../models/propertyModel");
const mongoose = require("mongoose");

// GET /api/properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: "Error fetching properties" });
  }
};

// POST /api/properties
const createProperty = async (req, res) => {
  try {
    const newProperty = await Property.create({ ...req.body });
    res.status(201).json(newProperty);
  } catch (error) {
    res.status(400).json({ message: "Error creating property" });
  }
  res.status(500).json({ message: "Server error" });
};

// GET /api/properties/:propertyId
const getPropertyById = async (req, res) => {
  const { propertyId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }
  try {
    const property = await Property.findById(propertyId);
    if (property) {
      res.status(200).json(property);
    } else {
      res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch property" });
  }
};

// DELETE /api/properties/:propertyId
const deleteProperty = async (req, res) => {
  const { propertyId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }
  try {
    const deleteProperty = await Property.findByIdAndDelete(propertyId);
    if (deleteProperty) {
      res.status(204).send();
    } else {
      res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Failed to delete property" });
  }
};

module.exports = {
  getAllProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
