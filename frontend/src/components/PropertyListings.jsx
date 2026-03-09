import { useState, useEffect } from "react";
import PropertyListing from "./PropertyListing";
import { getAllProperties, deleteProperty } from "../services/propertyService";
import { isAuthenticated } from "../services/auth";

const PropertyListings = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const data = await getAllProperties();
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
      await deleteProperty(propertyId);

      setProperties((prevProperties) =>
        prevProperties.filter((property) => property.id !== propertyId)
      );
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Loading properties...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="rental-list">
      {properties.map((property) => (
        <PropertyListing
          key={property.id}
          property={property}
          onDelete={handleDelete}
          canManage={isAuthenticated()}
        />
      ))}
    </div>
  );
};

export default PropertyListings;