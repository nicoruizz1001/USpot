import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { seedBuildings } from '@/data/seedBuildings';
import { AppHeader } from '@/components/AppHeader';
import { useNavigate } from 'react-router-dom';

const SeedData = () => {
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleSeed = async () => {
    setSeeding(true);
    setMessage('Starting to seed database...');

    try {
      await seedBuildings();
      setMessage('Database seeded successfully! You can now view the buildings in the Lock-In section.');
    } catch (error) {
      console.error('Error seeding database:', error);
      setMessage('Error seeding database. Check console for details.');
    } finally {
      setSeeding(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppHeader />

      <div className="flex-1 overflow-auto p-6">
        <div className="container mx-auto max-w-2xl">
          <Card className="p-6">
            <h1 className="text-2xl font-bold mb-4">Seed Database</h1>
            <p className="text-muted-foreground mb-6">
              This will populate the database with real UVA building and room data.
              Click the button below to seed the database.
            </p>

            <Button
              onClick={handleSeed}
              disabled={seeding}
              className="mb-4"
            >
              {seeding ? 'Seeding...' : 'Seed Database'}
            </Button>

            {message && (
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-sm">{message}</p>
              </div>
            )}

            <div className="mt-6">
              <Button
                variant="outline"
                onClick={() => navigate('/lock-in')}
              >
                Go to Lock-In
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SeedData;
