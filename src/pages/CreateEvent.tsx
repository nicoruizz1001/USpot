import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { AppHeader } from '@/components/AppHeader';
import { BottomNavigation } from '@/components/BottomNavigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const eventSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be less than 100 characters'),
  description: z.string().min(1, 'Description is required').max(500, 'Description must be less than 500 characters'),
  location_name: z.string().min(1, 'Location name is required'),
  room: z.string().optional(),
  latitude: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= -90 && Number(val) <= 90, {
    message: 'Invalid latitude (-90 to 90)',
  }),
  longitude: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= -180 && Number(val) <= 180, {
    message: 'Invalid longitude (-180 to 180)',
  }),
  event_date: z.string().min(1, 'Date is required'),
  event_time: z.string().min(1, 'Time is required'),
  category: z.string().min(1, 'Category is required'),
  organization_name: z.string().optional(),
  organization_description: z.string().optional(),
  instagram_link: z.string().url().optional().or(z.literal('')),
  website_link: z.string().url().optional().or(z.literal('')),
});

type EventFormData = z.infer<typeof eventSchema>;

const CreateEvent = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      title: '',
      description: '',
      location_name: '',
      room: '',
      latitude: '38.0366',
      longitude: '-78.5055',
      event_date: '',
      event_time: '',
      category: 'Social',
      organization_name: '',
      organization_description: '',
      instagram_link: '',
      website_link: '',
    },
  });

  const category = watch('category');

  const onSubmit = async (data: EventFormData) => {
    if (!user) {
      toast.error('You must be logged in to create events');
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await supabase.from('events').insert([
        {
          title: data.title,
          description: data.description,
          location_name: data.location_name,
          room: data.room || '',
          latitude: parseFloat(data.latitude),
          longitude: parseFloat(data.longitude),
          event_date: data.event_date,
          event_time: data.event_time,
          category: data.category,
          organization_name: data.organization_name || '',
          organization_description: data.organization_description || '',
          instagram_link: data.instagram_link || null,
          website_link: data.website_link || null,
          created_by: user.id,
        },
      ]);

      if (error) throw error;

      toast.success('Event created successfully!');
      navigate('/events');
    } catch (error) {
      console.error('Error creating event:', error);
      toast.error('Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <AppHeader />

      <div className="flex-1 overflow-auto pb-28 md:pb-0">
        <div className="container max-w-2xl mx-auto px-6 py-6">
          <Card>
            <CardHeader>
              <CardTitle>Create New Event</CardTitle>
              <CardDescription>
                Share your event with the campus community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Event Title *</Label>
                  <Input
                    id="title"
                    placeholder="CS Department Mixer"
                    {...register('title')}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description *</Label>
                  <Textarea
                    id="description"
                    placeholder="Join us for networking and mingling..."
                    rows={4}
                    {...register('description')}
                  />
                  {errors.description && (
                    <p className="text-sm text-destructive">{errors.description.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location_name">Location Name *</Label>
                    <Input
                      id="location_name"
                      placeholder="Rice Hall"
                      {...register('location_name')}
                    />
                    {errors.location_name && (
                      <p className="text-sm text-destructive">{errors.location_name.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="room">Room</Label>
                    <Input
                      id="room"
                      placeholder="Auditorium"
                      {...register('room')}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="latitude">Latitude *</Label>
                    <Input
                      id="latitude"
                      type="number"
                      step="any"
                      placeholder="38.0366"
                      {...register('latitude')}
                    />
                    {errors.latitude && (
                      <p className="text-sm text-destructive">{errors.latitude.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="longitude">Longitude *</Label>
                    <Input
                      id="longitude"
                      type="number"
                      step="any"
                      placeholder="-78.5055"
                      {...register('longitude')}
                    />
                    {errors.longitude && (
                      <p className="text-sm text-destructive">{errors.longitude.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="event_date">Date *</Label>
                    <Input
                      id="event_date"
                      type="date"
                      {...register('event_date')}
                    />
                    {errors.event_date && (
                      <p className="text-sm text-destructive">{errors.event_date.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="event_time">Time *</Label>
                    <Input
                      id="event_time"
                      type="time"
                      {...register('event_time')}
                    />
                    {errors.event_time && (
                      <p className="text-sm text-destructive">{errors.event_time.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={category}
                    onValueChange={(value) => setValue('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Social">Social</SelectItem>
                      <SelectItem value="Academic">Academic</SelectItem>
                      <SelectItem value="Sports">Sports</SelectItem>
                      <SelectItem value="Entertainment">Entertainment</SelectItem>
                      <SelectItem value="Arts">Arts</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category.message}</p>
                  )}
                </div>

                <div className="pt-4 border-t">
                  <h3 className="text-lg font-semibold mb-4">Organization Details</h3>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="organization_name">Organization Name</Label>
                      <Input
                        id="organization_name"
                        placeholder="CS Club"
                        {...register('organization_name')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="organization_description">Organization Description</Label>
                      <Textarea
                        id="organization_description"
                        placeholder="University Computer Science student organization"
                        rows={2}
                        {...register('organization_description')}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="instagram_link">Instagram Link</Label>
                      <Input
                        id="instagram_link"
                        type="url"
                        placeholder="https://instagram.com/yourorg"
                        {...register('instagram_link')}
                      />
                      {errors.instagram_link && (
                        <p className="text-sm text-destructive">{errors.instagram_link.message}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="website_link">Website Link</Label>
                      <Input
                        id="website_link"
                        type="url"
                        placeholder="https://yourorg.com"
                        {...register('website_link')}
                      />
                      {errors.website_link && (
                        <p className="text-sm text-destructive">{errors.website_link.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/events')}
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      'Create Event'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default CreateEvent;
