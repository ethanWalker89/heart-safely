import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAccount } from "wagmi";
import Header from "@/components/Header";
import WalletComponent from "@/components/Wallet";
import SwipeCard from "@/components/SwipeCard";
import MatchModal from "@/components/MatchModal";
import { useHeartSafely } from "@/hooks/useHeartSafely";

// Import profile images
import profile1 from "@/assets/profile1.jpg";
import profile2 from "@/assets/profile2.jpg";
import profile3 from "@/assets/profile3.jpg";

const mockProfiles = [
  {
    id: "1",
    name: "Alex",
    age: 28,
    image: profile1,
    location: "San Francisco",
    occupation: "Software Engineer",
    bio: "Love hiking, coffee, and building cool apps. Always down for adventures and deep conversations about tech and life.",
    interests: ["Hiking", "Coffee", "Tech", "Travel", "Photography"]
  },
  {
    id: "2", 
    name: "Sam",
    age: 26,
    image: profile2,
    location: "New York",
    occupation: "Designer",
    bio: "Creative soul who finds beauty in everyday moments. Passionate about art, music, and making the world more beautiful.",
    interests: ["Art", "Music", "Design", "Yoga", "Cooking"]
  },
  {
    id: "3",
    name: "Jordan",
    age: 30,
    image: profile3,
    location: "Los Angeles", 
    occupation: "Marketing Director",
    bio: "Entrepreneur with a love for innovation and connecting with people. Always exploring new ideas and experiences.",
    interests: ["Entrepreneurship", "Fitness", "Reading", "Networking", "Innovation"]
  }
];

const Index = () => {
  const [currentProfileIndex, setCurrentProfileIndex] = useState(0);
  const [matchModalOpen, setMatchModalOpen] = useState(false);
  const [matchedProfile, setMatchedProfile] = useState<string>("");
  const [likedProfiles, setLikedProfiles] = useState<string[]>([]);
  const [userProfileId, setUserProfileId] = useState<number | null>(null);
  const { toast } = useToast();
  const { address, isConnected } = useAccount();
  const { createProfile, findMatches, updateLastActive, isLoading } = useHeartSafely();

  // Initialize user profile when wallet connects
  useEffect(() => {
    if (isConnected && address && !userProfileId) {
      initializeUserProfile();
    }
  }, [isConnected, address, userProfileId]);

  const initializeUserProfile = async () => {
    try {
      // For demo purposes, we'll create a profile with encrypted age
      // In production, this would use proper FHE encryption
      const mockInputProof = "0x" + "0".repeat(64); // Mock proof for demo
      
      const hash = await createProfile(
        "Anonymous User",
        "Privacy-focused individual looking for meaningful connections",
        25, // This would be encrypted in production
        mockInputProof
      );
      
      if (hash) {
        // In production, you'd get the actual profile ID from the transaction receipt
        setUserProfileId(1); // Mock profile ID
        toast({
          title: "Profile Created",
          description: "Your encrypted profile has been created successfully",
        });
      }
    } catch (error) {
      console.error("Failed to create profile:", error);
      toast({
        title: "Profile Creation Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleSwipe = async (direction: 'left' | 'right', profileId: string) => {
    const currentProfile = mockProfiles[currentProfileIndex];
    
    if (direction === 'right') {
      setLikedProfiles(prev => [...prev, profileId]);
      
      // Update last active on blockchain
      if (userProfileId) {
        try {
          await updateLastActive(userProfileId);
        } catch (error) {
          console.error("Failed to update last active:", error);
        }
      }
      
      // Simulate match (30% chance)
      if (Math.random() > 0.7) {
        setMatchedProfile(currentProfile.name);
        setMatchModalOpen(true);
      } else {
        toast({
          title: "Like sent!",
          description: `Your interest in ${currentProfile.name} has been encrypted and sent privately.`,
        });
      }
    } else {
      toast({
        title: "Pass",
        description: "Moving to the next profile...",
      });
    }

    // Move to next profile
    if (currentProfileIndex < mockProfiles.length - 1) {
      setCurrentProfileIndex(prev => prev + 1);
    } else {
      // Reset to beginning or show "no more profiles" message
      setCurrentProfileIndex(0);
      toast({
        title: "That's everyone for now!",
        description: "Check back later for more profiles.",
      });
    }
  };

  const currentProfile = mockProfiles[currentProfileIndex];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Wallet Sidebar */}
          <div className="lg:col-span-1">
            <WalletComponent />
          </div>
          
          {/* Main Swipe Area */}
          <div className="lg:col-span-2 flex items-center justify-center">
            <div className="w-full max-w-sm">
              {currentProfile ? (
                <SwipeCard 
                  profile={currentProfile}
                  onSwipe={handleSwipe}
                />
              ) : (
                <div className="text-center text-muted-foreground">
                  <p>No more profiles available</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Stats/Info Sidebar */}
          <div className="lg:col-span-1 space-y-4">
            <div className="gradient-card p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-3 text-primary">Today's Activity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Profiles viewed</span>
                  <span className="text-foreground">{currentProfileIndex + 1}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Likes sent</span>
                  <span className="text-heart">{likedProfiles.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Matches</span>
                  <span className="text-match">2</span>
                </div>
              </div>
            </div>
            
            <div className="gradient-card p-4 rounded-lg border border-border">
              <h3 className="font-semibold mb-3 text-primary">Privacy Status</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Encryption</span>
                  <span className="text-like">Active</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Data sharing</span>
                  <span className="text-pass">Disabled</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Anonymous mode</span>
                  <span className="text-like">Enabled</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Match Modal */}
      <MatchModal 
        isOpen={matchModalOpen}
        onClose={() => setMatchModalOpen(false)}
        profileName={matchedProfile}
      />
    </div>
  );
};

export default Index;