import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Upload, Eye, Download, Calendar, User, FileText, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface StudyWork {
  id: string;
  brother_name: string;
  work_title: string;
  file_path: string;
  file_size: number;
  upload_date: string;
  description: string;
  category: string;
  is_approved: boolean;
  uploaded_by: string;
}

const MemberStudyTime: React.FC = () => {
  const { user } = useAuth();
  const [studyWorks, setStudyWorks] = useState<StudyWork[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
  // Form data
  const [brotherName, setBrotherName] = useState('');
  const [workTitle, setWorkTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('geral');

  useEffect(() => {
    fetchStudyWorks();
  }, []);

  const fetchStudyWorks = async () => {
    try {
      const { data, error } = await supabase
        .from('study_works')
        .select('*')
        .order('upload_date', { ascending: false });

      if (error) throw error;
      setStudyWorks(data || []);
    } catch (error) {
      console.error('Erro ao buscar trabalhos:', error);
      toast.error('Erro ao carregar trabalhos de estudo');
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Apenas arquivos PDF são permitidos');
        return;
      }
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        toast.error('Arquivo muito grande. Máximo 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !user || !brotherName || !workTitle) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setUploading(true);
    try {
      // Upload file to storage
      const fileName = `${user.id}/${Date.now()}_${selectedFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('study-documents')
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      // Save to database
      const { error: dbError } = await supabase
        .from('study_works')
        .insert({
          brother_name: brotherName,
          work_title: workTitle,
          file_path: fileName,
          file_size: selectedFile.size,
          description,
          category,
          uploaded_by: user.id
        });

      if (dbError) throw dbError;

      toast.success('Trabalho enviado com sucesso!');
      setIsDialogOpen(false);
      resetForm();
      fetchStudyWorks();
    } catch (error) {
      console.error('Erro no upload:', error);
      toast.error('Erro ao enviar trabalho');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setBrotherName('');
    setWorkTitle('');
    setDescription('');
    setCategory('geral');
    setSelectedFile(null);
  };

  const viewDocument = async (filePath: string) => {
    try {
      const { data } = await supabase.storage
        .from('study-documents')
        .createSignedUrl(filePath, 60);

      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      }
    } catch (error) {
      console.error('Erro ao visualizar documento:', error);
      toast.error('Erro ao abrir documento');
    }
  };

  const downloadDocument = async (filePath: string, fileName: string) => {
    try {
      const { data } = await supabase.storage
        .from('study-documents')
        .download(filePath);

      if (data) {
        const url = URL.createObjectURL(data);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Erro no download:', error);
      toast.error('Erro ao baixar documento');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-2">Tempo de Estudos</h1>
            <p className="text-muted-foreground">
              Repositório de trabalhos acadêmicos e estudos dos irmãos
            </p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-primary hover:opacity-90">
                <Plus className="w-4 h-4 mr-2" />
                Novo Trabalho
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Enviar Novo Trabalho</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="brotherName">Nome do Irmão *</Label>
                    <Input
                      id="brotherName"
                      value={brotherName}
                      onChange={(e) => setBrotherName(e.target.value)}
                      placeholder="Nome completo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Categoria</Label>
                    <select
                      id="category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                    >
                      <option value="geral">Geral</option>
                      <option value="historia">História Maçônica</option>
                      <option value="filosofia">Filosofia</option>
                      <option value="simbolismo">Simbolismo</option>
                      <option value="ritual">Ritual</option>
                      <option value="outros">Outros</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="workTitle">Título do Trabalho *</Label>
                  <Input
                    id="workTitle"
                    value={workTitle}
                    onChange={(e) => setWorkTitle(e.target.value)}
                    placeholder="Título do trabalho"
                  />
                </div>
                
                <div>
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Breve descrição do trabalho"
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label htmlFor="file">Arquivo PDF *</Label>
                  <Input
                    id="file"
                    type="file"
                    accept=".pdf"
                    onChange={handleFileSelect}
                    className="cursor-pointer"
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Arquivo selecionado: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>
                
                <div className="flex justify-end space-x-4 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button onClick={handleUpload} disabled={uploading}>
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Enviar
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Study Works List */}
        <div className="grid gap-6">
          {studyWorks.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum trabalho encontrado</h3>
                <p className="text-muted-foreground">
                  Seja o primeiro a compartilhar um trabalho de estudo!
                </p>
              </CardContent>
            </Card>
          ) : (
            studyWorks.map((work) => (
              <Card key={work.id} className="shadow-soft hover:shadow-elegant transition-smooth">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-primary mb-2">
                        {work.work_title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <User className="w-4 h-4 mr-1" />
                          {work.brother_name}
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(work.upload_date).toLocaleDateString('pt-BR')}
                        </div>
                        <Badge variant="secondary">{work.category}</Badge>
                        {work.is_approved && (
                          <Badge variant="default">Aprovado</Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {work.description && (
                    <p className="text-muted-foreground mb-4">{work.description}</p>
                  )}
                  
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewDocument(work.file_path)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Visualizar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadDocument(work.file_path, work.work_title + '.pdf')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Baixar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberStudyTime;