const Property = require("../models/propertyModel");
const mongoose = require("mongoose");

// GET /api/properties
const getAllProperties = async (req, res) => {
  try {
    const properties = await Property.find({}).sort({ createdAt: -1 });
    return res.status(200).json(properties);
  } catch (error) {
    return res.status(500).json({ message: "Error fetching properties" });
  }
};

// POST /api/properties
const createProperty = async (req, res) => {
  try {
    const newProperty = await Property.create({ ...req.body });
    return res.status(201).json(newProperty);
  } catch (error) {
    return res.status(400).json({ message: "Error creating property" });
  }
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
      return res.status(200).json(property);
    } else {
      return res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to fetch property" });
  }
};

// PUT /api/properties/:propertyId
const updateProperty = async (req, res) => {
  const { propertyId } = req.params;
  if (!mongoose.Types.ObjectId.isValid(propertyId)) {
    return res.status(400).json({ message: "Invalid property ID" });
  }
  try {
    const updatedProperty = await Property.findOneAndUpdate(
      { _id: propertyId },
      { ...req.body },
      { returnDocument: "after" }
    );
    if (updatedProperty) {
      res.status(200).json(updatedProperty);
    } else {
      return res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to update property" });
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
      return res.status(204).send();
    } else {
      return res.status(404).json({ message: "Property not found" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete property" });
  }
};

module.exports = {
  getAllProperties,
  createProperty,
  getPropertyById,
  updateProperty,
  deleteProperty,
};
