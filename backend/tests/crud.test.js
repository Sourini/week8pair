const mongoose = require("mongoose");
const supertest = require("supertest");
const app = require("../app");
const api = supertest(app);
const Property = require("../models/propertyModel");
const User = require("../models/userModel");
require("dotenv").config();

let token;

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

const testUser = {
  name: "Property Tester",
  email: "propertytester@example.com",
  password: "R3g5T7#gh123",
  phoneNumber: "09-123-4567",
  profilePicture: "https://example.com/profile.jpg",
  gender: "Male",
  dateOfBirth: "1990-01-01",
  role: "user",
  address: {
    street: "123 Test St",
    city: "Testville",
    state: "TS",
    zipCode: "12345",
  },
};

const propertiesInDb = async () => {
  const properties = await Property.find({});
  return properties.map((p) => p.toJSON());
};

beforeEach(async () => {
  await Property.deleteMany({});
  await User.deleteMany({});

  await Property.insertMany(initialProperties);

  await api.post("/api/users/signup").send(testUser).expect(201);

  const loginResponse = await api
    .post("/api/users/login")
    .send({
      email: testUser.email,
      password: testUser.password,
    })
    .expect(200);

  token = loginResponse.body.token;
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
    .set("Authorization", `Bearer ${token}`)
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

  await api
    .delete(`/api/properties/${propertyToDelete.id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204);

  const propertiesAtEnd = await propertiesInDb();
  expect(propertiesAtEnd).toHaveLength(initialProperties.length - 1);
  expect(propertiesAtEnd.map((p) => p.title)).not.toContain(
    propertyToDelete.title
  );
});

// update property test
it("should update a property with status 200", async () => {
  const propertiesAtStart = await propertiesInDb();
  const propertyToUpdate = propertiesAtStart[0];

  const updatedProperty = {
    title: propertyToUpdate.title,
    type: "Updated Property type",
    description: propertyToUpdate.description,
    price: propertyToUpdate.price,
    location: propertyToUpdate.location,
    squareFeet: propertyToUpdate.squareFeet,
    yearBuilt: propertyToUpdate.yearBuilt,
    bedrooms: propertyToUpdate.bedrooms,
  };

  await api
    .put(`/api/properties/${propertyToUpdate.id}`)
    .set("Authorization", `Bearer ${token}`)
    .send(updatedProperty)
    .expect(200);

  const propertiesAtEnd = await propertiesInDb();

  const updated = propertiesAtEnd.find((p) => p.id === propertyToUpdate.id);

  expect(updated).toBeDefined();
  expect(updated.type).toBe("Updated Property type");
});

// unauthorized create test
it("should return 401 when creating a property without a token", async () => {
  const newProperty = {
    title: "unauthorized property",
    type: "Apartment",
    description: "should not be created",
    price: 99999,
    location: {
      address: "999 No Auth St",
      city: "Blocked",
      state: "NA",
    },
    squareFeet: 1000,
    yearBuilt: 2020,
    bedrooms: 2,
  };

  await api.post("/api/properties").send(newProperty).expect(401);
});

// unauthorized update test
it("should return 401 when updating a property without a token", async () => {
  const propertiesAtStart = await propertiesInDb();
  const propertyToUpdate = propertiesAtStart[0];

  const updatedProperty = {
    title: propertyToUpdate.title,
    type: "Blocked Update",
    description: propertyToUpdate.description,
    price: propertyToUpdate.price,
    location: propertyToUpdate.location,
    squareFeet: propertyToUpdate.squareFeet,
    yearBuilt: propertyToUpdate.yearBuilt,
    bedrooms: propertyToUpdate.bedrooms,
  };

  await api
    .put(`/api/properties/${propertyToUpdate.id}`)
    .send(updatedProperty)
    .expect(401);
});

// unauthorized delete test
it("should return 401 when deleting a property without a token", async () => {
  const propertiesAtStart = await propertiesInDb();
  const propertyToDelete = propertiesAtStart[0];

  await api.delete(`/api/properties/${propertyToDelete.id}`).expect(401);
});