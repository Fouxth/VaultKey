
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, FileText, Key, Lock } from "lucide-react";

export function VaultContent() {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-green-500/10 rounded-full">
          <Shield className="h-8 w-8 text-green-500" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-gradient">Secret Vault</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Welcome to the exclusive content vault. This secure area is only accessible
          to holders of the Vault Key NFT.
        </p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <SecretCard 
          icon={<FileText className="h-8 w-8 text-vault-500" />}
          title="Confidential Documents"
          content="Access to all private documentation, including research papers, technical specifications, and exclusive reports."
        />
        
        <SecretCard 
          icon={<Key className="h-8 w-8 text-vault-500" />}
          title="API Access Keys"
          content="Exclusive API keys and developer credentials for premium services and integrations."
        />
        
        <SecretCard 
          icon={<Lock className="h-8 w-8 text-vault-500" />}
          title="Encrypted Messages"
          content="Secure communications and encrypted updates directly from the team to key holders."
        />
        
        <SecretCard 
          icon={<Shield className="h-8 w-8 text-vault-500" />}
          title="Premium Support"
          content="Direct access to premium support channels and priority assistance for all your needs."
        />
      </div>
      
      <Card className="mt-12 border-2 border-vault-300/30 glass-card">
        <CardHeader className="pb-2">
          <CardTitle>NFT Holder Benefits</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            As a Vault Key NFT holder, you now have unlimited access to all premium content and features.
            We regularly update the vault with new exclusive content. Check back often for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

interface SecretCardProps {
  icon: React.ReactNode;
  title: string;
  content: string;
}

function SecretCard({ icon, title, content }: SecretCardProps) {
  return (
    <Card className="glass-card border-vault-300/20 hover:border-vault-300/50 transition-all duration-300">
      <CardHeader className="pb-2">
        <div className="flex items-start gap-4">
          {icon}
          <CardTitle>{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{content}</p>
      </CardContent>
    </Card>
  );
}
