import { Link } from "react-router-dom";

const PropertyListing = ({ property, onDelete, canManage }) => {
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
        <Link to={`/properties/${property.id}`}>
          <button type="button">View</button>
        </Link>

        {canManage && (
          <>
            <Link to={`/properties/${property.id}/edit`}>
              <button type="button">Edit</button>
            </Link>

            <button type="button" onClick={() => onDelete(property.id)}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default PropertyListing;