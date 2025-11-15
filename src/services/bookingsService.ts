import { supabase } from '@/lib/supabase';
import { Booking, CreateBookingInput, TimeSlot } from '@/types';

export const createBooking = async (bookingData: CreateBookingInput): Promise<Booking | null> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        room_id: bookingData.room_id,
        building_id: bookingData.building_id,
        booking_date: bookingData.booking_date,
        start_time: bookingData.start_time,
        end_time: bookingData.end_time,
        duration_minutes: bookingData.duration_minutes,
        notes: bookingData.notes || null,
        status: 'confirmed'
      })
      .select('*')
      .single();

    if (error) throw error;
    return data as Booking;
  } catch (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
};

export const getUserBookings = async (): Promise<Booking[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        room:rooms(*),
        building:buildings(*)
      `)
      .eq('user_id', user.id)
      .order('booking_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data as Booking[];
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return [];
  }
};

export const getUpcomingBookings = async (): Promise<Booking[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        room:rooms(*),
        building:buildings(*)
      `)
      .eq('user_id', user.id)
      .gte('booking_date', today)
      .in('status', ['confirmed'])
      .order('booking_date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data as Booking[];
  } catch (error) {
    console.error('Error fetching upcoming bookings:', error);
    return [];
  }
};

export const getPastBookings = async (): Promise<Booking[]> => {
  try {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      throw new Error('User not authenticated');
    }

    const today = new Date().toISOString().split('T')[0];

    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        room:rooms(*),
        building:buildings(*)
      `)
      .eq('user_id', user.id)
      .lt('booking_date', today)
      .order('booking_date', { ascending: false })
      .order('start_time', { ascending: false });

    if (error) throw error;
    return data as Booking[];
  } catch (error) {
    console.error('Error fetching past bookings:', error);
    return [];
  }
};

export const checkRoomAvailability = async (
  roomId: string,
  date: string,
  startTime: string,
  endTime: string
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('id')
      .eq('room_id', roomId)
      .eq('booking_date', date)
      .eq('status', 'confirmed')
      .or(`start_time.lt.${endTime},end_time.gt.${startTime}`);

    if (error) throw error;

    return !data || data.length === 0;
  } catch (error) {
    console.error('Error checking room availability:', error);
    return false;
  }
};

export const getRoomBookingsForDate = async (
  roomId: string,
  date: string
): Promise<Booking[]> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('room_id', roomId)
      .eq('booking_date', date)
      .eq('status', 'confirmed')
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data as Booking[];
  } catch (error) {
    console.error('Error fetching room bookings:', error);
    return [];
  }
};

export const generateTimeSlots = async (
  roomId: string,
  date: string,
  buildingHours: string = '8 AM - 10 PM'
): Promise<TimeSlot[]> => {
  try {
    const existingBookings = await getRoomBookingsForDate(roomId, date);

    const [startHour, endHour] = parseHours(buildingHours);
    const slots: TimeSlot[] = [];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const startTime = formatTime(hour, minute);
        const endMinute = minute + 30;
        const endHour = hour + Math.floor(endMinute / 60);
        const endTime = formatTime(endHour % 24, endMinute % 60);

        if (endHour < endHour || (endHour === endHour && endMinute <= 0)) {
          continue;
        }

        const isAvailable = !existingBookings.some(booking => {
          return (
            (startTime >= booking.start_time && startTime < booking.end_time) ||
            (endTime > booking.start_time && endTime <= booking.end_time) ||
            (startTime <= booking.start_time && endTime >= booking.end_time)
          );
        });

        slots.push({ startTime, endTime, isAvailable });
      }
    }

    return slots;
  } catch (error) {
    console.error('Error generating time slots:', error);
    return [];
  }
};

const parseHours = (hours: string): [number, number] => {
  const match = hours.match(/(\d+)\s*(AM|PM)?\s*-\s*(\d+)\s*(AM|PM)?/i);
  if (!match) return [8, 22];

  let startHour = parseInt(match[1]);
  let endHour = parseInt(match[3]);

  if (match[2]?.toUpperCase() === 'PM' && startHour !== 12) startHour += 12;
  if (match[2]?.toUpperCase() === 'AM' && startHour === 12) startHour = 0;
  if (match[4]?.toUpperCase() === 'PM' && endHour !== 12) endHour += 12;
  if (match[4]?.toUpperCase() === 'AM' && endHour === 12) endHour = 0;

  if (hours.includes('24/7')) return [0, 24];

  return [startHour, endHour];
};

const formatTime = (hour: number, minute: number): string => {
  return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`;
};

export const cancelBooking = async (bookingId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled', updated_at: new Date().toISOString() })
      .eq('id', bookingId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error cancelling booking:', error);
    return false;
  }
};

export const deleteBooking = async (bookingId: string): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('bookings')
      .delete()
      .eq('id', bookingId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting booking:', error);
    return false;
  }
};

export const getBookingById = async (bookingId: string): Promise<Booking | null> => {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        room:rooms(*),
        building:buildings(*)
      `)
      .eq('id', bookingId)
      .single();

    if (error) throw error;
    return data as Booking;
  } catch (error) {
    console.error('Error fetching booking:', error);
    return null;
  }
};

export const calculateDuration = (startTime: string, endTime: string): number => {
  const [startHour, startMinute] = startTime.split(':').map(Number);
  const [endHour, endMinute] = endTime.split(':').map(Number);

  const startMinutes = startHour * 60 + startMinute;
  const endMinutes = endHour * 60 + endMinute;

  return endMinutes - startMinutes;
};
