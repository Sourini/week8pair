import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const ViewPropertyPage = () => {
  const { propertyId } = useParams();
  const [property, setProperty] = useState(null);

  useEffect(() => {
    const fetchProperty = async () => {
      const response = await fetch(`/api/properties/${propertyId}`);
      const data = await response.json();
      setProperty(data);
    };

    fetchProperty();
  }, [propertyId]);

  if (!property) return <p>Loading property...</p>;

  return (
    <div>
      <h2>{property.title}</h2>
      <p>Type: {property.type}</p>
      <p>Price: ${property.price}</p>
      <p>Description: {property.description}</p>
      <p>
        Location: {property.location?.address}, {property.location?.city},{" "}
        {property.location?.state}
      </p>
      <p>Bedrooms: {property.bedrooms}</p>
      <p>Square Feet: {property.squareFeet}</p>
      <p>Year Built: {property.yearBuilt}</p>
    </div>
  );
};

export default ViewPropertyPage;