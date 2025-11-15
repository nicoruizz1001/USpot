import { Event } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, Instagram, Globe, ExternalLink, X, Navigation } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface EventDetailModalProps {
  event: Event | null;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (event: Event) => void;
}

export const EventDetailModal = ({ event, isOpen, onClose, onNavigate }: EventDetailModalProps) => {
  const isMobile = useIsMobile();

  console.log('EventDetailModal render:', { event: event?.title, isOpen, isMobile });

  if (!event) return null;

  const handleNavigate = () => {
    onNavigate(event);
    onClose();
  };

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1 pr-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">{event.title}</h2>
          {event.image && (
            <div className="w-full h-48 rounded-lg overflow-hidden mb-4 bg-muted">
              <img
                src={event.image}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute right-4 top-4 md:relative md:right-0 md:top-0"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <ScrollArea className="flex-1 -mx-6 px-6">
        <div className="space-y-6 pb-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">{event.time}</p>
                <p className="text-sm text-muted-foreground">{event.date}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-medium text-foreground">{event.building}</p>
                {event.room && (
                  <p className="text-sm text-muted-foreground">{event.room}</p>
                )}
              </div>
            </div>

            <Badge variant="secondary" className="w-fit">
              {event.category}
            </Badge>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-2">About</h3>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

          {event.organization && (
            <div className="border-t border-border pt-4">
              <h3 className="font-semibold text-foreground mb-3">Hosted by</h3>
              <div className="bg-muted rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-3">
                  {event.organization.logo && (
                    <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img
                        src={event.organization.logo}
                        alt={event.organization.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="font-medium text-foreground">{event.organization.name}</div>
                    {event.organization.description && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {event.organization.description}
                      </p>
                    )}
                  </div>
                </div>

                {(event.organization.links.instagram ||
                  event.organization.links.website ||
                  event.organization.links.doorlist) && (
                  <div className="flex flex-wrap gap-2 pt-2">
                    {event.organization.links.instagram && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="text-xs"
                      >
                        <a
                          href={event.organization.links.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Instagram className="w-3 h-3 mr-1" />
                          Instagram
                        </a>
                      </Button>
                    )}
                    {event.organization.links.website && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="text-xs"
                      >
                        <a
                          href={event.organization.links.website}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Globe className="w-3 h-3 mr-1" />
                          Website
                        </a>
                      </Button>
                    )}
                    {event.organization.links.doorlist && (
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="text-xs"
                      >
                        <a
                          href={event.organization.links.doorlist}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          DoorList
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="mt-4 pt-4 border-t border-border">
        <Button
          className="w-full"
          size="lg"
          onClick={handleNavigate}
        >
          <Navigation className="w-4 h-4 mr-2" />
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
            className="h-[90vh] rounded-t-2xl p-6 z-[100]"
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
