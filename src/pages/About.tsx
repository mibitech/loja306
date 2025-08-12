import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Users, Phone, Mail, Globe, MapPin } from 'lucide-react';

interface LodgeInfo {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  mission: string;
  vision: string;
  values: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  logo_url: string;
  hero_image_url: string;
}

interface Officer {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo_url: string;
  sort_order: number;
}

const About: React.FC = () => {
  const [lodgeInfo, setLodgeInfo] = useState<LodgeInfo | null>(null);
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch lodge info
        const { data: lodge } = await supabase
          .from('lodge_info')
          .select('*')
          .single();

        // Fetch officers
        const { data: officersData } = await supabase
          .from('officers')
          .select('*')
          .eq('active', true)
          .order('sort_order');

        setLodgeInfo(lodge);
        setOfficers(officersData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
          <div className="flex items-center justify-center mb-6 gap-8">
            <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden bg-white shadow-elegant flex items-center justify-center">
              <img 
                src="/lovable-uploads/555a306b-3510-4fe9-a1f9-b5df542462af.png" 
                alt="Logo da Loja Maçônica"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold">
              {lodgeInfo?.name || 'Nossa Loja'}
            </h1>
          </div>
          {lodgeInfo?.subtitle && (
            <p className="text-xl md:text-2xl opacity-90 mb-8">
              {lodgeInfo.subtitle}
            </p>
          )}
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Description */}
        {lodgeInfo?.description && (
          <section className="mb-16">
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="text-2xl text-primary">Nossa História</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg leading-relaxed text-muted-foreground">
                  {lodgeInfo.description}
                </p>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Mission, Vision, Values */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {lodgeInfo?.mission && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Missão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{lodgeInfo.mission}</p>
              </CardContent>
            </Card>
          )}
          
          {lodgeInfo?.vision && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Visão</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{lodgeInfo.vision}</p>
              </CardContent>
            </Card>
          )}
          
          {lodgeInfo?.values && (
            <Card className="shadow-soft">
              <CardHeader>
                <CardTitle className="text-xl text-primary">Valores</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{lodgeInfo.values}</p>
              </CardContent>
            </Card>
          )}
        </section>

        {/* Officers */}
        {officers.length > 0 && (
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-primary mb-8 text-center">
              Oficiais da Loja
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {officers.map((officer) => (
                <Card key={officer.id} className="shadow-soft hover:shadow-elegant transition-smooth">
                  <CardContent className="p-6 text-center">
                    {officer.photo_url && (
                      <img
                        src={officer.photo_url}
                        alt={officer.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                    )}
                    <h3 className="text-xl font-semibold text-primary mb-2">
                      {officer.name}
                    </h3>
                    <Badge variant="secondary" className="mb-3">
                      {officer.position}
                    </Badge>
                    {officer.bio && (
                      <p className="text-sm text-muted-foreground">
                        {officer.bio}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* Contact Information */}
        <section>
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="text-2xl text-primary flex items-center">
                <Users className="w-6 h-6 mr-2" />
                Informações de Contato
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lodgeInfo?.address && (
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-primary mt-1" />
                  <span className="text-muted-foreground">{lodgeInfo.address}</span>
                </div>
              )}
              
              {lodgeInfo?.phone && (
                <div className="flex items-center space-x-3">
                  <Phone className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">{lodgeInfo.phone}</span>
                </div>
              )}
              
              {lodgeInfo?.email && (
                <div className="flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">{lodgeInfo.email}</span>
                </div>
              )}
              
              {lodgeInfo?.website && (
                <div className="flex items-center space-x-3">
                  <Globe className="w-5 h-5 text-primary" />
                  <a 
                    href={lodgeInfo.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {lodgeInfo.website}
                  </a>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </div>
  );
};

export default About;