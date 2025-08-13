import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { Settings, Calendar, Activity, Users, Plus } from 'lucide-react';

const CommissionCRUD: React.FC = () => {
  const { user, isCommissionMember } = useAuth();

  if (!isCommissionMember) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground">
              {user ? 'Acesso apenas para membros da comissão.' : 'Faça login para acessar esta área.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <section className="py-20 px-4 text-center bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Cadastros</h1>
          <p className="text-xl opacity-90">Gerenciamento de dados da loja</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="activities">Atividades</TabsTrigger>
            <TabsTrigger value="profiles">Perfis</TabsTrigger>
          </TabsList>
          
          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Calendar className="w-6 h-6 mr-2" />
                  Gerenciar Eventos
                </CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Evento
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Sistema de cadastro de eventos em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Activity className="w-6 h-6 mr-2" />
                  Gerenciar Atividades
                </CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Nova Atividade
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Sistema de cadastro de atividades em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profiles" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  Gerenciar Perfis
                </CardTitle>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Perfil
                </Button>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Sistema de cadastro de perfis em desenvolvimento...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommissionCRUD;