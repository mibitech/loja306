import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Calendar, MapPin, Clock, Users } from 'lucide-react';
import { format, isAfter, isBefore } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Event {
  id: string;
  title: string;
  description: string;
  event_date: string;
  location: string;
  image_url: string;
  is_public: boolean;
  created_at: string;
}

const Events: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data until Supabase types are regenerated
    const mockEvents: Event[] = [
      {
        id: '1',
        title: 'Sessão Magna de Posse',
        description: 'Cerimônia de posse da nova administração da loja.',
        event_date: '2024-03-15T19:00:00',
        location: 'Templo da Loja',
        image_url: '',
        is_public: false,
        created_at: '2024-01-01'
      },
      {
        id: '2',
        title: 'Palestra Pública: Valores Maçônicos',
        description: 'Evento aberto ao público sobre os valores e princípios da maçonaria.',
        event_date: '2024-03-25T20:00:00',
        location: 'Auditório Municipal',
        image_url: '',
        is_public: true,
        created_at: '2024-01-02'
      },
      {
        id: '3',
        title: 'Sessão Ordinária',
        description: 'Reunião ordinária dos irmãos para tratar dos assuntos da loja.',
        event_date: '2024-04-05T19:30:00',
        location: 'Templo da Loja',
        image_url: '',
        is_public: false,
        created_at: '2024-01-03'
      },
      {
        id: '4',
        title: 'Feira de Livros Maçônicos',
        description: 'Exposição e venda de livros sobre maçonaria e temas relacionados.',
        event_date: '2024-04-20T09:00:00',
        location: 'Salão de Eventos',
        image_url: '',
        is_public: true,
        created_at: '2024-01-04'
      },
      {
        id: '5',
        title: 'Conferência: Maçonaria e Sociedade',
        description: 'Discussão sobre o papel da maçonaria na sociedade contemporânea.',
        event_date: '2024-01-10T19:00:00',
        location: 'Centro de Convenções',
        image_url: '',
        is_public: true,
        created_at: '2024-01-05'
      }
    ];

    // Only show public events since we don't have authentication context here
    const publicEvents = mockEvents.filter(event => event.is_public);

    setTimeout(() => {
      setEvents(publicEvents);
      setLoading(false);
    }, 500);
  }, []);

  const getEventStatus = (eventDate: string) => {
    const now = new Date();
    const date = new Date(eventDate);
    
    if (isBefore(date, now)) {
      return { status: 'past', label: 'Realizado', variant: 'secondary' as const };
    } else if (isAfter(date, now)) {
      return { status: 'upcoming', label: 'Próximo', variant: 'default' as const };
    } else {
      return { status: 'today', label: 'Hoje', variant: 'destructive' as const };
    }
  };

  const upcomingEvents = events.filter(event => 
    isAfter(new Date(event.event_date), new Date())
  );
  
  const pastEvents = events.filter(event => 
    isBefore(new Date(event.event_date), new Date())
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const EventCard: React.FC<{ event: Event }> = ({ event }) => {
    const eventStatus = getEventStatus(event.event_date);
    
    return (
      <Card className="shadow-soft hover:shadow-elegant transition-smooth">
        {event.image_url && (
          <img
            src={event.image_url}
            alt={event.title}
            className="w-full h-48 object-cover rounded-t-lg"
          />
        )}
        
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-xl text-primary pr-2">
              {event.title}
            </CardTitle>
            <Badge variant={eventStatus.variant}>
              {eventStatus.label}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent>
          {event.description && (
            <p className="text-muted-foreground mb-4">
              {event.description}
            </p>
          )}
          
          <div className="space-y-2">
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2 text-primary" />
              {format(new Date(event.event_date), "EEEE, dd 'de' MMMM 'de' yyyy", { 
                locale: ptBR 
              })}
            </div>
            
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              {format(new Date(event.event_date), "HH:mm", { locale: ptBR })}
            </div>
            
            {event.location && (
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mr-2 text-primary" />
                {event.location}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Eventos e Calendário
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Acompanhe nossas atividades e participe dos eventos abertos ao público
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Upcoming Events */}
        {upcomingEvents.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-primary mb-8 flex items-center">
              <Calendar className="w-8 h-8 mr-3" />
              Próximos Eventos
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Past Events */}
        {pastEvents.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-primary mb-8 flex items-center">
              <Users className="w-8 h-8 mr-3" />
              Eventos Realizados
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* No Events */}
        {events.length === 0 && (
          <div className="text-center py-16">
            <Calendar className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              Nenhum evento encontrado
            </h3>
            <p className="text-muted-foreground">
              Novos eventos serão divulgados em breve.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;