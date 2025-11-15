import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

const Events = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/events/map', { replace: true });
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
    </div>
  );
};

export default Events;
