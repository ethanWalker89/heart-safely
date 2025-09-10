import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, mainnet } from 'wagmi/chains';
import { http } from 'viem';

export const config = getDefaultConfig({
  appName: 'Heart Safely',
  projectId: import.meta.env.VITE_WALLET_CONNECT_PROJECT_ID || 'YOUR_PROJECT_ID',
  chains: [sepolia, mainnet],
  transports: {
    [sepolia.id]: http(import.meta.env.VITE_ALCHEMY_API_KEY ? `https://eth-sepolia.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}` : 'https://rpc.sepolia.org'),
    [mainnet.id]: http(import.meta.env.VITE_ALCHEMY_API_KEY ? `https://eth-mainnet.g.alchemy.com/v2/${import.meta.env.VITE_ALCHEMY_API_KEY}` : 'https://eth.llamarpc.com'),
  },
  ssr: false,
});
