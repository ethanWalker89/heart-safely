import { Wallet, Zap, Eye, Power, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useState, useEffect } from "react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useBalance } from 'wagmi';

const WalletComponent = () => {
  const { address, isConnected } = useAccount();
  const { data: balance } = useBalance({
    address: address,
  });
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();


  const copyAddress = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast({
        title: "Address copied",
        description: "Wallet address copied to clipboard",
      });
    }
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <Card className="p-4 gradient-card border-border">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Wallet className="w-5 h-5 text-primary" />
          <span className="font-semibold text-sm">Privacy Wallet</span>
        </div>
        <div className="flex items-center space-x-1 text-xs text-muted-foreground">
          <Eye className="w-3 h-3" />
          <span>Private</span>
        </div>
      </div>
      
      {!isConnected ? (
        <div className="space-y-3">
          <div className="text-center text-sm text-muted-foreground mb-4">
            Connect your wallet to access privacy features
          </div>
          <ConnectButton.Custom>
            {({
              account,
              chain,
              openAccountModal,
              openChainModal,
              openConnectModal,
              authenticationStatus,
              mounted,
            }) => {
              const ready = mounted && authenticationStatus !== 'loading';
              const connected =
                ready &&
                account &&
                chain &&
                (!authenticationStatus ||
                  authenticationStatus === 'authenticated');

              return (
                <div
                  {...(!ready && {
                    'aria-hidden': true,
                    'style': {
                      opacity: 0,
                      pointerEvents: 'none',
                      userSelect: 'none',
                    },
                  })}
                >
                  {(() => {
                    if (!connected) {
                      return (
                        <Button 
                          onClick={openConnectModal}
                          className="w-full"
                          variant="gradient"
                          size="sm"
                        >
                          Connect Wallet
                        </Button>
                      );
                    }

                    if (chain.unsupported) {
                      return (
                        <Button 
                          onClick={openChainModal}
                          className="w-full"
                          variant="destructive"
                          size="sm"
                        >
                          Wrong network
                        </Button>
                      );
                    }

                    return (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Address</span>
                          <div className="flex items-center space-x-1">
                            <span className="font-mono text-xs text-foreground">
                              {formatAddress(account.address)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-4 w-4"
                              onClick={copyAddress}
                            >
                              {copied ? (
                                <Check className="w-3 h-3 text-like" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Balance</span>
                          <span className="font-mono text-primary">
                            {balance ? parseFloat(balance.formatted).toFixed(3) : "0.000"} {balance?.symbol}
                          </span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Privacy Credits</span>
                          <div className="flex items-center space-x-1">
                            <Zap className="w-3 h-3 text-accent" />
                            <span className="font-mono text-accent">50</span>
                          </div>
                        </div>
                        
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" className="flex-1 text-xs">
                            Add Credits
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={openAccountModal}
                            className="px-2"
                          >
                            <Power className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              );
            }}
          </ConnectButton.Custom>
        </div>
      )}
    </Card>
  );
};

export default WalletComponent;