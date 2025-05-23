
import React from 'react';
import { Link } from 'react-router-dom';

interface SectorButtonProps {
  sector: string;
  image?: string;
  route: string;
}

const SectorButton = ({ sector, image, route }: SectorButtonProps) => {
  return (
    <Link
      to={route}
      className="bg-indigo_dye hover:bg-indigo_dye-600 text-white p-6 rounded-lg shadow-md transition-all duration-300 transform hover:scale-105 flex flex-col items-center justify-center text-center h-48"
    >
      {image && (
        <div className="w-16 h-16 mb-4 bg-isabelline rounded-full flex items-center justify-center overflow-hidden">
          <img src={image} alt={sector} className="w-10 h-10 object-contain" />
        </div>
      )}
      <span className="text-xl font-semibold">{sector}</span>
    </Link>
  );
};

export default SectorButton;
