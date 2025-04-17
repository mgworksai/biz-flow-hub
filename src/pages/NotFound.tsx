
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center p-6 max-w-md">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center px-4 py-2 border border-primary text-primary bg-white rounded-md hover:bg-primary/5 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <ArrowLeft size={16} className="mr-2" />
            Go Back
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            <Home size={16} className="mr-2" />
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
