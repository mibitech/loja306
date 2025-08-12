
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { User, LogOut, Shield, Book, Users, Calendar, Crown, Menu, X, Triangle } from 'lucide-react';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, signOut, loading } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const publicNavItems = [
    { href: '/', label: 'Início' },
    { href: '/about', label: 'Sobre Nós' },
    { href: '/activities', label: 'Atividades' },
    { href: '/events', label: 'Eventos' },
    { href: '/education', label: 'Educação' },
    { href: '/contact', label: 'Contato' },
  ];

  const memberNavItems = [
    { href: '/members', label: 'Área dos Irmãos', icon: Shield },
    { href: '/members/documents', label: 'Documentos', icon: Book },
    { href: '/members/agenda', label: 'Agenda', icon: Calendar },
    { href: '/members/messages', label: 'Mensagens', icon: Users },
    { href: '/members/worshipful-masters', label: 'Quadro de Veneráveis', icon: Crown },
  ];

  // Don't render anything while loading
  if (loading) {
    return (
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border shadow-soft">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <Triangle className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="font-bold text-lg text-primary">Loja Maçônica</span>
            </Link>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <Triangle className="w-4 h-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg text-primary">Loja Maçônica</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {publicNavItems.map((item) => (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  size="sm"
                  className="transition-smooth"
                >
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-2">
            {user ? (
              <>
                {/* Member Navigation - Only show when user is authenticated */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Shield className="w-4 h-4 mr-1" />
                      Área Restrita
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 bg-background border shadow-lg">
                    {memberNavItems.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link to={item.href} className="flex items-center">
                          <item.icon className="w-4 h-4 mr-2" />
                          {item.label}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <User className="w-4 h-4 mr-1" />
                      {user.email?.split('@')[0]}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-background border shadow-lg">
                    <DropdownMenuItem asChild>
                      <Link to="/profile">Perfil</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <Link to="/auth">
                <Button size="sm" className="bg-gradient-primary hover:opacity-90 transition-smooth">
                  Entrar
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80 bg-background overflow-y-auto max-h-screen">
                <SheetHeader>
                  <SheetTitle className="text-left">Menu</SheetTitle>
                  <SheetDescription className="text-left">
                    Navegue pelas seções do site
                  </SheetDescription>
                </SheetHeader>
                
                <div className="mt-6 space-y-4">
                  {/* Public Navigation */}
                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground">Navegação</h3>
                    {publicNavItems.map((item) => (
                      <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)}>
                        <Button
                          variant={isActive(item.href) ? "default" : "ghost"}
                          className="w-full justify-start"
                        >
                          {item.label}
                        </Button>
                      </Link>
                    ))}
                  </div>

                  {/* Member Navigation - Only show when user is authenticated */}
                  {user && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-semibold text-muted-foreground">Área Restrita</h3>
                      {memberNavItems.map((item) => (
                        <Link key={item.href} to={item.href} onClick={() => setIsOpen(false)}>
                          <Button
                            variant={isActive(item.href) ? "default" : "ghost"}
                            className="w-full justify-start"
                          >
                            <item.icon className="w-4 h-4 mr-2" />
                            {item.label}
                          </Button>
                        </Link>
                      ))}
                    </div>
                  )}

                  {/* Auth Section */}
                  <div className="space-y-2 pt-4 border-t">
                    {user ? (
                      <>
                        <h3 className="text-sm font-semibold text-muted-foreground">Conta</h3>
                        <Link to="/profile" onClick={() => setIsOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start">
                            <User className="w-4 h-4 mr-2" />
                            Perfil
                          </Button>
                        </Link>
                        <Button 
                          variant="ghost" 
                          className="w-full justify-start text-destructive hover:text-destructive"
                          onClick={() => {
                            signOut();
                            setIsOpen(false);
                          }}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sair
                        </Button>
                      </>
                    ) : (
                      <Link to="/auth" onClick={() => setIsOpen(false)}>
                        <Button className="w-full bg-gradient-primary hover:opacity-90">
                          Entrar
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
