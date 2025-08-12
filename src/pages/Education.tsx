import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Book, HelpCircle, BookOpen, Search, User } from 'lucide-react';
import educationImage from '@/assets/education.jpg';
import { supabase } from '@/integrations/supabase/client';

interface EducationalContent {
  id: string;
  title: string;
  content: string;
  category: string;
  author: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
}

const Education: React.FC = () => {
  const [content, setContent] = useState<EducationalContent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('introduction');

  const categoryLabels = {
    introduction: 'Introdução',
    articles: 'Artigos',
    glossary: 'Glossário',
    faq: 'FAQ',
    reading: 'Leituras'
  };

  const categoryIcons = {
    introduction: BookOpen,
    articles: Book,
    glossary: Search,
    faq: HelpCircle,
    reading: User
  };

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('educational_content')
          .select('*')
          .order('sort_order', { ascending: true });

        if (error) {
          console.error('Error fetching educational content:', error);
          return;
        }

        setContent(data || []);
      } catch (error) {
        console.error('Error fetching educational content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const getFilteredContent = (category: string) => {
    return content
      .filter(item => item.category === category)
      .filter(item => 
        searchTerm === '' || 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
  };

  const ContentCard: React.FC<{ item: EducationalContent }> = ({ item }) => (
    <Card className={`shadow-soft hover:shadow-elegant transition-smooth ${
      item.is_featured ? 'ring-2 ring-masonic-gold/50' : ''
    }`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-primary">
            {item.title}
          </CardTitle>
          {item.is_featured && (
            <Badge className="bg-masonic-gold text-masonic-navy">
              Destaque
            </Badge>
          )}
        </div>
        {item.author && (
          <p className="text-sm text-muted-foreground flex items-center">
            <User className="w-4 h-4 mr-1" />
            {item.author}
          </p>
        )}
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm max-w-none text-muted-foreground">
          {item.content.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-3 last:mb-0">
              {paragraph}
            </p>
          ))}
        </div>
      </CardContent>
    </Card>
  );

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
      <section className="relative py-20 px-4 text-center">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${educationImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-primary/90"></div>
        </div>
        <div className="relative container mx-auto max-w-4xl text-primary-foreground">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Conteúdo Educativo
          </h1>
          <p className="text-xl md:text-2xl opacity-90">
            Conhecimento e sabedoria maçônica ao alcance de todos
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar conteúdo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5 mb-8">
            {Object.entries(categoryLabels).map(([key, label]) => {
              const Icon = categoryIcons[key as keyof typeof categoryIcons];
              return (
                <TabsTrigger key={key} value={key} className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {Object.keys(categoryLabels).map((category) => {
            const filteredContent = getFilteredContent(category);
            
            return (
              <TabsContent key={category} value={category}>
                {filteredContent.length === 0 ? (
                  <div className="text-center py-16">
                    <Book className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                      {searchTerm ? 'Nenhum resultado encontrado' : 'Conteúdo em breve'}
                    </h3>
                    <p className="text-muted-foreground">
                      {searchTerm 
                        ? 'Tente outros termos de busca.' 
                        : 'Novos conteúdos serão adicionados em breve.'
                      }
                    </p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {filteredContent.map((item) => (
                      <ContentCard key={item.id} item={item} />
                    ))}
                  </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <Card className="shadow-elegant bg-gradient-primary text-primary-foreground">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">
                Interessado em Saber Mais?
              </h2>
              <p className="text-lg opacity-90 mb-6">
                Entre em contato conosco para conhecer melhor nossa filosofia e trabalhos.
              </p>
              <Button variant="secondary" size="lg" asChild>
                <a href="/contact">
                  Fale Conosco
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Education;