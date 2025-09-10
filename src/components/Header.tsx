import { Heart, Shield } from "lucide-react";

const Header = () => {
  return (
    <header className="flex items-center justify-between p-6 bg-card border-b border-border">
      <div className="flex items-center space-x-3">
        <div className="relative">
          <Heart 
            className="w-8 h-8 text-heart animate-heart-pulse heart-glow" 
            fill="currentColor"
          />
          <Shield className="absolute -top-1 -right-1 w-4 h-4 text-primary" />
        </div>
        <div>
          <h1 className="text-xl font-bold gradient-primary bg-clip-text text-transparent">
            SecureHeart
          </h1>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Shield className="w-3 h-3" />
            FHE Privacy Enabled
          </p>
        </div>
      </div>
      
      <div className="text-right">
        <p className="text-sm font-medium text-foreground">Private Match Mode</p>
        <p className="text-xs text-muted-foreground">End-to-end encrypted</p>
      </div>
    </header>
  );
};

export default Header;