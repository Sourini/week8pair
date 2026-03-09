import { BrowserRouter, Routes, Route } from "react-router-dom";

// pages & components
import Home from "./pages/HomePage";
import AddPropertyPage from "./pages/AddPropertyPage";
import Navbar from "./components/Navbar";
import NotFoundPage from "./pages/NotFoundPage";
import EditPropertyPage from "./pages/EditPropertyPage";
import PropertyPage from "./pages/PropertyPage";

const App = () => {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/add-property" element={<AddPropertyPage />} />
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/properties/:propertyId" element={<PropertyPage />} />
            <Route path="/properties/:propertyId/edit" element={<EditPropertyPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;
