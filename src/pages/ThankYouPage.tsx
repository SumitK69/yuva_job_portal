
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Button } from '@/components/ui/button';

const ThankYouPage = () => {
  const { sector } = useParams<{ sector: string }>();
  
  const formatSectorName = (sector: string) => {
    return sector
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="flex flex-col min-h-screen bg-isabelline-800">
      <Header />
      <main className="flex-grow container mx-auto py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <div className="w-20 h-20 bg-indigo_dye-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-indigo_dye-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          
          <h1 className="text-3xl font-bold text-gunmetal mb-4">Application Submitted!</h1>
          
          <p className="text-lg text-gunmetal-600 mb-6">
            Thank you for applying to the {sector ? formatSectorName(sector) : 'job'} position. We've received your application and will review it shortly.
          </p>
          
          <div className="space-y-3">
            <Button className="w-full bg-indigo_dye hover:bg-indigo_dye-600 transition-colors">
              <Link to="/" className="w-full block">Return to Home</Link>
            </Button>
            
            <Button variant="outline" className="w-full border-indigo_dye text-indigo_dye hover:bg-indigo_dye-100 transition-colors">
              <Link to={`/jobs/${sector}`} className="w-full block">Apply for Another Position</Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ThankYouPage;
