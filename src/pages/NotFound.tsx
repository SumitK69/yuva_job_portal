
import React from "react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="flex flex-col min-h-screen bg-isabelline-800">
      <Header />
      <main className="flex-grow container mx-auto py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-5xl font-bold text-indigo_dye mb-6">404</h1>
          <p className="text-2xl font-semibold text-gunmetal mb-4">Page Not Found</p>
          <p className="text-lg text-gunmetal-600 mb-8">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Button className="bg-indigo_dye hover:bg-indigo_dye-600 transition-colors">
            <Link to="/" className="w-full block">Return to Home</Link>
          </Button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
