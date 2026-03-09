const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Property = require("../models/propertyModel");
require("dotenv").config();


beforeAll(async () => {
  await mongoose.connect(process.env.TEST_MONGO_URI);
});

const initialProperties = [
  {
    title: "test property 1",
    type: "type description",
    description: "property description 1",
    price: 100000,
    location: {
      address: "123 Main St",
      city: "Anytown",
      state: "CA",
    },
    squareFeet: 1500,
    yearBuilt: 1990,
    bedrooms: 3,
  },
];

const propertiesInDb = async () => {
  const properties = await Property.find({});
  return properties.map((p) => p.toJSON());
};

beforeEach(async () => {
  await Property.deleteMany({});
  await Property.insertMany(initialProperties);
});

afterAll(async () => {
  await mongoose.connection.close();
});

// get all properties test
it("should return properties in JSON with status 200", async () => {
  await api
    .get("/api/properties")
    .expect(200)
    .expect("Content-Type", /application\/json/);
});

// create property test
it("should create a new property with status 201", async () => {
  const newProperty = {
    title: "test property 2",
    type: "type description 2",
    description: "property description 2",
    price: 150000,
    location: {
      address: "456 Oak Ave",
      city: "Somewhere",
      state: "NY",
    },
    squareFeet: 2000,
    yearBuilt: 2000,
    bedrooms: 4,
  };

  await api
    .post("/api/properties")
    .send(newProperty)
    .expect(201)
    .expect("Content-Type", /application\/json/);

  const response = await api.get("/api/properties");
  expect(response.body).toHaveLength(initialProperties.length + 1);
});

// delete property test
it("should delete a property with status 204", async () => {
  const propertiesAtStart = await propertiesInDb();
  const propertyToDelete = propertiesAtStart[0];

  await api.delete(`/api/properties/${propertyToDelete.id}`).expect(204);

  const propertiesAtEnd = await propertiesInDb();
  expect(propertiesAtEnd).toHaveLength(initialProperties.length - 1);
  expect(propertiesAtEnd.map((p) => p.title)).not.toContain(propertyToDelete.title);
});

// update property test
it("should update a property with status 200", async () => {
  const propertiesAtStart = await propertiesInDb();
  const propertyToUpdate = propertiesAtStart[0];

  const updatedProperty = {
    ...propertyToUpdate,
    type: "Updated Property type",
  };

  await api
    .put(`/api/properties/${propertyToUpdate.id}`)
    .send(updatedProperty)
    .expect(200);

  const propertiesAtEnd = await propertiesInDb();
  const updated = propertiesAtEnd.find((p) => p.id === propertyToUpdate.id);

  expect(updated.type).toBe("Updated Property type");
});