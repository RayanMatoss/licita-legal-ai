
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  documentId?: string;
  documentType?: string;
}

interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export const useConversations = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  // Mensagem de boas-vindas padrão
  const welcomeMessage: Message = {
    id: 'welcome',
    type: 'assistant',
    content: `Olá! Sou a **LicitaIA**, sua assistente especializada em licitações públicas conforme a **Lei 14.133/2021**.

Posso ajudá-lo com:
📋 **Geração de documentos**: DFD, ETP e Termo de Referência
📖 **Consultas à Lei 14.133/2021**: Artigos, procedimentos e interpretações
💬 **Dúvidas técnicas**: Modalidades licitatórias, critérios de julgamento
🔍 **Análise de documentos**: Revisão e sugestões de melhorias

**Para gerar documentos, você pode pedir:**
- "Gere um DFD para contratação de..."
- "Preciso de um ETP para..."
- "Crie um TR para..."

Como posso ajudá-lo hoje?`,
    timestamp: new Date(),
  };

  const createNewConversation = async () => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          user_id: user.id,
          title: 'Nova Conversa',
        })
        .select()
        .single();

      if (error) throw error;

      setCurrentConversationId(data.id);
      setMessages([welcomeMessage]);
      
      return data.id;
    } catch (error) {
      console.error('Erro ao criar conversa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível criar uma nova conversa.",
        variant: "destructive"
      });
      return null;
    }
  };

  const loadConversation = async (conversationId: string) => {
    if (!user) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (error) throw error;

      if (data && data.length > 0) {
        const loadedMessages: Message[] = data.map(msg => ({
          id: msg.id,
          type: msg.role as 'user' | 'assistant',
          content: msg.content,
          timestamp: new Date(msg.created_at),
        }));
        setMessages(loadedMessages);
      } else {
        setMessages([welcomeMessage]);
      }

      setCurrentConversationId(conversationId);
    } catch (error) {
      console.error('Erro ao carregar conversa:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a conversa.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const saveMessage = async (message: Message, conversationId: string) => {
    if (!user || message.id === 'welcome' || message.isTyping) return;

    try {
      await supabase
        .from('messages')
        .insert({
          id: message.id,
          conversation_id: conversationId,
          user_id: user.id,
          role: message.type,
          content: message.content,
        });

      // Atualizar título da conversa se for a primeira mensagem do usuário
      if (message.type === 'user') {
        const title = message.content.length > 50 
          ? message.content.substring(0, 50) + '...'
          : message.content;
        
        await supabase
          .from('conversations')
          .update({ 
            title,
            updated_at: new Date().toISOString()
          })
          .eq('id', conversationId);
      }
    } catch (error) {
      console.error('Erro ao salvar mensagem:', error);
    }
  };

  const addMessage = (message: Message) => {
    setMessages(prev => [...prev, message]);
    
    if (currentConversationId) {
      saveMessage(message, currentConversationId);
    }
  };

  const updateMessage = (messageId: string, updates: Partial<Message>) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, ...updates } : msg
      )
    );
  };

  const removeMessage = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId));
  };

  const startNewChat = async () => {
    const newConversationId = await createNewConversation();
    return newConversationId;
  };

  const selectConversation = (conversationId: string | null) => {
    if (conversationId) {
      loadConversation(conversationId);
    } else {
      setCurrentConversationId(null);
      setMessages([welcomeMessage]);
    }
  };

  return {
    currentConversationId,
    messages,
    loading,
    addMessage,
    updateMessage,
    removeMessage,
    startNewChat,
    selectConversation,
    createNewConversation,
  };
};
