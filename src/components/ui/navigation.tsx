import React from 'react';
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
import { User, LogOut, Shield, Book, Users, Calendar, Crown } from 'lucide-react';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();

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

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b border-border shadow-soft">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">⬜</span>
            </div>
            <span className="font-bold text-lg text-primary">Loja Maçônica</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
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

          {/* Auth Section */}
          <div className="flex items-center space-x-2">
            {user ? (
              <>
                {/* Member Navigation */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="hidden md:flex">
                      <Shield className="w-4 h-4 mr-1" />
                      Área Restrita
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
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
                  <DropdownMenuContent align="end">
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
        </div>
      </div>
    </nav>
  );
};