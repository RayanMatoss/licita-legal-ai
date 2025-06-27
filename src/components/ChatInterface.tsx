
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, Download, Paperclip, Mic } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

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
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const simulateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('dfd') || lowerMessage.includes('documento de formalização')) {
      return `**Documento de Formalização de Demanda (DFD)**

O DFD é um documento obrigatório conforme o art. 18 da Lei 14.133/2021. Ele deve conter:

**Estrutura básica:**
1. **Descrição da necessidade** - O que será contratado
2. **Justificativa** - Por que é necessário
3. **Estimativa de custos** - Valores de referência
4. **Prazo de execução** - Cronograma previsto
5. **Fontes de recurso** - Origem do financiamento

**Para gerar um DFD automaticamente, me informe:**
- Qual o objeto da contratação?
- Qual a justificativa da necessidade?
- Há estimativa de valor?

**Exemplo de solicitação:**
"Gere um DFD para contratação de serviços de limpeza, valor estimado R$ 50.000, prazo 12 meses"`;
    }
    
    if (lowerMessage.includes('etp') || lowerMessage.includes('estudo técnico')) {
      return `**Estudo Técnico Preliminar (ETP)**

O ETP é previsto no art. 18, § 1º da Lei 14.133/2021 e deve abordar:

**Elementos obrigatórios:**
1. **Análise de viabilidade** da contratação
2. **Requisitos da contratação**
3. **Estimativa de custos**
4. **Cronograma físico-financeiro**
5. **Sustentabilidade ambiental**
6. **Acessibilidade**
7. **Padronização**
8. **Economicidade**

**Para gerar um ETP automaticamente, me informe:**
- Tipo de contratação (obra, serviço, fornecimento)?
- Especificações técnicas necessárias?
- Prazo estimado?

**Exemplo de solicitação:**
"Preciso de um ETP para aquisição de equipamentos de informática, valor R$ 100.000"`;
    }
    
    if (lowerMessage.includes('termo de referência') || lowerMessage.includes(' tr ')) {
      return `**Termo de Referência (TR)**

O TR é o documento que define o objeto da licitação (art. 40 da Lei 14.133/2021).

**Conteúdo mínimo:**
1. **Definição do objeto** - Especificação detalhada
2. **Fundamentação da contratação**
3. **Descrição da solução**
4. **Requisitos da contratação**
5. **Modelo de execução do objeto**
6. **Modelo de gestão do contrato**
7. **Critérios de medição e pagamento**
8. **Forma de seleção do fornecedor**

**Para gerar um TR automaticamente, me informe:**
- Objeto específico da licitação?
- Especificações técnicas detalhadas?
- Obrigações da contratada e contratante?

**Exemplo de solicitação:**
"Crie um TR para prestação de serviços de segurança, 24h por dia, valor R$ 200.000 anuais"`;
    }
    
    if (lowerMessage.includes('lei') || lowerMessage.includes('14.133')) {
      return `**Lei 14.133/2021 - Nova Lei de Licitações**

Esta lei institui normas gerais de licitação e contratação para as Administrações Públicas.

**Principais novidades:**
- **Diálogo competitivo** (modalidade nova)
- **Credenciamento** (modalidade reformulada)  
- **Portal Nacional de Contratações Públicas**
- **Contratação integrada**
- **Remuneração variável**

**Artigos mais consultados:**
- Art. 18 - Fase de planejamento
- Art. 40 - Termo de referência
- Art. 54 - Modalidades licitatórias
- Art. 75 - Critérios de julgamento

Sobre qual artigo específico gostaria de saber mais?`;
    }
    
    return `Entendi sua pergunta sobre "${userMessage}". 

Para oferecer a resposta mais precisa possível, preciso de um pouco mais de contexto. Você está buscando informações sobre:

🔹 **Elaboração de documentos** (DFD, ETP, TR)?
🔹 **Consulta à Lei 14.133/2021**?
🔹 **Procedimentos licitatórios**?
🔹 **Dúvidas específicas** sobre algum processo?

**Para gerar documentos automaticamente, você pode usar comandos como:**
- "Gere um DFD para..."
- "Preciso de um ETP para..."
- "Crie um TR para..."

Quanto mais detalhes você fornecer, melhor poderei ajudá-lo!`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    onAddMessage(userMessage);
    setInputValue('');
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
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Bem-vindo à LicitaIA
          </h2>
          <p className="text-gray-500 mb-4">
            Selecione uma conversa ou inicie um novo chat para começar
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4 bg-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-blue-600 text-white">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-900">LicitaIA</h3>
            <p className="text-sm text-gray-600">
              Assistente para Lei 14.133/2021
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'assistant' && (
                <Avatar className="h-8 w-8 bg-blue-600 text-white">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <Card className={`max-w-[80%] p-4 ${
                message.type === 'user' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-50 border-gray-200'
              } ${message.isTyping ? 'animate-pulse' : ''}`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                
                {/* Botão de download para documentos gerados */}
                {message.documentId && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => downloadDocument(message.documentId!, message.content)}
                      className="text-xs"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Baixar Documento
                    </Button>
                  </div>
                )}
                
                <div className={`text-xs mt-2 opacity-70 ${
                  message.type === 'user' ? 'text-blue-100' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </Card>

              {message.type === 'user' && (
                <Avatar className="h-8 w-8 bg-gray-200">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-xl bg-white shadow-sm">
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
              disabled
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua pergunta sobre licitações..."
              className="flex-1 border-none shadow-none focus-visible:ring-0 text-sm"
              disabled={isLoading}
            />
            
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
              disabled
            >
              <Mic className="h-4 w-4" />
            </Button>
            
            <Button 
              type="submit" 
              size="sm" 
              className="h-8 w-8 p-0 bg-blue-600 hover:bg-blue-700"
              disabled={!inputValue.trim() || isLoading}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
