import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
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
    const fetchEvents = async () => {
      try {
        const { data } = await supabase
          .from('events')
          .select('*')
          .eq('is_public', true)
          .order('event_date', { ascending: true });

        setEvents(data || []);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
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