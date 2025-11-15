import { MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from '@/utils/distance';

interface DistanceBadgeProps {
  distance: number;
  className?: string;
  showIcon?: boolean;
}

export const DistanceBadge = ({ distance, className = '', showIcon = true }: DistanceBadgeProps) => {
  return (
    <Badge variant="secondary" className={`gap-1 ${className}`}>
      {showIcon && <MapPin className="h-3 w-3" />}
      {formatDistance(distance)}
    </Badge>
  );
};
