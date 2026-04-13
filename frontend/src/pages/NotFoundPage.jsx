import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFoundPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="text-center">
        <p className="font-heading font-bold text-primary text-8xl">404</p>
        <h1 className="font-heading font-bold text-text-main text-2xl mt-4">Page not found</h1>
        <p className="text-gray-500 text-sm mt-2">The page you are looking for does not exist.</p>
        <Button className="mt-6 mx-auto" onClick={() => navigate(-1)}>
          <ArrowLeft size={16} />
          Go Back
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
