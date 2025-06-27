
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import ChatHeader from './chat/ChatHeader';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';
import EmptyState from './chat/EmptyState';
import { simulateAIResponse } from './chat/utils/aiResponseSimulator';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  documentId?: string;
  documentType?: string;
}

interface ChatInterfaceProps {
  messages: Message[];
  onAddMessage: (message: Message) => void;
  onUpdateMessage: (messageId: string, updates: Partial<Message>) => void;
  onRemoveMessage: (messageId: string) => void;
  conversationId: string | null;
}

const ChatInterface = ({ 
  messages, 
  onAddMessage, 
  onUpdateMessage, 
  onRemoveMessage,
  conversationId 
}: ChatInterfaceProps) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const generateDocument = async (message: string) => {
    try {
      const response = await supabase.functions.invoke('generate-document', {
        body: { message, userId: user?.id }
      });

      if (response.error) {
        throw response.error;
      }

      return response.data;
    } catch (error: any) {
      console.error('Erro ao gerar documento:', error);
      throw error;
    }
  };

  const downloadDocument = async (documentId: string, title: string) => {
    try {
      const { data: document, error } = await supabase
        .from('documents')
        .select('generated_text, title')
        .eq('id', documentId)
        .single();

      if (error) throw error;

      const blob = new Blob([document.generated_text || ''], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${document.title || title}.txt`;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);

      toast({
        title: "Download realizado",
        description: "O documento foi baixado com sucesso!",
      });
    } catch (error: any) {
      toast({
        title: "Erro no download",
        description: "Não foi possível baixar o documento.",
        variant: "destructive"
      });
    }
  };

  const handleSendMessage = async (messageContent: string) => {
    if (!user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    onAddMessage(userMessage);
    setIsLoading(true);

    // Simular typing indicator
    const typingMessage: Message = {
      id: 'typing',
      type: 'assistant',
      content: 'Digitando...',
      timestamp: new Date(),
      isTyping: true,
    };

    onAddMessage(typingMessage);

    try {
      // Tentar gerar documento primeiro
      const documentResult = await generateDocument(userMessage.content);
      
      if (documentResult.isDocument) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: documentResult.response,
          timestamp: new Date(),
          documentId: documentResult.documentId,
          documentType: documentResult.documentType,
        };

        onRemoveMessage('typing');
        onAddMessage(aiResponse);
        
        toast({
          title: "Documento gerado!",
          description: "Seu documento foi criado com sucesso.",
        });
      } else {
        // Usar resposta simulada se não for documento
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: documentResult.response || simulateAIResponse(userMessage.content),
          timestamp: new Date(),
        };

        onRemoveMessage('typing');
        onAddMessage(aiResponse);
      }
    } catch (error: any) {
      console.error('Erro:', error);
      const errorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: 'Desculpe, ocorreu um erro ao processar sua solicitação. Tente novamente ou use as funcionalidades básicas de consulta.',
        timestamp: new Date(),
      };

      onRemoveMessage('typing');
      onAddMessage(errorResponse);
      
      toast({
        title: "Erro",
        description: "Não foi possível processar sua solicitação.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!conversationId) {
    return <EmptyState />;
  }

  return (
    <div className="flex flex-col h-full bg-white">
      <ChatHeader />
      <MessageList 
        messages={messages} 
        onDownloadDocument={downloadDocument}
      />
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatInterface;
