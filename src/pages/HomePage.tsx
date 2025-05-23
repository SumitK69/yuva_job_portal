
import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SectorButton from '../components/SectorButton';
import Logo from '../components/Logo';

// These could be fetched from an API in a real application
const sectors = [
  { name: 'Cotton Mill', route: '/jobs/cotton-mill', image: '/placeholder.svg' },
  { name: 'Jute Mill', route: '/jobs/jute-mill', image: '/placeholder.svg' },
  { name: 'Cable Mill', route: '/jobs/cable-mill', image: '/placeholder.svg' },
  { name: 'Amazon', route: '/jobs/amazon', image: '/placeholder.svg' },
  { name: 'Flipkart', route: '/jobs/flipkart', image: '/placeholder.svg' },
  { name: 'IT Sector', route: '/jobs/it-sector', image: '/placeholder.svg' },
];

const HomePage = () => {
  return (
    <div className="flex flex-col min-h-screen bg-isabelline-800">
      <Header />
      <main className="flex-grow container mx-auto py-10 px-4">
        <section className="mb-10 text-center">
          <div className="flex justify-center mb-6">
            <Logo />
          </div>
          <h1 className="text-4xl font-bold text-gunmetal mb-4">Welcome to Yuva Load Service</h1>
          <p className="text-xl text-gunmetal-600 max-w-2xl mx-auto">
            Discover career opportunities across various sectors. Submit your application with just a few clicks.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gunmetal mb-6 text-center">Browse Jobs by Sector</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sectors.map((sector) => (
              <SectorButton 
                key={sector.name} 
                sector={sector.name} 
                route={sector.route} 
                image={sector.image} 
              />
            ))}
          </div>
        </section>

        <section className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold text-gunmetal mb-4">Why Choose Yuva Load Service?</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-6">
            <div className="bg-isabelline-800 p-5 rounded-md">
              <h3 className="text-xl font-medium text-indigo_dye mb-2">Diverse Opportunities</h3>
              <p className="text-gunmetal-600">Access jobs across multiple industries and sectors all in one place.</p>
            </div>
            <div className="bg-isabelline-800 p-5 rounded-md">
              <h3 className="text-xl font-medium text-indigo_dye mb-2">Simple Application</h3>
              <p className="text-gunmetal-600">Our streamlined process makes it easy to submit your resume and details.</p>
            </div>
            <div className="bg-isabelline-800 p-5 rounded-md">
              <h3 className="text-xl font-medium text-indigo_dye mb-2">Career Growth</h3>
              <p className="text-gunmetal-600">Find opportunities that match your experience level - from freshers to experienced professionals.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default HomePage;
