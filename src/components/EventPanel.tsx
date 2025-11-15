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
        <div className="sticky top-0 bg-background border-b border-border p-4 flex items-center justify-between gap-2 z-10">
          <h2 className="text-xl font-bold text-foreground line-clamp-2 break-words flex-1 min-w-0">{event.title}</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-4 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-foreground min-w-0">
              <Calendar className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="truncate">{event.date}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground min-w-0">
              <Clock className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="truncate">{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-foreground min-w-0">
              <MapPin className="w-4 h-4 text-muted-foreground shrink-0" />
              <span className="truncate">{event.building} - {event.room}</span>
            </div>
            <Badge variant="secondary" className="w-fit whitespace-nowrap">
              {event.category}
            </Badge>
          </div>

          <div className="pt-2 min-w-0">
            <h3 className="font-semibold text-foreground mb-2">About this event</h3>
            <p className="text-muted-foreground leading-relaxed break-words">{event.description}</p>
          </div>

          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-foreground mb-3">Hosted by</h3>
            <div className="bg-muted rounded-lg p-4 space-y-3 min-w-0">
              <div className="min-w-0">
                <div className="font-medium text-foreground truncate">{event.organization.name}</div>
                <p className="text-sm text-muted-foreground mt-1 break-words">
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
