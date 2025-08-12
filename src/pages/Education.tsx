import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Book, HelpCircle, BookOpen, Search, User } from 'lucide-react';
import educationImage from '@/assets/education.jpg';

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
    // Mock data until Supabase types are regenerated
    const mockContent: EducationalContent[] = [
      {
        id: '1',
        title: 'O que é a Maçonaria?',
        content: 'A Maçonaria é uma instituição iniciática, filosófica, educativa, filantrópica e progressista. Seus membros, chamados maçons, buscam o aperfeiçoamento moral e intelectual através de simbolismo e rituais tradicionais.\n\nFundada nos princípios de Liberdade, Igualdade e Fraternidade, a Maçonaria promove o desenvolvimento do caráter e o bem-estar da humanidade.',
        category: 'introduction',
        author: 'Grande Loja',
        is_featured: true,
        sort_order: 1,
        created_at: '2024-01-01'
      },
      {
        id: '2',
        title: 'História da Maçonaria no Brasil',
        content: 'A Maçonaria chegou ao Brasil no século XVIII e teve papel fundamental na independência do país. Muitos dos protagonistas da independência eram maçons, incluindo Dom Pedro I.\n\nA primeira loja maçônica brasileira foi fundada no Rio de Janeiro em 1801, e desde então a instituição tem contribuído para o desenvolvimento social e cultural do país.',
        category: 'introduction',
        author: 'Ir. José Santos',
        is_featured: true,
        sort_order: 2,
        created_at: '2024-01-02'
      },
      {
        id: '3',
        title: 'Símbolos Maçônicos Básicos',
        content: 'Os principais símbolos da maçonaria incluem:\n\n• Esquadro e Compasso: Representam a moralidade e os limites que devemos observar\n• Avental: Símbolo do trabalho e da pureza\n• Pilares da Sabedoria, Força e Beleza: Sustentáculos da loja\n• Régua de 24 polegadas: Divisão do tempo\n• Nível: Igualdade entre os homens',
        category: 'introduction',
        author: 'Ir. Pedro Silva',
        is_featured: false,
        sort_order: 3,
        created_at: '2024-01-03'
      },
      {
        id: '4',
        title: 'Graus Maçônicos',
        content: 'A Maçonaria está dividida em três graus simbólicos:\n\n1º Grau - Aprendiz: Simboliza o nascimento e a juventude\n2º Grau - Companheiro: Representa a idade viril e o trabalho\n3º Grau - Mestre: Simboliza a maturidade e sabedoria\n\nCada grau possui seus próprios ensinamentos, símbolos e rituais específicos.',
        category: 'articles',
        author: 'Ir. Carlos Mendes',
        is_featured: true,
        sort_order: 1,
        created_at: '2024-01-04'
      },
      {
        id: '5',
        title: 'Esquadro',
        content: 'Instrumento utilizado pelos pedreiros para formar ângulos retos. Na Maçonaria, simboliza a retidão moral e a justiça. Representa os deveres que temos para com nossos semelhantes.',
        category: 'glossary',
        author: 'Dicionário Maçônico',
        is_featured: false,
        sort_order: 1,
        created_at: '2024-01-05'
      },
      {
        id: '6',
        title: 'Compasso',
        content: 'Instrumento de geometria usado para traçar círculos. Simboliza a moderação e os limites dentro dos quais devemos manter nossos desejos e paixões.',
        category: 'glossary',
        author: 'Dicionário Maçônico',
        is_featured: false,
        sort_order: 2,
        created_at: '2024-01-06'
      },
      {
        id: '7',
        title: 'Como posso me tornar maçom?',
        content: 'Para se tornar maçom, você deve:\n\n• Ser maior de 21 anos\n• Ter boa reputação moral\n• Acreditar em um Ser Supremo\n• Ter meios de subsistência lícitos\n• Ser apresentado por um maçom ativo\n\nO processo inclui entrevistas, investigação moral e votação pelos membros da loja.',
        category: 'faq',
        author: 'Comissão de Admissão',
        is_featured: true,
        sort_order: 1,
        created_at: '2024-01-07'
      },
      {
        id: '8',
        title: 'Que livros posso ler sobre Maçonaria?',
        content: 'Recomendamos os seguintes livros para iniciantes:\n\n• "Freemasons For Dummies" - Christopher Hodapp\n• "A Franco-Maçonaria" - José Castellani\n• "Curso de Maçonaria Simbólica" - Irmão X\n• "Manual do Maçom" - Nicola Aslan\n• "História da Maçonaria no Brasil" - José Castellani',
        category: 'reading',
        author: 'Biblioteca da Loja',
        is_featured: false,
        sort_order: 1,
        created_at: '2024-01-08'
      }
    ];

    setTimeout(() => {
      setContent(mockContent);
      setLoading(false);
    }, 500);
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