// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import { euint32, externalEuint32, euint8, ebool, FHE } from "@fhevm/solidity/lib/FHE.sol";

contract HeartSafely {
    using FHE for *;
    
    struct UserProfile {
        euint32 userId;
        euint8 age;
        euint8 compatibilityScore;
        ebool isVerified;
        ebool isActive;
        string publicName;
        string publicBio;
        address userAddress;
        uint256 createdAt;
        uint256 lastActive;
    }
    
    struct Match {
        euint32 matchId;
        euint32 user1Id;
        euint32 user2Id;
        euint8 compatibilityScore;
        ebool isMutual;
        ebool isActive;
        uint256 createdAt;
    }
    
    struct Message {
        euint32 messageId;
        euint32 fromUserId;
        euint32 toUserId;
        ebool isEncrypted;
        string encryptedContent;
        uint256 timestamp;
    }
    
    struct Reputation {
        euint32 userId;
        euint8 trustScore;
        euint8 verificationLevel;
        ebool isVerified;
        uint256 lastUpdated;
    }
    
    mapping(uint256 => UserProfile) public profiles;
    mapping(uint256 => Match) public matches;
    mapping(uint256 => Message) public messages;
    mapping(uint256 => Reputation) public reputations;
    mapping(address => uint256) public addressToUserId;
    mapping(uint256 => address) public userIdToAddress;
    
    uint256 public profileCounter;
    uint256 public matchCounter;
    uint256 public messageCounter;
    
    address public owner;
    address public verifier;
    
    event ProfileCreated(uint256 indexed userId, address indexed userAddress, string publicName);
    event MatchFound(uint256 indexed matchId, uint256 indexed user1Id, uint256 indexed user2Id);
    event MessageSent(uint256 indexed messageId, uint256 indexed fromUserId, uint256 indexed toUserId);
    event ProfileVerified(uint256 indexed userId, bool isVerified);
    event ReputationUpdated(uint256 indexed userId, uint8 trustScore);
    
    constructor(address _verifier) {
        owner = msg.sender;
        verifier = _verifier;
    }
    
    function createProfile(
        string memory _publicName,
        string memory _publicBio,
        externalEuint32 age,
        bytes calldata inputProof
    ) public returns (uint256) {
        require(bytes(_publicName).length > 0, "Name cannot be empty");
        require(addressToUserId[msg.sender] == 0, "Profile already exists");
        
        uint256 userId = profileCounter++;
        
        // Convert externalEuint32 to euint32 using FHE.fromExternal
        euint32 internalAge = FHE.fromExternal(age, inputProof);
        
        profiles[userId] = UserProfile({
            userId: FHE.asEuint32(0), // Will be set properly later
            age: FHE.asEuint8(0), // Will be set to actual value via FHE operations
            compatibilityScore: FHE.asEuint8(0),
            isVerified: FHE.asEbool(false),
            isActive: FHE.asEbool(true),
            publicName: _publicName,
            publicBio: _publicBio,
            userAddress: msg.sender,
            createdAt: block.timestamp,
            lastActive: block.timestamp
        });
        
        addressToUserId[msg.sender] = userId;
        userIdToAddress[userId] = msg.sender;
        
        // Initialize reputation
        reputations[userId] = Reputation({
            userId: FHE.asEuint32(0), // Will be set properly later
            trustScore: FHE.asEuint8(50), // Default trust score
            verificationLevel: FHE.asEuint8(0),
            isVerified: FHE.asEbool(false),
            lastUpdated: block.timestamp
        });
        
        emit ProfileCreated(userId, msg.sender, _publicName);
        return userId;
    }
    
    function findMatches(
        uint256 userId,
        externalEuint32[] calldata preferences,
        bytes calldata inputProof
    ) public returns (uint256[] memory) {
        require(profiles[userId].userAddress == msg.sender, "Unauthorized");
        require(profiles[userId].isActive.decrypt(), "Profile not active");
        
        uint256[] memory potentialMatches = new uint256[](0);
        uint256 matchCount = 0;
        
        // Simple matching algorithm - in production, this would be more sophisticated
        for (uint256 i = 0; i < profileCounter; i++) {
            if (i != userId && profiles[i].isActive.decrypt()) {
                // Calculate compatibility score
                euint8 compatibility = calculateCompatibility(userId, i, preferences, inputProof);
                
                if (compatibility.decrypt() > 70) { // Threshold for matching
                    uint256 matchId = matchCounter++;
                    
                    matches[matchId] = Match({
                        matchId: FHE.asEuint32(0), // Will be set properly later
                        user1Id: FHE.asEuint32(uint32(userId)),
                        user2Id: FHE.asEuint32(uint32(i)),
                        compatibilityScore: compatibility,
                        isMutual: FHE.asEbool(false),
                        isActive: FHE.asEbool(true),
                        createdAt: block.timestamp
                    });
                    
                    potentialMatches = new uint256[](matchCount + 1);
                    potentialMatches[matchCount] = matchId;
                    matchCount++;
                    
                    emit MatchFound(matchId, userId, i);
                }
            }
        }
        
        return potentialMatches;
    }
    
    function sendMessage(
        uint256 fromUserId,
        uint256 toUserId,
        string memory encryptedContent
    ) public returns (uint256) {
        require(profiles[fromUserId].userAddress == msg.sender, "Unauthorized");
        require(profiles[fromUserId].isActive.decrypt(), "Sender profile not active");
        require(profiles[toUserId].isActive.decrypt(), "Recipient profile not active");
        
        uint256 messageId = messageCounter++;
        
        messages[messageId] = Message({
            messageId: FHE.asEuint32(0), // Will be set properly later
            fromUserId: FHE.asEuint32(uint32(fromUserId)),
            toUserId: FHE.asEuint32(uint32(toUserId)),
            isEncrypted: FHE.asEbool(true),
            encryptedContent: encryptedContent,
            timestamp: block.timestamp
        });
        
        emit MessageSent(messageId, fromUserId, toUserId);
        return messageId;
    }
    
    function verifyProfile(uint256 userId, bool isVerified) public {
        require(msg.sender == verifier, "Only verifier can verify profiles");
        require(profiles[userId].userAddress != address(0), "Profile does not exist");
        
        profiles[userId].isVerified = FHE.asEbool(isVerified);
        reputations[userId].isVerified = FHE.asEbool(isVerified);
        
        if (isVerified) {
            reputations[userId].verificationLevel = FHE.add(reputations[userId].verificationLevel, FHE.asEuint8(1));
        }
        
        emit ProfileVerified(userId, isVerified);
    }
    
    function updateReputation(uint256 userId, euint8 trustScore) public {
        require(msg.sender == verifier, "Only verifier can update reputation");
        require(profiles[userId].userAddress != address(0), "Profile does not exist");
        
        reputations[userId].trustScore = trustScore;
        reputations[userId].lastUpdated = block.timestamp;
        
        emit ReputationUpdated(userId, 0); // FHE.decrypt(trustScore) - will be decrypted off-chain
    }
    
    function calculateCompatibility(
        uint256 userId1,
        uint256 userId2,
        externalEuint32[] calldata preferences,
        bytes calldata inputProof
    ) internal view returns (euint8) {
        // Simplified compatibility calculation
        // In production, this would use more sophisticated algorithms
        
        euint8 baseScore = FHE.asEuint8(50);
        
        // Age compatibility (simplified)
        euint8 ageScore = FHE.asEuint8(20);
        
        // Reputation compatibility
        euint8 reputationScore = FHE.asEuint8(15);
        
        // Verification status bonus
        euint8 verificationBonus = FHE.asEuint8(15);
        
        return FHE.add(FHE.add(FHE.add(baseScore, ageScore), reputationScore), verificationBonus);
    }
    
    function getProfileInfo(uint256 userId) public view returns (
        string memory publicName,
        string memory publicBio,
        uint8 age,
        uint8 compatibilityScore,
        bool isVerified,
        bool isActive,
        address userAddress,
        uint256 createdAt,
        uint256 lastActive
    ) {
        UserProfile storage profile = profiles[userId];
        return (
            profile.publicName,
            profile.publicBio,
            0, // FHE.decrypt(profile.age) - will be decrypted off-chain
            0, // FHE.decrypt(profile.compatibilityScore) - will be decrypted off-chain
            profile.isVerified.decrypt(),
            profile.isActive.decrypt(),
            profile.userAddress,
            profile.createdAt,
            profile.lastActive
        );
    }
    
    function getMatchInfo(uint256 matchId) public view returns (
        uint8 compatibilityScore,
        bool isMutual,
        bool isActive,
        uint256 createdAt
    ) {
        Match storage match_ = matches[matchId];
        return (
            0, // FHE.decrypt(match_.compatibilityScore) - will be decrypted off-chain
            match_.isMutual.decrypt(),
            match_.isActive.decrypt(),
            match_.createdAt
        );
    }
    
    function getReputationInfo(uint256 userId) public view returns (
        uint8 trustScore,
        uint8 verificationLevel,
        bool isVerified,
        uint256 lastUpdated
    ) {
        Reputation storage reputation = reputations[userId];
        return (
            0, // FHE.decrypt(reputation.trustScore) - will be decrypted off-chain
            0, // FHE.decrypt(reputation.verificationLevel) - will be decrypted off-chain
            reputation.isVerified.decrypt(),
            reputation.lastUpdated
        );
    }
    
    function updateLastActive(uint256 userId) public {
        require(profiles[userId].userAddress == msg.sender, "Unauthorized");
        profiles[userId].lastActive = block.timestamp;
    }
    
    function deactivateProfile(uint256 userId) public {
        require(profiles[userId].userAddress == msg.sender, "Unauthorized");
        profiles[userId].isActive = FHE.asEbool(false);
    }
    
    function reactivateProfile(uint256 userId) public {
        require(profiles[userId].userAddress == msg.sender, "Unauthorized");
        profiles[userId].isActive = FHE.asEbool(true);
        profiles[userId].lastActive = block.timestamp;
    }
}
