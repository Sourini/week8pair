import { getToken } from "./auth";

const getAuthHeaders = () => {
  const token = getToken();

  return token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    : {
        "Content-Type": "application/json",
      };
};

export const getAllProperties = async () => {
  const response = await fetch("/api/properties");

  if (!response.ok) {
    throw new Error("Failed to fetch properties");
  }

  return response.json();
};

export const getPropertyById = async (propertyId) => {
  const response = await fetch(`/api/properties/${propertyId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch property");
  }

  return response.json();
};

export const createProperty = async (propertyData) => {
  const response = await fetch("/api/properties", {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(propertyData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to create property");
  }

  return response.json();
};

export const updateProperty = async (propertyId, propertyData) => {
  const response = await fetch(`/api/properties/${propertyId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(propertyData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to update property");
  }

  return response.json();
};

export const deleteProperty = async (propertyId) => {
  const response = await fetch(`/api/properties/${propertyId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || errorData.message || "Failed to delete property");
  }
};