import { useNavigate } from 'react-router-dom';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, List } from 'lucide-react';

const Events = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppHeader showNavTabs />

      <div className="flex-1 flex items-center justify-center pb-28 md:pb-0 px-6">
        <div className="max-w-4xl w-full">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground mb-3">Campus Events</h1>
            <p className="text-lg text-muted-foreground">
              Discover and explore events happening around campus
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/events/map')}>
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-blue-600 text-white rounded-full p-6">
                    <Map className="w-12 h-12" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">Map View</CardTitle>
                <CardDescription className="text-center">
                  See event locations on an interactive campus map
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button size="lg" className="w-full bg-blue-600 hover:bg-blue-700">
                  Open Map
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate('/events/list')}>
              <CardHeader>
                <div className="flex items-center justify-center mb-4">
                  <div className="bg-green-600 text-white rounded-full p-6">
                    <List className="w-12 h-12" />
                  </div>
                </div>
                <CardTitle className="text-2xl text-center">List View</CardTitle>
                <CardDescription className="text-center">
                  Browse all events in a detailed, organized list
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                  Open List
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default Events;
