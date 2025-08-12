import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarDays, Users, Book, Heart, ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import masonicHeroImg from '@/assets/masonic-hero.jpg';
import charityWorkImg from '@/assets/charity-work.jpg';
import educationImg from '@/assets/education.jpg';

const Index = () => {
  const [lodgeInfo, setLodgeInfo] = useState({
    name: 'Loja Maçônica Luz e Progresso',
    subtitle: 'Tradição, Conhecimento e Fraternidade',
    description: 'Somos uma loja maçônica dedicada ao aperfeiçoamento moral e intelectual de nossos membros, promovendo valores de liberdade, igualdade e fraternidade.',
    mission: 'Formar homens íntegros e conscientes de seus deveres para com a sociedade.',
    vision: 'Ser uma referência em educação moral e desenvolvimento humano.',
    values: 'Honestidade, Fraternidade, Tolerância e Busca pela Verdade'
  });

  const [featuredActivities, setFeaturedActivities] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Buscar atividades em destaque
        const { data: activities, error: activitiesError } = await supabase
          .from('activities')
          .select('*')
          .eq('is_featured', true)
          .eq('is_public', true)
          .order('event_date', { ascending: false })
          .limit(2);

        if (activitiesError) {
          console.error('Erro ao buscar atividades:', activitiesError);
        } else {
          setFeaturedActivities(activities || []);
        }

        // Buscar próximos eventos
        const { data: events, error: eventsError } = await supabase
          .from('events')
          .select('*')
          .eq('is_public', true)
          .gte('event_date', new Date().toISOString())
          .order('event_date', { ascending: true })
          .limit(2);

        if (eventsError) {
          console.error('Erro ao buscar eventos:', eventsError);
        } else {
          setUpcomingEvents(events || []);
        }
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('pt-BR');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={masonicHeroImg} 
            alt="Templo Maçônico" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-masonic-dark/80 via-masonic-dark/70 to-masonic-dark/90" />
        </div>
        
        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-masonic bg-clip-text text-transparent">
            {lodgeInfo.name}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-white/90">
            {lodgeInfo.subtitle}
          </p>
          <p className="text-lg mb-12 text-white/80 max-w-2xl mx-auto leading-relaxed">
            {lodgeInfo.description}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-masonic-gold hover:bg-masonic-gold/90 text-masonic-dark font-semibold">
              <Link to="/about">
                Conheça Nossa História
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild size="lg" className="bg-masonic-gold hover:bg-masonic-gold/90 text-masonic-dark font-semibold">
              <Link to="/activities">
                Nossas Atividades
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Mission, Vision, Values */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-masonic-dark">Nossos Pilares</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Os valores que nos guiam em nossa jornada de aperfeiçoamento
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gradient-to-br from-masonic-light/5 to-white border-masonic-light/20 hover:shadow-glow transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-masonic-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-masonic-dark" />
                </div>
                <CardTitle className="text-masonic-dark">Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground leading-relaxed">
                  {lodgeInfo.mission}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-masonic-light/5 to-white border-masonic-light/20 hover:shadow-glow transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-masonic-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-masonic-dark" />
                </div>
                <CardTitle className="text-masonic-dark">Visão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground leading-relaxed">
                  {lodgeInfo.vision}
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-masonic-light/5 to-white border-masonic-light/20 hover:shadow-glow transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-masonic-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <Book className="h-8 w-8 text-masonic-dark" />
                </div>
                <CardTitle className="text-masonic-dark">Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground leading-relaxed">
                  {lodgeInfo.values}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-masonic-dark">Atividades em Destaque</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Conheça algumas das nossas principais iniciativas e projetos sociais
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {loading ? (
              <div className="col-span-2 text-center py-8">
                <p className="text-muted-foreground">Carregando atividades...</p>
              </div>
            ) : featuredActivities.length > 0 ? (
              featuredActivities.map((activity) => (
                <Card key={activity.id} className="overflow-hidden hover:shadow-glow transition-all duration-300">
                  {activity.image_url && (
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={activity.image_url} 
                        alt={activity.title}
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="bg-masonic-light/10 text-masonic-dark">
                        {activity.category}
                      </Badge>
                      {activity.event_date && (
                        <div className="flex items-center text-sm text-muted-foreground">
                          <CalendarDays className="h-4 w-4 mr-1" />
                          {formatDate(activity.event_date)}
                        </div>
                      )}
                    </div>
                    <CardTitle className="text-masonic-dark">{activity.title}</CardTitle>
                    <CardDescription>{activity.description}</CardDescription>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-muted-foreground">Nenhuma atividade em destaque encontrada.</p>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/activities">
                Ver Todas as Atividades
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-6 text-masonic-dark">Próximos Eventos</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fique por dentro da nossa agenda de eventos e atividades
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {loading ? (
              <div className="col-span-2 text-center py-8">
                <p className="text-muted-foreground">Carregando eventos...</p>
              </div>
            ) : upcomingEvents.length > 0 ? (
              upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-2">
                      {event.is_public && (
                        <Badge className="bg-masonic-gold text-masonic-dark">
                          Público
                        </Badge>
                      )}
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarDays className="h-4 w-4 mr-1" />
                        {formatDateTime(event.event_date)}
                      </div>
                    </div>
                    <CardTitle className="text-masonic-dark">{event.title}</CardTitle>
                    <CardDescription>{event.location}</CardDescription>
                  </CardHeader>
                </Card>
              ))
            ) : (
              <div className="col-span-2 text-center py-8">
                <p className="text-muted-foreground">Nenhum evento próximo encontrado.</p>
              </div>
            )}
          </div>
          
          <div className="text-center">
            <Button asChild variant="outline" size="lg">
              <Link to="/events">
                Ver Agenda Completa
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-masonic text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">Interesse em Conhecer Mais?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto text-white/90">
            Entre em contato conosco para saber mais sobre nossa loja e como fazer parte desta fraternidade milenar.
          </p>
          <Button asChild size="lg" className="bg-white text-masonic-dark hover:bg-white/90 font-semibold">
            <Link to="/contact">
              Entre em Contato
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Index;