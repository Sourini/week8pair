import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getPropertyById, updateProperty } from "../services/propertyService";

const EditPropertyPage = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [type, setType] = useState("Apartment");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [squareFeet, setSquareFeet] = useState("");
  const [yearBuilt, setYearBuilt] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const property = await getPropertyById(propertyId);

        setTitle(property.title || "");
        setType(property.type || "Apartment");
        setDescription(property.description || "");
        setPrice(property.price || "");
        setAddress(property.location?.address || "");
        setCity(property.location?.city || "");
        setState(property.location?.state || "");
        setSquareFeet(property.squareFeet || "");
        setYearBuilt(property.yearBuilt || "");
        setBedrooms(property.bedrooms || "");
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId]);

  const submitForm = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const updatedProperty = {
      title,
      type,
      description,
      price: Number(price),
      location: {
        address,
        city,
        state,
      },
      squareFeet: Number(squareFeet),
      yearBuilt: Number(yearBuilt),
      bedrooms: Number(bedrooms),
    };

    try {
      await updateProperty(propertyId, updatedProperty);
      navigate(`/properties/${propertyId}`);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Loading property...</p>;

  return (
    <div className="create">
      <h2>Update Property</h2>

      {error && <p>{error}</p>}

      <form onSubmit={submitForm}>
        <label>Title:</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Type:</label>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Apartment">Apartment</option>
          <option value="House">House</option>
          <option value="Commercial">Commercial</option>
        </select>

        <label>Description:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Price:</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />

        <label>Street Address:</label>
        <input value={address} onChange={(e) => setAddress(e.target.value)} required />

        <label>City:</label>
        <input value={city} onChange={(e) => setCity(e.target.value)} required />

        <label>State:</label>
        <input value={state} onChange={(e) => setState(e.target.value)} required />

        <label>Square Feet:</label>
        <input
          type="number"
          value={squareFeet}
          onChange={(e) => setSquareFeet(e.target.value)}
          required
        />

        <label>Year Built:</label>
        <input
          type="number"
          value={yearBuilt}
          onChange={(e) => setYearBuilt(e.target.value)}
          required
        />

        <label>Bedrooms:</label>
        <input
          type="number"
          value={bedrooms}
          onChange={(e) => setBedrooms(e.target.value)}
          required
        />

        <button disabled={isSubmitting}>
          {isSubmitting ? "Updating..." : "Update Property"}
        </button>
      </form>
    </div>
  );
};

export default EditPropertyPage;