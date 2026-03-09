import { useState, useEffect } from "react";
import PropertyListing from "./PropertyListing";

const PropertyListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties");

        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }

        const data = await response.json();
        setProperties(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (propertyId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this property?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`/api/properties/${propertyId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete property");
      }

      setProperties((prevProperties) =>
        prevProperties.filter(
          (property) => (property.id || property._id) !== propertyId
        )
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <p>Loading properties...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="rental-list">
      {properties.map((property) => (
        <PropertyListing
          key={property.id || property._id}
          property={property}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};

export default PropertyListings;