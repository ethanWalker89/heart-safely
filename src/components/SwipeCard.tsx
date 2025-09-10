import { useState } from "react";
import { Heart, X, MapPin, Briefcase } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Profile {
  id: string;
  name: string;
  age: number;
  image: string;
  location: string;
  occupation: string;
  bio: string;
  interests: string[];
}

interface SwipeCardProps {
  profile: Profile;
  onSwipe: (direction: 'left' | 'right', profileId: string) => void;
}

const SwipeCard = ({ profile, onSwipe }: SwipeCardProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  const handleSwipe = (direction: 'left' | 'right') => {
    setIsAnimating(true);
    setAnimationClass(direction === 'right' ? 'animate-swipe-right' : 'animate-swipe-left');
    
    setTimeout(() => {
      onSwipe(direction, profile.id);
      setIsAnimating(false);
      setAnimationClass('');
    }, 600);
  };

  return (
    <Card className={`relative w-full max-w-sm mx-auto h-[600px] overflow-hidden swipe-card gradient-card ${animationClass}`}>
      {/* Profile Image */}
      <div className="relative h-3/5 overflow-hidden">
        <img 
          src={profile.image} 
          alt={profile.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
      </div>
      
      {/* Profile Info */}
      <div className="p-6 space-y-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {profile.name}, {profile.age}
          </h2>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-2">
            <div className="flex items-center space-x-1">
              <MapPin className="w-4 h-4" />
              <span>{profile.location}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Briefcase className="w-4 h-4" />
              <span>{profile.occupation}</span>
            </div>
          </div>
        </div>
        
        <p className="text-sm text-foreground leading-relaxed">
          {profile.bio}
        </p>
        
        <div className="flex flex-wrap gap-2">
          {profile.interests.map((interest, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-secondary/20 text-secondary text-xs rounded-full border border-secondary/30"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
      
      {/* Action Buttons */}
      <div className="absolute bottom-6 left-6 right-6 flex justify-center space-x-8">
        <Button
          onClick={() => handleSwipe('left')}
          disabled={isAnimating}
          size="lg"
          variant="outline"
          className="rounded-full w-14 h-14 border-2 border-pass text-pass hover:bg-pass hover:text-white"
        >
          <X className="w-6 h-6" />
        </Button>
        
        <Button
          onClick={() => handleSwipe('right')}
          disabled={isAnimating}
          size="lg"
          className="rounded-full w-14 h-14 bg-heart hover:bg-heart/90 text-white border-2 border-heart"
        >
          <Heart className="w-6 h-6" fill="currentColor" />
        </Button>
      </div>
    </Card>
  );
};

export default SwipeCard;