
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { 
  MessageCircle, 
  FileText, 
  BookOpen, 
  History, 
  Settings, 
  Scale,
  User,
  LogOut,
  FolderOpen,
  PlusCircle,
  Search
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface AppSidebarProps {
  onLogout: () => void;
  currentSection: string;
  onSectionChange: (section: string) => void;
}

const AppSidebar = ({ onLogout, currentSection, onSectionChange }: AppSidebarProps) => {
  const mainItems = [
    {
      title: 'Chat IA',
      url: 'chat',
      icon: MessageCircle,
      description: 'Conversar com a IA especializada'
    },
    {
      title: 'Gerar Documentos',
      url: 'documents',
      icon: FileText,
      description: 'Criar DFD, ETP e TR'
    },
    {
      title: 'Consultar Lei',
      url: 'law',
      icon: BookOpen,
      description: 'Lei 14.133/2021'
    },
    {
      title: 'Modelos',
      url: 'templates',
      icon: FolderOpen,
      description: 'Banco de modelos'
    }
  ];

  const utilityItems = [
    {
      title: 'Histórico',
      url: 'history',
      icon: History,
      description: 'Conversas anteriores'
    },
    {
      title: 'Buscar',
      url: 'search',
      icon: Search,
      description: 'Pesquisar documentos'
    },
    {
      title: 'Configurações',
      url: 'settings',
      icon: Settings,
      description: 'Preferências'
    }
  ];

  return (
    <Sidebar className="border-r border-border/60">
      <SidebarHeader className="border-b border-border/60 p-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary text-white">
            <Scale className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gradient">LicitaIA</h2>
            <p className="text-xs text-muted-foreground">Lei 14.133/2021</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-2 mb-2">
            PRINCIPAIS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => onSectionChange(item.url)}
                    className={`w-full justify-start h-auto p-3 rounded-lg transition-all duration-200 hover:bg-accent/60 ${
                      currentSection === item.url 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'hover:bg-accent'
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <div className="flex flex-col items-start">
                      <span className="font-medium">{item.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="text-xs font-semibold text-muted-foreground px-2 mb-2">
            FERRAMENTAS
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {utilityItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    onClick={() => onSectionChange(item.url)}
                    className={`w-full justify-start h-auto p-3 rounded-lg transition-all duration-200 ${
                      currentSection === item.url 
                        ? 'bg-primary/10 text-primary border border-primary/20' 
                        : 'hover:bg-accent'
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <div className="flex flex-col items-start">
                      <span className="text-sm">{item.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.description}
                      </span>
                    </div>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <Separator className="my-4" />

        <div className="p-3 bg-muted/30 rounded-lg">
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-start"
            onClick={() => onSectionChange('new-chat')}
          >
            <PlusCircle className="h-4 w-4 mr-2" />
            Nova Conversa
          </Button>
        </div>
      </SidebarContent>

      <SidebarFooter className="border-t border-border/60 p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 rounded-full bg-muted">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Usuário Autorizado</p>
            <p className="text-xs text-muted-foreground truncate">
              usuario@orgao.gov.br
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onLogout}
          className="w-full justify-start text-muted-foreground hover:text-destructive"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
