import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Users, Heart, Award, BookOpen, Eye } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import charityImage from '@/assets/charity-work.jpg';

interface Activity {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  image_url: string;
  gallery_images: string[];
  results: string;
  partnerships: string[];
  event_date: string;
  is_featured: boolean;
  is_public: boolean;
  created_at: string;
}

const Activities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categoryLabels = {
    all: 'Todas',
    social: 'Ações Sociais',
    philanthropic: 'Filantropia',
    public_event: 'Eventos Públicos',
    cultural: 'Cultura',
    educational: 'Educação'
  };

  const categoryIcons = {
    social: Heart,
    philanthropic: Users,
    public_event: Calendar,
    cultural: Award,
    educational: BookOpen
  };

  useEffect(() => {
    // Mock data until Supabase types are regenerated
    const mockActivities: Activity[] = [
      {
        id: '1',
        title: 'Campanha de Arrecadação de Alimentos',
        description: 'Campanha beneficente para arrecadação de alimentos não perecíveis.',
        content: 'Nossa loja promoveu uma grande campanha de arrecadação de alimentos que beneficiou mais de 200 famílias carentes da região.',
        category: 'social',
        image_url: charityImage,
        gallery_images: [charityImage],
        results: 'Arrecadadas 2 toneladas de alimentos, beneficiando 200 famílias',
        partnerships: ['Casa de Apoio Santa Maria', 'Orfanato São José'],
        event_date: '2024-01-15',
        is_featured: true,
        is_public: true,
        created_at: '2024-01-15'
      },
      {
        id: '2',
        title: 'Palestra Pública: História da Maçonaria',
        description: 'Evento educativo aberto ao público sobre a história da maçonaria no Brasil.',
        content: 'Realizamos uma palestra pública ministrada pelo Ir. João Silva sobre a história da maçonaria no Brasil.',
        category: 'educational',
        image_url: charityImage,
        gallery_images: [],
        results: 'Mais de 100 pessoas presentes, grande interesse do público',
        partnerships: ['Centro Cultural da Cidade'],
        event_date: '2024-02-20',
        is_featured: false,
        is_public: true,
        created_at: '2024-02-20'
      },
      {
        id: '3',
        title: 'Projeto Educação para Todos',
        description: 'Iniciativa educacional para jovens em situação de vulnerabilidade.',
        content: 'Programa de mentoria e apoio educacional para jovens da comunidade.',
        category: 'educational',
        image_url: charityImage,
        gallery_images: [],
        results: '50 jovens atendidos, 80% de aprovação escolar',
        partnerships: ['Escola Municipal Santos Dumont'],
        event_date: '2024-03-10',
        is_featured: true,
        is_public: true,
        created_at: '2024-03-10'
      }
    ];

    // Filter by category if not 'all'
    const filteredActivities = selectedCategory === 'all' 
      ? mockActivities 
      : mockActivities.filter(activity => activity.category === selectedCategory);

    setTimeout(() => {
      setActivities(filteredActivities);
      setLoading(false);
    }, 500);
  }, [selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Atividades e Projetos
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Nosso compromisso com a sociedade através de ações concretas
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-12 justify-center">
          {Object.entries(categoryLabels).map(([key, label]) => {
            const isActive = selectedCategory === key;
            return (
              <Button
                key={key}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(key)}
                className="transition-smooth"
              >
                {label}
              </Button>
            );
          })}
        </div>

        {/* Activities Grid */}
        {activities.length === 0 ? (
          <div className="text-center py-16">
            <Eye className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              Nenhuma atividade encontrada
            </h3>
            <p className="text-muted-foreground">
              Não há atividades na categoria selecionada.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activities.map((activity) => {
              const CategoryIcon = categoryIcons[activity.category as keyof typeof categoryIcons];
              
              return (
                <Card 
                  key={activity.id} 
                  className={`shadow-soft hover:shadow-elegant transition-smooth ${
                    activity.is_featured ? 'ring-2 ring-masonic-gold/50' : ''
                  }`}
                >
                  <div className="relative">
                    <img
                      src={activity.image_url || charityImage}
                      alt={activity.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {activity.is_featured && (
                      <Badge className="absolute top-3 right-3 bg-masonic-gold text-masonic-navy">
                        Destaque
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg text-primary pr-2">
                        {activity.title}
                      </CardTitle>
                      {CategoryIcon && (
                        <CategoryIcon className="w-5 h-5 text-primary flex-shrink-0" />
                      )}
                    </div>
                    <Badge variant="secondary" className="w-fit">
                      {categoryLabels[activity.category as keyof typeof categoryLabels]}
                    </Badge>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-muted-foreground mb-4 line-clamp-3">
                      {activity.description}
                    </p>
                    
                    {activity.event_date && (
                      <div className="flex items-center text-sm text-muted-foreground mb-3">
                        <Calendar className="w-4 h-4 mr-2" />
                        {format(new Date(activity.event_date), "dd 'de' MMMM 'de' yyyy", { 
                          locale: ptBR 
                        })}
                      </div>
                    )}
                    
                    {activity.partnerships && activity.partnerships.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-semibold text-primary mb-2">Parcerias:</h4>
                        <div className="flex flex-wrap gap-1">
                          {activity.partnerships.map((partner, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {partner}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {activity.results && (
                      <div className="bg-accent/50 p-3 rounded-lg">
                        <h4 className="text-sm font-semibold text-primary mb-1">Resultados:</h4>
                        <p className="text-sm text-muted-foreground">
                          {activity.results}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Activities;