
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Plus, 
  FileText, 
  BookOpen, 
  User, 
  Settings, 
  LogOut,
  Scale,
  Search,
  History,
  Trash2
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

interface AppSidebarProps {
  currentConversationId: string | null;
  onConversationSelect: (id: string | null) => void;
  onNewChat: () => void;
  onSectionChange: (section: string) => void;
  currentSection: string;
}

const AppSidebar = ({ 
  currentConversationId, 
  onConversationSelect, 
  onNewChat,
  onSectionChange,
  currentSection 
}: AppSidebarProps) => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const loadConversations = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      setConversations(data || []);
    } catch (error) {
      console.error('Erro ao carregar conversas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, [user]);

  const deleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const { error } = await supabase
        .from('conversations')
        .delete()
        .eq('id', conversationId);

      if (error) throw error;

      setConversations(prev => prev.filter(c => c.id !== conversationId));
      
      if (currentConversationId === conversationId) {
        onConversationSelect(null);
      }

      toast({
        title: "Conversa excluída",
        description: "A conversa foi removida com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a conversa.",
        variant: "destructive"
      });
    }
  };

  const navigationItems = [
    {
      id: 'chat',
      label: 'Chat IA',
      icon: MessageSquare,
      description: 'Assistente especializada'
    },
    {
      id: 'documents',
      label: 'Documentos',
      icon: FileText,
      description: 'DFD, ETP, TR'
    },
    {
      id: 'law',
      label: 'Base Legal',
      icon: BookOpen,
      description: 'Lei 14.133/2021'
    },
    {
      id: 'profile',
      label: 'Perfil',
      icon: User,
      description: 'Seus dados'
    }
  ];

  return (
    <div className="flex flex-col h-full w-64 bg-gray-900 text-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 rounded-lg bg-blue-600">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg">LicitaIA</h1>
            <p className="text-xs text-gray-400">Lei 14.133/2021</p>
          </div>
        </div>
        
        <Button 
          onClick={onNewChat}
          className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-600"
          variant="outline"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Chat
        </Button>
      </div>

      {/* Navigation */}
      <div className="p-4 border-b border-gray-700">
        <div className="space-y-1">
          {navigationItems.map((item) => (
            <Button
              key={item.id}
              variant="ghost"
              className={`w-full justify-start text-left p-3 h-auto ${
                currentSection === item.id 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => onSectionChange(item.id)}
            >
              <item.icon className="h-4 w-4 mr-3" />
              <div>
                <div className="font-medium">{item.label}</div>
                <div className="text-xs text-gray-400">{item.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </div>

      {/* Conversations */}
      <div className="flex-1 flex flex-col min-h-0">
        <div className="p-4 pb-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-400">Histórico</h3>
            <History className="h-4 w-4 text-gray-500" />
          </div>
        </div>

        <ScrollArea className="flex-1 px-4">
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-800 rounded animate-pulse" />
              ))}
            </div>
          ) : conversations.length === 0 ? (
            <div className="text-center py-8">
              <MessageSquare className="h-8 w-8 text-gray-600 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Nenhuma conversa ainda</p>
            </div>
          ) : (
            <div className="space-y-1">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`group flex items-center justify-between p-3 rounded cursor-pointer transition-colors ${
                    currentConversationId === conversation.id
                      ? 'bg-gray-800 text-white'
                      : 'hover:bg-gray-800 text-gray-300'
                  }`}
                  onClick={() => onConversationSelect(conversation.id)}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {conversation.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(conversation.updated_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0 text-gray-500 hover:text-red-400"
                    onClick={(e) => deleteConversation(conversation.id, e)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center space-x-3 mb-3">
          <div className="p-2 rounded-full bg-gray-700">
            <User className="h-4 w-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.email?.split('@')[0] || 'Usuário'}
            </p>
            <p className="text-xs text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={signOut}
          className="w-full justify-start text-gray-400 hover:text-red-400"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
};

export default AppSidebar;
