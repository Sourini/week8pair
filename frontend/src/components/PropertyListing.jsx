import { Link } from "react-router-dom";

const PropertyListing = ({ property, onDelete }) => {
  const propertyId = property.id || property._id;

  return (
    <div className="rental-preview">
      <h2>{property.title}</h2>
      <p>Type: {property.type}</p>
      <p>Price: ${property.price}</p>
      <p>
        Location: {property.location?.city}, {property.location?.state}
      </p>
      <p>Bedrooms: {property.bedrooms}</p>

      <div className="property-actions">
        <Link to={`/properties/${propertyId}`}>
          <button type="button">View</button>
        </Link>

        <Link to={`/properties/${propertyId}/edit`}>
          <button type="button">Edit</button>
        </Link>

        <button type="button" onClick={() => onDelete(propertyId)}>
          Delete
        </button>
      </div>
    </div>
  );
};

export default PropertyListing;