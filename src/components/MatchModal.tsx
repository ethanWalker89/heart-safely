import { Heart, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
}

const MatchModal = ({ isOpen, onClose, profileName }: MatchModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md gradient-card border-border">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto animate-float">
            <Heart className="w-16 h-16 text-heart animate-heart-pulse" fill="currentColor" />
          </div>
          <DialogTitle className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
            It's a Match!
          </DialogTitle>
          <div className="flex items-center justify-center space-x-2 text-muted-foreground">
            <Sparkles className="w-4 h-4 text-accent" />
            <p>You and {profileName} liked each other</p>
            <Sparkles className="w-4 h-4 text-accent" />
          </div>
        </DialogHeader>
        
        <div className="flex flex-col space-y-3 pt-4">
          <Button className="gradient-primary text-white">
            Send Message
          </Button>
          <Button variant="outline" onClick={onClose}>
            Keep Swiping
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MatchModal;