import { useState, useEffect } from 'react';
import { Booking } from '@/types';
import { getUpcomingBookings, getPastBookings, cancelBooking } from '@/services/bookingsService';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Calendar, Clock, MapPin, Users, X, CalendarX } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const MyBookings = () => {
  const [upcomingBookings, setUpcomingBookings] = useState<Booking[]>([]);
  const [pastBookings, setPastBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = async () => {
    setLoading(true);
    try {
      const [upcoming, past] = await Promise.all([
        getUpcomingBookings(),
        getPastBookings()
      ]);
      setUpcomingBookings(upcoming);
      setPastBookings(past);
    } catch (error) {
      console.error('Error loading bookings:', error);
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (booking: Booking) => {
    setBookingToCancel(booking);
    setCancelDialogOpen(true);
  };

  const handleCancelConfirm = async () => {
    if (!bookingToCancel) return;

    setCancelling(true);
    try {
      const success = await cancelBooking(bookingToCancel.id);
      if (success) {
        toast.success('Booking cancelled successfully');
        await loadBookings();
        setCancelDialogOpen(false);
        setBookingToCancel(null);
      } else {
        toast.error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
      toast.error('Failed to cancel booking');
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <Badge variant="default">Confirmed</Badge>;
      case 'cancelled':
        return <Badge variant="secondary">Cancelled</Badge>;
      case 'completed':
        return <Badge variant="outline">Completed</Badge>;
      case 'no-show':
        return <Badge variant="destructive">No Show</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const BookingCard = ({ booking, showCancelButton }: { booking: Booking; showCancelButton: boolean }) => (
    <Card className="p-4">
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground text-lg">
              {booking.building?.name || 'Building'}
            </h3>
            <p className="text-muted-foreground text-sm">
              {booking.room?.room_name || 'Room'}
            </p>
          </div>
          {getStatusBadge(booking.status)}
        </div>

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="w-4 h-4" />
            <span>{format(new Date(booking.booking_date), 'EEEE, MMMM d, yyyy')}</span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              {booking.start_time.substring(0, 5)} - {booking.end_time.substring(0, 5)}
              {' '}({booking.duration_minutes} minutes)
            </span>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span>Floor {booking.room?.floor}</span>
          </div>

          {booking.room?.capacity && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Users className="w-4 h-4" />
              <span>Capacity: {booking.room.capacity}</span>
            </div>
          )}
        </div>

        {booking.notes && (
          <div className="pt-2 border-t border-border">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Notes:</span> {booking.notes}
            </p>
          </div>
        )}

        {showCancelButton && booking.status === 'confirmed' && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCancelClick(booking)}
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          >
            <X className="w-4 h-4 mr-2" />
            Cancel Booking
          </Button>
        )}
      </div>
    </Card>
  );

  const EmptyState = ({ type }: { type: 'upcoming' | 'past' }) => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <CalendarX className="w-16 h-16 text-muted-foreground mb-4" />
      <h3 className="text-lg font-semibold text-foreground mb-2">
        No {type} bookings
      </h3>
      <p className="text-muted-foreground mb-6">
        {type === 'upcoming'
          ? "You don't have any upcoming room bookings"
          : "You haven't had any past bookings yet"}
      </p>
      {type === 'upcoming' && (
        <Button onClick={() => navigate('/lock-in')}>
          Book a Room
        </Button>
      )}
    </div>
  );

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppHeader showNavTabs={false} />

      <div className="flex-1 overflow-auto pb-16 md:pb-0">
        <div className="container mx-auto px-4 py-6 max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
            <p className="text-muted-foreground">
              View and manage your room reservations
            </p>
          </div>

          <Tabs defaultValue="upcoming" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="upcoming">
                Upcoming ({upcomingBookings.length})
              </TabsTrigger>
              <TabsTrigger value="past">
                Past ({pastBookings.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upcoming">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading bookings...
                </div>
              ) : upcomingBookings.length === 0 ? (
                <EmptyState type="upcoming" />
              ) : (
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        showCancelButton={true}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>

            <TabsContent value="past">
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Loading bookings...
                </div>
              ) : pastBookings.length === 0 ? (
                <EmptyState type="past" />
              ) : (
                <ScrollArea className="h-[calc(100vh-280px)]">
                  <div className="space-y-4">
                    {pastBookings.map((booking) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        showCancelButton={false}
                      />
                    ))}
                  </div>
                </ScrollArea>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking?
              {bookingToCancel && (
                <div className="mt-3 p-3 bg-muted rounded-lg text-foreground">
                  <div className="font-medium">{bookingToCancel.building?.name}</div>
                  <div className="text-sm">{bookingToCancel.room?.room_name}</div>
                  <div className="text-sm mt-1">
                    {format(new Date(bookingToCancel.booking_date), 'PPP')} at{' '}
                    {bookingToCancel.start_time.substring(0, 5)}
                  </div>
                </div>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelling}>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              disabled={cancelling}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Booking'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <BottomNavigation />
    </div>
  );
};

export default MyBookings;
