import { useState, useEffect, useMemo } from 'react';
import { Building, DBRoom, CreateBookingInput } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import { Search, Users, MapPin, Calendar as CalendarIcon, Clock, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { createBooking, checkRoomAvailability, calculateDuration } from '@/services/bookingsService';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface RoomBookingModalProps {
  building: Building | null;
  open: boolean;
  onClose: () => void;
  onBookingSuccess?: () => void;
}

type BookingStep = 'room-selection' | 'booking-form';

export const RoomBookingModal = ({ building, open, onClose, onBookingSuccess }: RoomBookingModalProps) => {
  const [step, setStep] = useState<BookingStep>('room-selection');
  const [rooms, setRooms] = useState<DBRoom[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoom, setSelectedRoom] = useState<DBRoom | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [notes, setNotes] = useState('');
  const [minCapacity, setMinCapacity] = useState(1);
  const [maxCapacity, setMaxCapacity] = useState(20);
  const [floorFilter, setFloorFilter] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (building && open) {
      loadRooms();
      setStep('room-selection');
      setSelectedRoom(null);
      setSearchQuery('');
      setNotes('');
    }
  }, [building, open]);

  const loadRooms = async () => {
    if (!building) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('building_id', building.id)
        .order('floor', { ascending: true })
        .order('room_name', { ascending: true });

      if (error) throw error;
      setRooms(data || []);

      if (data && data.length > 0) {
        const maxCap = Math.max(...data.map(r => r.capacity));
        setMaxCapacity(maxCap);
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  const uniqueFloors = useMemo(() => {
    return Array.from(new Set(rooms.map(r => r.floor))).sort();
  }, [rooms]);

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesSearch = room.room_name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCapacity = room.capacity >= minCapacity && room.capacity <= maxCapacity;
      const matchesFloor = floorFilter.length === 0 || floorFilter.includes(room.floor);
      return matchesSearch && matchesCapacity && matchesFloor;
    });
  }, [rooms, searchQuery, minCapacity, maxCapacity, floorFilter]);

  const toggleFloorFilter = (floor: string) => {
    setFloorFilter(prev =>
      prev.includes(floor) ? prev.filter(f => f !== floor) : [...prev, floor]
    );
  };

  const handleRoomSelect = (room: DBRoom) => {
    setSelectedRoom(room);
    setStep('booking-form');
  };

  const handleBack = () => {
    setStep('room-selection');
    setSelectedRoom(null);
  };

  const handleSubmit = async () => {
    if (!selectedRoom || !building || !selectedDate) {
      toast.error('Please select a room and date');
      return;
    }

    const duration = calculateDuration(startTime, endTime);

    if (duration <= 0) {
      toast.error('End time must be after start time');
      return;
    }

    if (duration > 120) {
      toast.error('Booking duration cannot exceed 2 hours');
      return;
    }

    setSubmitting(true);

    try {
      const dateString = format(selectedDate, 'yyyy-MM-dd');
      const isAvailable = await checkRoomAvailability(
        selectedRoom.id,
        dateString,
        startTime + ':00',
        endTime + ':00'
      );

      if (!isAvailable) {
        toast.error('This time slot is already booked. Please choose a different time.');
        setSubmitting(false);
        return;
      }

      const bookingInput: CreateBookingInput = {
        room_id: selectedRoom.id,
        building_id: building.id,
        booking_date: dateString,
        start_time: startTime + ':00',
        end_time: endTime + ':00',
        duration_minutes: duration,
        notes: notes.trim() || undefined
      };

      await createBooking(bookingInput);

      toast.success('Room booked successfully!', {
        description: `${building.name} - ${selectedRoom.room_name} on ${format(selectedDate, 'PPP')} from ${startTime} to ${endTime}`
      });

      onClose();
      if (onBookingSuccess) {
        onBookingSuccess();
      }
    } catch (error: any) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking', {
        description: error.message || 'Please try again'
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setStep('room-selection');
    setSelectedRoom(null);
    setSearchQuery('');
    setNotes('');
    setFloorFilter([]);
    onClose();
  };

  if (!building) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <DialogTitle className="text-2xl">{building.name}</DialogTitle>
          <DialogDescription>
            {step === 'room-selection' ? (
              <>
                {filteredRooms.length} room{filteredRooms.length !== 1 ? 's' : ''} available
              </>
            ) : (
              <>Book {selectedRoom?.room_name}</>
            )}
          </DialogDescription>
        </DialogHeader>

        {step === 'room-selection' ? (
          <div className="flex flex-col h-full">
            <div className="p-4 space-y-4 border-b border-border">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search rooms..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex gap-2 flex-wrap">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      Floor {floorFilter.length > 0 && `(${floorFilter.length})`}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-3">
                    <div className="space-y-2">
                      {uniqueFloors.map(floor => (
                        <div key={floor} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`floor-${floor}`}
                            checked={floorFilter.includes(floor)}
                            onChange={() => toggleFloorFilter(floor)}
                            className="rounded"
                          />
                          <label htmlFor={`floor-${floor}`} className="text-sm cursor-pointer">
                            Floor {floor}
                          </label>
                        </div>
                      ))}
                    </div>
                  </PopoverContent>
                </Popover>

                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Capacity:</span>
                  <span className="font-medium">{minCapacity} - {maxCapacity}</span>
                </div>
              </div>

              {floorFilter.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {floorFilter.map(floor => (
                    <Badge key={floor} variant="secondary" className="gap-1">
                      Floor {floor}
                      <X
                        className="h-3 w-3 cursor-pointer"
                        onClick={() => toggleFloorFilter(floor)}
                      />
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-3">
                {loading ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading rooms...
                  </div>
                ) : filteredRooms.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No rooms found matching your criteria
                  </div>
                ) : (
                  filteredRooms.map((room) => (
                    <Card
                      key={room.id}
                      className="p-4 cursor-pointer transition-all hover:shadow-md hover:border-blue-600"
                      onClick={() => handleRoomSelect(room)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-muted-foreground" />
                            <h3 className="font-semibold text-foreground">
                              {room.room_name}
                            </h3>
                          </div>
                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Users className="w-4 h-4" />
                              <span>Capacity: {room.capacity}</span>
                            </div>
                            <div>Floor {room.floor}</div>
                          </div>
                        </div>
                        {room.available ? (
                          <Badge variant="default" className="gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Available
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <AlertCircle className="w-3 h-3" />
                            In Use
                          </Badge>
                        )}
                      </div>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>
        ) : (
          <div className="p-6 space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <div className="font-semibold text-foreground mb-1">
                {selectedRoom?.room_name}
              </div>
              <div className="text-sm text-muted-foreground">
                Capacity: {selectedRoom?.capacity} • Floor {selectedRoom?.floor}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Booking Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        'w-full justify-start text-left font-normal',
                        !selectedDate && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="start-time"
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="end-time"
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              {calculateDuration(startTime, endTime) > 0 && (
                <div className="text-sm text-muted-foreground">
                  Duration: {calculateDuration(startTime, endTime)} minutes
                  {calculateDuration(startTime, endTime) > 120 && (
                    <span className="text-destructive ml-2">
                      (Maximum 120 minutes allowed)
                    </span>
                  )}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Add any notes about your booking..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              <Button variant="outline" onClick={handleBack} className="flex-1">
                Back
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={submitting || !selectedDate || calculateDuration(startTime, endTime) <= 0 || calculateDuration(startTime, endTime) > 120}
                className="flex-1"
              >
                {submitting ? 'Booking...' : 'Confirm Booking'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
