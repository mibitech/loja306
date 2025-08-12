import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Users } from 'lucide-react';

const MemberMessages: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Acesso restrito</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-16">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="w-6 h-6 mr-2" />
              Mensagens dos Irmãos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Sistema de mensagens em desenvolvimento...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MemberMessages;