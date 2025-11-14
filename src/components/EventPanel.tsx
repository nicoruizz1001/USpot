import { Event } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Calendar, Clock, MapPin, ExternalLink, Instagram, Globe } from 'lucide-react';

interface EventPanelProps {
  event: Event;
  onClose: () => void;
}

export const EventPanel = ({ event, onClose }: EventPanelProps) => {
  return (
    <div className="absolute top-0 right-0 w-full md:w-96 h-full bg-background shadow-lg z-20 overflow-y-auto">
      <Card className="m-0 rounded-none border-0 shadow-none h-full">
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between z-10">
          <h2 className="text-xl font-bold text-foreground">{event.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <span>{event.building} - {event.room}</span>
            </div>
            <Badge variant="secondary" className="w-fit">
              {event.category}
            </Badge>
          </div>

          <div className="pt-2">
            <h3 className="font-semibold text-foreground mb-2">About this event</h3>
            <p className="text-muted-foreground leading-relaxed">{event.description}</p>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-3">Hosted by</h3>
            <div className="bg-muted rounded-lg p-4 space-y-3">
              <div>
                <div className="font-medium text-foreground">{event.organization.name}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {event.organization.description}
                </p>
              </div>
              
              {(event.organization.links.instagram || 
                event.organization.links.website || 
                event.organization.links.doorlist) && (
                <div className="flex flex-wrap gap-2">
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

          <Button className="w-full" size="lg">
            Get Directions
          </Button>
        </div>
      </Card>
    </div>
  );
};
