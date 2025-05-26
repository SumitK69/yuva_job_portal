import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import SectorButton from "../components/SectorButton";
import Logo from "../components/Logo";
import { apiService, API_BASE_URL } from "@/Api/ApiService";

// Loading component
const LoadingSpinner = () => (
  <div className="flex justify-center items-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo_dye"></div>
  </div>
);

// Error component
const ErrorMessage = ({ message, onRetry }) => (
  <div className="text-center py-12">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
      <p className="text-red-600 mb-4">{message}</p>
      <button
        onClick={onRetry}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

const HomePage = () => {
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to transform API sector data to component format
  const transformSectorData = (apiSectors) => {
    return apiSectors.map((sector) => ({
      id: sector.id,
      name: sector.name,
      route: `/jobs/${sector.name.toLowerCase().replace(/\s+/g, "-")}`,
      image: `${API_BASE_URL}${sector.image}`,
    }));
  };
  console.log("Transformed sectors:", transformSectorData);

  // Function to fetch sectors
  const fetchSectors = async () => {
    try {
      setLoading(true);
      setError(null);

      const apiSectors = await apiService.fetchSectors();
      const transformedSectors = transformSectorData(apiSectors);
      console.log("Fetched and transformed sectors:", transformedSectors);
      setSectors(transformedSectors);
    } catch (err) {
      console.error("Failed to fetch sectors:", err);
      setError("Failed to load job sectors. Please try again.");
      setSectors([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch sectors on component mount
  useEffect(() => {
    fetchSectors();
  }, []);

  // Retry function
  const handleRetry = () => {
    fetchSectors();
  };

  return (
    <div className="flex flex-col min-h-screen bg-isabelline-800">
      <Header />
      <main className="flex-grow container mx-auto py-10 px-4">
        <section className="mb-10 text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-4xl font-bold text-gunmetal mb-4">
            Welcome to Yuva Load Service
          </h1>
          <p className="text-xl text-gunmetal-600 max-w-2xl mx-auto">
            Discover career opportunities across various sectors. Submit your
            application with just a few clicks.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gunmetal mb-6 text-center">
            Browse Jobs by Sector
          </h2>

          {loading ? (
            <LoadingSpinner />
          ) : error ? (
            <ErrorMessage message={error} onRetry={handleRetry} />
          ) : sectors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gunmetal-600 text-lg">
                No job sectors available at the moment.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {sectors.map((sector) => (
                <SectorButton
                  key={sector.id}
                  sector={sector.name}
                  route={sector.route}
                  image={sector.image}
                />
              ))}
            </div>
          )}
        </section>

        <section className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gunmetal mb-4">
            Why Choose Yuva Load Service?
          </h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-isabelline-800 p-5 rounded-md">
              <h3 className="text-xl font-medium text-indigo_dye mb-2">
                Diverse Opportunities
              </h3>
              <p className="text-gunmetal-600">
                Access jobs across multiple industries and sectors all in one
                place.
              </p>
            </div>
            <div className="bg-isabelline-800 p-5 rounded-md">
              <h3 className="text-xl font-medium text-indigo_dye mb-2">
                Simple Application
              </h3>
              <p className="text-gunmetal-600">
                Our streamlined process makes it easy to submit your resume and
                details.
              </p>
            </div>
            <div className="bg-isabelline-800 p-5 rounded-md">
              <h3 className="text-xl font-medium text-indigo_dye mb-2">
                Career Growth
              </h3>
              <p className="text-gunmetal-600">
                Find opportunities that match your experience level - from
                freshers to experienced professionals.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
