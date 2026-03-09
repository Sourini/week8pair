import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPropertyById } from "../services/propertyService";
import { isAuthenticated } from "../services/auth";

const ViewPropertyPage = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const data = await getPropertyById(propertyId);
        setProperty(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  if (loading) return <p>Loading property...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!property) return <p>Property not found.</p>;

  return (
    <div>
      <h2>{property.title}</h2>
      <p>Type: {property.type}</p>
      <p>Price: ${property.price}</p>
      <p>Description: {property.description}</p>
      <p>
        Address: {property.location?.address}, {property.location?.city},{" "}
        {property.location?.state}
      </p>
      <p>Square Feet: {property.squareFeet}</p>
      <p>Year Built: {property.yearBuilt}</p>
      <p>Bedrooms: {property.bedrooms}</p>

      {isAuthenticated() && (
        <Link to={`/properties/${property.id}/edit`}>
          <button type="button">Edit Property</button>
        </Link>
      )}
    </div>
  );
};

export default ViewPropertyPage;