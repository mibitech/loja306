import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { User } from 'lucide-react';

const Profile: React.FC = () => {
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
              <User className="w-6 h-6 mr-2" />
              Perfil do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Email: {user.email}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;