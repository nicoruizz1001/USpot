import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, Instagram, Globe, ExternalLink, X, Navigation, Trash2, Share2, Bookmark } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (event: Event) => void;
  onDelete?: (eventId: string) => void;
}

export const EventDetailModal = ({ event, isOpen, onClose, onNavigate, onDelete }: EventDetailModalProps) => {
  const isMobile = useIsMobile();

  if (!event) return null;

  const handleNavigate = () => {
    onNavigate(event);
    onClose();
  };

  const handleDelete = () => {
    if (onDelete && event) {
      onDelete(event.id);
    }
  };

  const getCategoryGradient = (category: string) => {
    const gradients: Record<string, string> = {
      Social: 'from-blue-500 to-cyan-500',
      Academic: 'from-purple-500 to-pink-500',
      Sports: 'from-green-500 to-emerald-500',
      Entertainment: 'from-pink-500 to-rose-500',
      Arts: 'from-orange-500 to-amber-500',
      'Free Food': 'from-red-500 to-orange-500',
    };
    return gradients[category] || 'from-gray-500 to-gray-600';
  };

  const content = (
    <div className="flex flex-col h-full min-h-0">
      {event.image && (
        <div className="relative -mx-4 sm:-mx-6 -mt-4 sm:-mt-6 mb-4 sm:mb-6 shrink-0">
          <div className="aspect-[16/9] w-full overflow-hidden bg-gray-200">
            <img
              src={event.image}
              alt={event.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Share2 className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="secondary"
              className="rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <Bookmark className="w-4 h-4" />
            </Button>
            {onDelete && (
              <Button
                size="icon"
                variant="destructive"
                className="rounded-full shadow-lg"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute top-4 left-4 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      {!event.image && (
        <div className="flex items-start justify-between mb-4">
          <h2 className="text-3xl font-bold text-foreground">{event.title}</h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
      )}

      <ScrollArea className="flex-1 -mx-4 sm:-mx-6 px-4 sm:px-6 min-h-0">
        <div className="space-y-4 sm:space-y-6 pb-4 sm:pb-6">
          {event.image && (
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">{event.title}</h2>
              <Badge className={`bg-gradient-to-r ${getCategoryGradient(event.category)} text-white border-0`}>
                {event.category}
              </Badge>
            </div>
          )}

          {event.organization && event.organization.name && (
            <div className="flex items-center gap-3 py-4 border-y border-border">
              {event.organization.logo && (
                <img
                  src={event.organization.logo}
                  alt={event.organization.name}
                  className="w-14 h-14 rounded-full border-2 border-gray-200"
                />
              )}
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-lg">{event.organization.name}</p>
                {event.organization.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {event.organization.description}
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                <Calendar className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 pt-1.5">
                <p className="font-semibold text-foreground text-lg">{event.date}</p>
                <p className="text-muted-foreground">{event.time}</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center flex-shrink-0">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 pt-1.5">
                <p className="font-semibold text-foreground text-lg">{event.building}</p>
                {event.room && (
                  <p className="text-muted-foreground">{event.room}</p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-2">
            <h3 className="font-bold text-foreground text-lg mb-3">About this event</h3>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

          {(event.organization?.links.instagram ||
            event.organization?.links.website ||
            event.organization?.links.doorlist) && (
            <div className="pt-2">
              <h3 className="font-bold text-foreground text-lg mb-3">Links</h3>
              <div className="flex flex-wrap gap-2">
                {event.organization.links.instagram && (
                  <Button
                    variant="outline"
                    size="default"
                    asChild
                    className="rounded-full"
                  >
                    <a
                      href={event.organization.links.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="w-4 h-4 mr-2" />
                      Instagram
                    </a>
                  </Button>
                )}
                {event.organization.links.website && (
                  <Button
                    variant="outline"
                    size="default"
                    asChild
                    className="rounded-full"
                  >
                    <a
                      href={event.organization.links.website}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Globe className="w-4 h-4 mr-2" />
                      Website
                    </a>
                  </Button>
                )}
                {event.organization.links.doorlist && (
                  <Button
                    variant="outline"
                    size="default"
                    asChild
                    className="rounded-full"
                  >
                    <a
                      href={event.organization.links.doorlist}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      DoorList
                    </a>
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-border shrink-0">
        <Button
          className={`w-full rounded-full bg-gradient-to-r ${getCategoryGradient(event.category)} hover:opacity-90 transition-opacity text-white border-0`}
          size="lg"
          onClick={handleNavigate}
        >
          <Navigation className="w-5 h-5 mr-2" />
          Get Directions
        </Button>
      </div>
    </div>
  );

  return (
    <>
      {isMobile ? (
        <Sheet open={isOpen} onOpenChange={onClose}>
          <SheetContent
            side="bottom"
            className="h-[95vh] max-h-[95vh] rounded-t-3xl p-4 sm:p-6 z-[100] overflow-hidden"
          >
            {content}
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col p-6 z-[100]">
            {content}
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
