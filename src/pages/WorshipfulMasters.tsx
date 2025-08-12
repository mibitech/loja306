import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Crown, Calendar, Award, Users } from 'lucide-react';
import { toast } from 'sonner';

interface WorshipfulMaster {
  id: string;
  name: string;
  photo_url?: string;
  installation_year: number;
  term_start_date?: string;
  term_end_date?: string;
  bio?: string;
  achievements?: string;
  is_active: boolean;
  sort_order: number;
}

export default function WorshipfulMasters() {
  const { user, loading } = useAuth();
  const [masters, setMasters] = useState<WorshipfulMaster[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && user) {
      fetchWorshipfulMasters();
    }
  }, [user, loading]);

  const fetchWorshipfulMasters = async () => {
    try {
      const { data, error } = await supabase
        .from('worshipful_masters')
        .select('*')
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setMasters(data || []);
    } catch (error) {
      console.error('Error fetching worshipful masters:', error);
      toast.error('Erro ao carregar dados dos Veneráveis');
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const currentMaster = masters.find(master => master.is_active);
  const formerMasters = masters.filter(master => !master.is_active);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/50 to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-8 w-8 text-primary" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
              Quadro de Veneráveis
            </h1>
            <Crown className="h-8 w-8 text-primary" />
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Galeria dos Veneráveis Mestres que conduziram nossa Augusta e Respeitável Loja ao longo dos anos
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="text-center pb-4">
                  <div className="w-32 h-32 bg-muted rounded-full mx-auto mb-4"></div>
                  <div className="h-6 bg-muted rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-muted rounded w-1/2 mx-auto"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded"></div>
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-12">
            {/* Current Worshipful Master */}
            {currentMaster && (
              <div className="mb-16">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-primary mb-2">Venerável Mestre Atual</h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-primary to-primary-glow mx-auto rounded-full"></div>
                </div>
                
                <Card className="max-w-2xl mx-auto border-primary/20 shadow-elegant">
                  <CardHeader className="text-center pb-6">
                    <div className="relative mx-auto mb-6">
                      <Avatar className="w-40 h-40 border-4 border-primary/20">
                        <AvatarImage src={currentMaster.photo_url} alt={currentMaster.name} />
                        <AvatarFallback className="text-2xl bg-gradient-to-br from-primary/10 to-primary/5">
                          {currentMaster.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <Badge className="absolute -top-2 -right-2 bg-primary text-white px-3 py-1">
                        <Crown className="w-4 h-4 mr-1" />
                        Atual
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl font-bold text-foreground mb-2">
                      {currentMaster.name}
                    </CardTitle>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      <span>Ano de Instalação: {currentMaster.installation_year}</span>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {currentMaster.bio && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          Biografia
                        </h4>
                        <p className="text-muted-foreground">{currentMaster.bio}</p>
                      </div>
                    )}
                    {currentMaster.achievements && (
                      <div>
                        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Award className="w-4 h-4" />
                          Principais Realizações
                        </h4>
                        <p className="text-muted-foreground">{currentMaster.achievements}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Former Worshipful Masters */}
            {formerMasters.length > 0 && (
              <div>
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-foreground mb-2">Ex-Veneráveis Mestres</h2>
                  <div className="w-24 h-1 bg-gradient-to-r from-muted-foreground to-muted mx-auto rounded-full"></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {formerMasters.map((master) => (
                    <Card key={master.id} className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border-muted">
                      <CardHeader className="text-center pb-4">
                        <Avatar className="w-32 h-32 mx-auto mb-4 border-2 border-muted">
                          <AvatarImage src={master.photo_url} alt={master.name} />
                          <AvatarFallback className="text-xl bg-gradient-to-br from-muted/10 to-muted/5">
                            {master.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <CardTitle className="text-xl font-bold text-foreground mb-2">
                          {master.name}
                        </CardTitle>
                        <div className="flex items-center justify-center gap-2 text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm">{master.installation_year}</span>
                        </div>
                        {master.term_start_date && master.term_end_date && (
                          <p className="text-xs text-muted-foreground">
                            {new Date(master.term_start_date).toLocaleDateString('pt-BR')} - {new Date(master.term_end_date).toLocaleDateString('pt-BR')}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {master.bio && (
                          <div>
                            <h4 className="font-semibold text-sm text-foreground mb-1">Biografia</h4>
                            <p className="text-sm text-muted-foreground line-clamp-3">{master.bio}</p>
                          </div>
                        )}
                        {master.achievements && (
                          <div>
                            <h4 className="font-semibold text-sm text-foreground mb-1 flex items-center gap-1">
                              <Award className="w-3 h-3" />
                              Realizações
                            </h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">{master.achievements}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!isLoading && masters.length === 0 && (
          <Card className="max-w-md mx-auto">
            <CardContent className="text-center py-12">
              <Crown className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum Venerável Cadastrado</h3>
              <p className="text-muted-foreground">
                Os dados dos Veneráveis Mestres ainda não foram cadastrados no sistema.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}