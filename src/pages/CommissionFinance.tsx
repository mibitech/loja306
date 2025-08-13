import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { DollarSign, TrendingUp, TrendingDown, PieChart } from 'lucide-react';

const CommissionFinance: React.FC = () => {
  const { user, isCommissionMember } = useAuth();

  if (!isCommissionMember) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <DollarSign className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
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
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Financeiro</h1>
          <p className="text-xl opacity-90">Gestão financeira da loja</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          <Card className="shadow-soft hover:shadow-elegant transition-smooth">
            <CardHeader className="text-center">
              <TrendingUp className="w-12 h-12 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-xl">Receitas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">Controle de receitas em desenvolvimento...</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-smooth">
            <CardHeader className="text-center">
              <TrendingDown className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <CardTitle className="text-xl">Despesas</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">Controle de despesas em desenvolvimento...</p>
            </CardContent>
          </Card>

          <Card className="shadow-soft hover:shadow-elegant transition-smooth">
            <CardHeader className="text-center">
              <PieChart className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle className="text-xl">Relatórios</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center">Relatórios financeiros em desenvolvimento...</p>
            </CardContent>
          </Card>
        </div>

        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="w-6 h-6 mr-2" />
              Dashboard Financeiro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Dashboard completo em desenvolvimento...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CommissionFinance;