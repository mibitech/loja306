import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Settings, Calendar as CalendarIcon, Activity, Users, Plus, Edit, Trash2, Crown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

// Types
interface Event {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  is_public: boolean;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface ActivityType {
  id: string;
  title: string;
  description?: string;
  content?: string;
  category: string;
  is_public: boolean;
  is_featured: boolean;
  event_date?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

interface Profile {
  id: string;
  user_id: string;
  full_name?: string;
  role?: string;
  position?: string;
  photo_url?: string;
  is_commission_member: boolean;
  created_at: string;
  updated_at: string;
}

interface WorshipfulMaster {
  id: string;
  name: string;
  installation_year: number;
  term_start_date?: string;
  term_end_date?: string;
  bio?: string;
  achievements?: string;
  photo_url?: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

const CommissionCRUD: React.FC = () => {
  const { user, isCommissionMember } = useAuth();
  
  // States for data
  const [events, setEvents] = useState<Event[]>([]);
  const [activities, setActivities] = useState<ActivityType[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [masters, setMasters] = useState<WorshipfulMaster[]>([]);
  
  // States for forms
  const [eventForm, setEventForm] = useState<Partial<Event>>({});
  const [activityForm, setActivityForm] = useState<Partial<ActivityType>>({});
  const [profileForm, setProfileForm] = useState<Partial<Profile>>({});
  const [masterForm, setMasterForm] = useState<Partial<WorshipfulMaster>>({});
  
  // States for dialogs
  const [eventDialog, setEventDialog] = useState(false);
  const [activityDialog, setActivityDialog] = useState(false);
  const [profileDialog, setProfileDialog] = useState(false);
  const [masterDialog, setMasterDialog] = useState(false);
  
  // States for edit mode
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [editingActivity, setEditingActivity] = useState<string | null>(null);
  const [editingProfile, setEditingProfile] = useState<string | null>(null);
  const [editingMaster, setEditingMaster] = useState<string | null>(null);

  if (!isCommissionMember) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <Settings className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
            <p className="text-muted-foreground">
              {user ? 'Acesso apenas para membros da comissão.' : 'Faça login para acessar esta área.'}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Load data
  useEffect(() => {
    loadEvents();
    loadActivities();
    loadProfiles();
    loadMasters();
  }, []);

  const loadEvents = async () => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: false });
    
    if (error) {
      toast({ title: 'Erro', description: 'Falha ao carregar eventos', variant: 'destructive' });
    } else {
      setEvents(data || []);
    }
  };

