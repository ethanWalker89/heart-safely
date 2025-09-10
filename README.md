# Heart Safely - Privacy-Preserving Dating Platform

A secure and privacy-focused dating platform built with FHE (Fully Homomorphic Encryption) technology to protect user data and ensure confidential matching.

## Features

- **Privacy-First Design**: All sensitive data is encrypted using FHE technology
- **Secure Matching**: Anonymous matching algorithm that protects user privacy
- **Wallet Integration**: Web3 wallet connection for enhanced security
- **Encrypted Profiles**: User profiles are encrypted and only decrypted when necessary
- **Smart Contract Integration**: On-chain verification and reputation system

## Technologies Used

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **UI Components**: shadcn/ui, Radix UI
- **Blockchain**: Ethereum, FHEVM, Hardhat
- **Wallet**: Web3Modal, Wagmi, Viem
- **Encryption**: FHE (Fully Homomorphic Encryption)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- Git

### Installation

1. Clone the repository:
```bash
git clone https://github.com/ethanWalker89/heart-safely.git
cd heart-safely
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Start the development server:
```bash
npm run dev
```

### Building for Production

```bash
npm run build
```

### Deployment

The project is configured for Vercel deployment. Simply connect your GitHub repository to Vercel and deploy.

## Smart Contract

The project includes a smart contract built with FHE technology to handle:
- User profile encryption
- Secure matching algorithms
- Reputation management
- Privacy-preserving interactions

## Privacy & Security

- All user data is encrypted using FHE
- No sensitive information is stored in plain text
- Wallet-based authentication
- On-chain verification system

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License.