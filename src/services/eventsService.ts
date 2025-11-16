import { supabase } from '@/lib/supabase';

export const deleteEvent = async (eventId: string): Promise<{ success: boolean; error?: string }> => {
  try {
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', eventId);

    if (error) {
      console.error('Error deleting event:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Unexpected error deleting event:', error);
    return { success: false, error: 'An unexpected error occurred while deleting the event' };
  }
};