  const loadActivities = async () => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      toast({ title: 'Erro', description: 'Falha ao carregar atividades', variant: 'destructive' });
    } else {
      setActivities(data || []);
    }
  };

  const loadProfiles = async () => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('full_name', { ascending: true });
    
    if (error) {
      toast({ title: 'Erro', description: 'Falha ao carregar perfis', variant: 'destructive' });
    } else {
      setProfiles(data || []);
    }
  };

  const loadMasters = async () => {
    const { data, error } = await supabase
      .from('worshipful_masters')
      .select('*')
      .order('installation_year', { ascending: false });
    
    if (error) {
      toast({ title: 'Erro', description: 'Falha ao carregar mestres', variant: 'destructive' });
    } else {
      setMasters(data || []);
    }
  };

  // Event CRUD
  const saveEvent = async () => {
    if (!eventForm.title || !eventForm.event_date) {
      toast({ title: 'Erro', description: 'Título e data são obrigatórios', variant: 'destructive' });
      return;
    }

    const eventData = {
      title: eventForm.title,
      event_date: eventForm.event_date,
      description: eventForm.description,
      location: eventForm.location,
      image_url: eventForm.image_url,
      is_public: eventForm.is_public ?? true
    };

    if (editingEvent) {
      const { error } = await supabase
        .from('events')
        .update(eventData)
        .eq('id', editingEvent);
      
      if (error) {
        toast({ title: 'Erro', description: 'Falha ao atualizar evento', variant: 'destructive' });
      } else {
        toast({ title: 'Sucesso', description: 'Evento atualizado com sucesso' });
        loadEvents();
        setEventDialog(false);
        setEventForm({});
        setEditingEvent(null);
      }
    } else {
      const { error } = await supabase.from('events').insert(eventData);
      
      if (error) {
        toast({ title: 'Erro', description: 'Falha ao criar evento', variant: 'destructive' });
      } else {
        toast({ title: 'Sucesso', description: 'Evento criado com sucesso' });
        loadEvents();
        setEventDialog(false);
        setEventForm({});
      }
    }
  };

  const editEvent = (event: Event) => {
    setEventForm(event);
    setEditingEvent(event.id);
    setEventDialog(true);
  };

  const deleteEvent = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      const { error } = await supabase.from('events').delete().eq('id', id);
      
      if (error) {
        toast({ title: 'Erro', description: 'Falha ao excluir evento', variant: 'destructive' });
      } else {
        toast({ title: 'Sucesso', description: 'Evento excluído com sucesso' });
        loadEvents();
      }
    }
  };

  // Activity CRUD
  const saveActivity = async () => {
    if (!activityForm.title || !activityForm.category) {
      toast({ title: 'Erro', description: 'Título e categoria são obrigatórios', variant: 'destructive' });
      return;
    }

    const activityData = {
      title: activityForm.title,
      category: activityForm.category,
      description: activityForm.description,
      content: activityForm.content,
      image_url: activityForm.image_url,
      event_date: activityForm.event_date,
      is_public: activityForm.is_public ?? true,
      is_featured: activityForm.is_featured ?? false
    };

    if (editingActivity) {
      const { error } = await supabase
        .from('activities')
        .update(activityData)
        .eq('id', editingActivity);
      
      if (error) {
        toast({ title: 'Erro', description: 'Falha ao atualizar atividade', variant: 'destructive' });
      } else {
        toast({ title: 'Sucesso', description: 'Atividade atualizada com sucesso' });
        loadActivities();
        setActivityDialog(false);
        setActivityForm({});
        setEditingActivity(null);
      }
    } else {
      const { error } = await supabase.from('activities').insert(activityData);
      
      if (error) {
        toast({ title: 'Erro', description: 'Falha ao criar atividade', variant: 'destructive' });
      } else {
        toast({ title: 'Sucesso', description: 'Atividade criada com sucesso' });
        loadActivities();
        setActivityDialog(false);
        setActivityForm({});
      }
    }
  };

  const editActivity = (activity: ActivityType) => {
    setActivityForm(activity);
    setEditingActivity(activity.id);
    setActivityDialog(true);
  };

  const deleteActivity = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta atividade?')) {
      const { error } = await supabase.from('activities').delete().eq('id', id);
      
      if (error) {
        toast({ title: 'Erro', description: 'Falha ao excluir atividade', variant: 'destructive' });
      } else {
        toast({ title: 'Sucesso', description: 'Atividade excluída com sucesso' });
        loadActivities();
      }
    }
  };

  // Profile CRUD
  const saveProfile = async () => {
    const profileData = { ...profileForm };

    if (editingProfile) {
      const { error } = await supabase
        .from('profiles')
        .update(profileData)
        .eq('id', editingProfile);
      
      if (error) {
        toast({ title: 'Erro', description: 'Falha ao atualizar perfil', variant: 'destructive' });
      } else {
        toast({ title: 'Sucesso', description: 'Perfil atualizado com sucesso' });
        loadProfiles();
        setProfileDialog(false);
        setProfileForm({});
        setEditingProfile(null);
      }
    }
  };

  const editProfile = (profile: Profile) => {
    setProfileForm(profile);
    setEditingProfile(profile.id);
    setProfileDialog(true);
  };

  // Master CRUD
  const saveMaster = async () => {
    if (!masterForm.name || !masterForm.installation_year) {
      toast({ title: 'Erro', description: 'Nome e ano de instalação são obrigatórios', variant: 'destructive' });
      return;
    }

    const masterData = {
      name: masterForm.name,
      installation_year: masterForm.installation_year,
      term_start_date: masterForm.term_start_date,
      term_end_date: masterForm.term_end_date,
      bio: masterForm.bio,
      achievements: masterForm.achievements,
      photo_url: masterForm.photo_url,
      is_active: masterForm.is_active ?? false,
      sort_order: masterForm.sort_order ?? 0
    };

    if (editingMaster) {
      const { error } = await supabase
        .from('worshipful_masters')
        .update(masterData)
        .eq('id', editingMaster);
      
      if (error) {
        toast({ title: 'Erro', description: 'Falha ao atualizar mestre', variant: 'destructive' });
      } else {
        toast({ title: 'Sucesso', description: 'Mestre atualizado com sucesso' });
        loadMasters();
        setMasterDialog(false);
        setMasterForm({});
        setEditingMaster(null);
      }
    } else {
      const { error } = await supabase.from('worshipful_masters').insert(masterData);
      
      if (error) {
        toast({ title: 'Erro', description: 'Falha ao criar mestre', variant: 'destructive' });
      } else {
        toast({ title: 'Sucesso', description: 'Mestre criado com sucesso' });
        loadMasters();
        setMasterDialog(false);
        setMasterForm({});
      }
    }
  };

  const editMaster = (master: WorshipfulMaster) => {
    setMasterForm(master);
    setEditingMaster(master.id);
    setMasterDialog(true);
  };

  const deleteMaster = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este mestre?')) {
      const { error } = await supabase.from('worshipful_masters').delete().eq('id', id);
      
      if (error) {
        toast({ title: 'Erro', description: 'Falha ao excluir mestre', variant: 'destructive' });
      } else {
        toast({ title: 'Sucesso', description: 'Mestre excluído com sucesso' });
        loadMasters();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <section className="py-20 px-4 text-center bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Cadastros</h1>
          <p className="text-xl opacity-90">Gerenciamento de dados da loja</p>
        </div>
      </section>

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <Tabs defaultValue="events" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="events">Eventos</TabsTrigger>
            <TabsTrigger value="activities">Atividades</TabsTrigger>
            <TabsTrigger value="profiles">Perfis</TabsTrigger>
            <TabsTrigger value="masters">Mestres</TabsTrigger>
          </TabsList>
          
          {/* Events Tab */}
          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <CalendarIcon className="w-6 h-6 mr-2" />
                  Gerenciar Eventos
                </CardTitle>
                <Dialog open={eventDialog} onOpenChange={setEventDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setEventForm({});
                      setEditingEvent(null);
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Evento
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingEvent ? 'Editar' : 'Novo'} Evento</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Título *</Label>
                        <Input
                          value={eventForm.title || ''}
                          onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Textarea
                          value={eventForm.description || ''}
                          onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Data do Evento *</Label>
                        <Input
                          type="datetime-local"
                          value={eventForm.event_date ? new Date(eventForm.event_date).toISOString().slice(0, 16) : ''}
                          onChange={(e) => setEventForm({...eventForm, event_date: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Local</Label>
                        <Input
                          value={eventForm.location || ''}
                          onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>URL da Imagem</Label>
                        <Input
                          value={eventForm.image_url || ''}
                          onChange={(e) => setEventForm({...eventForm, image_url: e.target.value})}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={eventForm.is_public ?? true}
                          onCheckedChange={(checked) => setEventForm({...eventForm, is_public: checked})}
                        />
                        <Label>Evento Público</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setEventDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={saveEvent}>Salvar</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Local</TableHead>
                      <TableHead>Público</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id}>
                        <TableCell>{event.title}</TableCell>
                        <TableCell>{format(new Date(event.event_date), 'dd/MM/yyyy HH:mm')}</TableCell>
                        <TableCell>{event.location || '-'}</TableCell>
                        <TableCell>{event.is_public ? 'Sim' : 'Não'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => editEvent(event)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteEvent(event.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Activities Tab */}
          <TabsContent value="activities" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Activity className="w-6 h-6 mr-2" />
                  Gerenciar Atividades
                </CardTitle>
                <Dialog open={activityDialog} onOpenChange={setActivityDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setActivityForm({});
                      setEditingActivity(null);
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Atividade
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingActivity ? 'Editar' : 'Nova'} Atividade</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Título *</Label>
                        <Input
                          value={activityForm.title || ''}
                          onChange={(e) => setActivityForm({...activityForm, title: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Categoria *</Label>
                        <Input
                          value={activityForm.category || ''}
                          onChange={(e) => setActivityForm({...activityForm, category: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Descrição</Label>
                        <Textarea
                          value={activityForm.description || ''}
                          onChange={(e) => setActivityForm({...activityForm, description: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Conteúdo</Label>
                        <Textarea
                          value={activityForm.content || ''}
                          onChange={(e) => setActivityForm({...activityForm, content: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>URL da Imagem</Label>
                        <Input
                          value={activityForm.image_url || ''}
                          onChange={(e) => setActivityForm({...activityForm, image_url: e.target.value})}
                        />
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={activityForm.is_public ?? true}
                            onCheckedChange={(checked) => setActivityForm({...activityForm, is_public: checked})}
                          />
                          <Label>Público</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Switch
                            checked={activityForm.is_featured ?? false}
                            onCheckedChange={(checked) => setActivityForm({...activityForm, is_featured: checked})}
                          />
                          <Label>Destaque</Label>
                        </div>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setActivityDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={saveActivity}>Salvar</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Título</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Público</TableHead>
                      <TableHead>Destaque</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {activities.map((activity) => (
                      <TableRow key={activity.id}>
                        <TableCell>{activity.title}</TableCell>
                        <TableCell>{activity.category}</TableCell>
                        <TableCell>{activity.is_public ? 'Sim' : 'Não'}</TableCell>
                        <TableCell>{activity.is_featured ? 'Sim' : 'Não'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => editActivity(activity)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteActivity(activity.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Profiles Tab */}
          <TabsContent value="profiles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-6 h-6 mr-2" />
                  Gerenciar Perfis
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Posição</TableHead>
                      <TableHead>Comissão</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profiles.map((profile) => (
                      <TableRow key={profile.id}>
                        <TableCell>{profile.full_name || '-'}</TableCell>
                        <TableCell>{profile.role || '-'}</TableCell>
                        <TableCell>{profile.position || '-'}</TableCell>
                        <TableCell>{profile.is_commission_member ? 'Sim' : 'Não'}</TableCell>
                        <TableCell>
                          <Dialog open={profileDialog && editingProfile === profile.id} onOpenChange={(open) => {
                            setProfileDialog(open);
                            if (!open) setEditingProfile(null);
                          }}>
                            <DialogTrigger asChild>
                              <Button size="sm" variant="outline" onClick={() => editProfile(profile)}>
                                <Edit className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Editar Perfil</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label>Nome Completo</Label>
                                  <Input
                                    value={profileForm.full_name || ''}
                                    onChange={(e) => setProfileForm({...profileForm, full_name: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label>Cargo</Label>
                                  <Input
                                    value={profileForm.role || ''}
                                    onChange={(e) => setProfileForm({...profileForm, role: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label>Posição</Label>
                                  <Input
                                    value={profileForm.position || ''}
                                    onChange={(e) => setProfileForm({...profileForm, position: e.target.value})}
                                  />
                                </div>
                                <div>
                                  <Label>URL da Foto</Label>
                                  <Input
                                    value={profileForm.photo_url || ''}
                                    onChange={(e) => setProfileForm({...profileForm, photo_url: e.target.value})}
                                  />
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Switch
                                    checked={profileForm.is_commission_member ?? false}
                                    onCheckedChange={(checked) => setProfileForm({...profileForm, is_commission_member: checked})}
                                  />
                                  <Label>Membro da Comissão</Label>
                                </div>
                                <div className="flex justify-end space-x-2">
                                  <Button variant="outline" onClick={() => setProfileDialog(false)}>
                                    Cancelar
                                  </Button>
                                  <Button onClick={saveProfile}>Salvar</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Masters Tab */}
          <TabsContent value="masters" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="flex items-center">
                  <Crown className="w-6 h-6 mr-2" />
                  Gerenciar Mestres Veneráveis
                </CardTitle>
                <Dialog open={masterDialog} onOpenChange={setMasterDialog}>
                  <DialogTrigger asChild>
                    <Button onClick={() => {
                      setMasterForm({});
                      setEditingMaster(null);
                    }}>
                      <Plus className="w-4 h-4 mr-2" />
                      Novo Mestre
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingMaster ? 'Editar' : 'Novo'} Mestre Venerável</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Nome *</Label>
                        <Input
                          value={masterForm.name || ''}
                          onChange={(e) => setMasterForm({...masterForm, name: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Ano de Instalação *</Label>
                        <Input
                          type="number"
                          value={masterForm.installation_year || ''}
                          onChange={(e) => setMasterForm({...masterForm, installation_year: parseInt(e.target.value)})}
                        />
                      </div>
                      <div>
                        <Label>Data Início do Mandato</Label>
                        <Input
                          type="date"
                          value={masterForm.term_start_date || ''}
                          onChange={(e) => setMasterForm({...masterForm, term_start_date: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Data Fim do Mandato</Label>
                        <Input
                          type="date"
                          value={masterForm.term_end_date || ''}
                          onChange={(e) => setMasterForm({...masterForm, term_end_date: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Biografia</Label>
                        <Textarea
                          value={masterForm.bio || ''}
                          onChange={(e) => setMasterForm({...masterForm, bio: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Realizações</Label>
                        <Textarea
                          value={masterForm.achievements || ''}
                          onChange={(e) => setMasterForm({...masterForm, achievements: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>URL da Foto</Label>
                        <Input
                          value={masterForm.photo_url || ''}
                          onChange={(e) => setMasterForm({...masterForm, photo_url: e.target.value})}
                        />
                      </div>
                      <div>
                        <Label>Ordem de Exibição</Label>
                        <Input
                          type="number"
                          value={masterForm.sort_order || 0}
                          onChange={(e) => setMasterForm({...masterForm, sort_order: parseInt(e.target.value)})}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={masterForm.is_active ?? false}
                          onCheckedChange={(checked) => setMasterForm({...masterForm, is_active: checked})}
                        />
                        <Label>Ativo</Label>
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" onClick={() => setMasterDialog(false)}>
                          Cancelar
                        </Button>
                        <Button onClick={saveMaster}>Salvar</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Ano</TableHead>
                      <TableHead>Período</TableHead>
                      <TableHead>Ativo</TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {masters.map((master) => (
                      <TableRow key={master.id}>
                        <TableCell>{master.name}</TableCell>
                        <TableCell>{master.installation_year}</TableCell>
                        <TableCell>
                          {master.term_start_date && master.term_end_date
                            ? `${format(new Date(master.term_start_date), 'dd/MM/yyyy')} - ${format(new Date(master.term_end_date), 'dd/MM/yyyy')}`
                            : '-'
                          }
                        </TableCell>
                        <TableCell>{master.is_active ? 'Sim' : 'Não'}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" onClick={() => editMaster(master)}>
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteMaster(master.id)}>
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default CommissionCRUD;