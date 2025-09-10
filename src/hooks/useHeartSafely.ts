import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { HEART_SAFELY_CONTRACT_ADDRESS, HEART_SAFELY_ABI } from '@/lib/contracts/HeartSafelyContract';
import { useState } from 'react';

export interface UserProfile {
  publicName: string;
  publicBio: string;
  age: number;
  compatibilityScore: number;
  isVerified: boolean;
  isActive: boolean;
  userAddress: string;
  createdAt: bigint;
  lastActive: bigint;
}

export interface MatchInfo {
  compatibilityScore: number;
  isMutual: boolean;
  isActive: boolean;
  createdAt: bigint;
}

export interface ReputationInfo {
  trustScore: number;
  verificationLevel: number;
  isVerified: boolean;
  lastUpdated: bigint;
}

export const useHeartSafely = () => {
  const { address } = useAccount();
  const { writeContract } = useWriteContract();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Get user profile
  const getUserProfile = (userId: number) => {
    return useReadContract({
      address: HEART_SAFELY_CONTRACT_ADDRESS,
      abi: HEART_SAFELY_ABI,
      functionName: 'getProfileInfo',
      args: [BigInt(userId)],
    });
  };

  // Get match information
  const getMatchInfo = (matchId: number) => {
    return useReadContract({
      address: HEART_SAFELY_CONTRACT_ADDRESS,
      abi: HEART_SAFELY_ABI,
      functionName: 'getMatchInfo',
      args: [BigInt(matchId)],
    });
  };

  // Get reputation information
  const getReputationInfo = (userId: number) => {
    return useReadContract({
      address: HEART_SAFELY_CONTRACT_ADDRESS,
      abi: HEART_SAFELY_ABI,
      functionName: 'getReputationInfo',
      args: [BigInt(userId)],
    });
  };

  // Create profile
  const createProfile = async (
    publicName: string,
    publicBio: string,
    age: number,
    inputProof: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const hash = await writeContract({
        address: HEART_SAFELY_CONTRACT_ADDRESS,
        abi: HEART_SAFELY_ABI,
        functionName: 'createProfile',
        args: [publicName, publicBio, age, inputProof],
      });

      return hash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Find matches
  const findMatches = async (
    userId: number,
    preferences: number[],
    inputProof: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const hash = await writeContract({
        address: HEART_SAFELY_CONTRACT_ADDRESS,
        abi: HEART_SAFELY_ABI,
        functionName: 'findMatches',
        args: [BigInt(userId), preferences.map(p => BigInt(p)), inputProof],
      });

      return hash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to find matches');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Send message
  const sendMessage = async (
    fromUserId: number,
    toUserId: number,
    encryptedContent: string
  ) => {
    try {
      setIsLoading(true);
      setError(null);

      const hash = await writeContract({
        address: HEART_SAFELY_CONTRACT_ADDRESS,
        abi: HEART_SAFELY_ABI,
        functionName: 'sendMessage',
        args: [BigInt(fromUserId), BigInt(toUserId), encryptedContent],
      });

      return hash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Update last active
  const updateLastActive = async (userId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const hash = await writeContract({
        address: HEART_SAFELY_CONTRACT_ADDRESS,
        abi: HEART_SAFELY_ABI,
        functionName: 'updateLastActive',
        args: [BigInt(userId)],
      });

      return hash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update last active');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Deactivate profile
  const deactivateProfile = async (userId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const hash = await writeContract({
        address: HEART_SAFELY_CONTRACT_ADDRESS,
        abi: HEART_SAFELY_ABI,
        functionName: 'deactivateProfile',
        args: [BigInt(userId)],
      });

      return hash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to deactivate profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Reactivate profile
  const reactivateProfile = async (userId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      const hash = await writeContract({
        address: HEART_SAFELY_CONTRACT_ADDRESS,
        abi: HEART_SAFELY_ABI,
        functionName: 'reactivateProfile',
        args: [BigInt(userId)],
      });

      return hash;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reactivate profile');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    // State
    isLoading,
    error,
    address,
    
    // Read functions
    getUserProfile,
    getMatchInfo,
    getReputationInfo,
    
    // Write functions
    createProfile,
    findMatches,
    sendMessage,
    updateLastActive,
    deactivateProfile,
    reactivateProfile,
  };
};
