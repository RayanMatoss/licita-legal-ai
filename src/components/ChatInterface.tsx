
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Send, Bot, User, FileText, BookOpen, Scale } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Olá! Sou a **LicitaIA**, sua assistente especializada em licitações públicas conforme a **Lei 14.133/2021**.

Posso ajudá-lo com:
📋 **Geração de documentos**: DFD, ETP e Termo de Referência
📖 **Consultas à Lei 14.133/2021**: Artigos, procedimentos e interpretações
💬 **Dúvidas técnicas**: Modalidades licitatórias, critérios de julgamento
🔍 **Análise de documentos**: Revisão e sugestões de melhorias

Como posso ajudá-lo hoje?`,
      timestamp: new Date(),
    },
  ]);
  
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

**Posso gerar um DFD personalizado para você. Informe:**
- Qual o objeto da contratação?
- Qual a justificativa da necessidade?
- Há estimativa de valor?`;
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

**Para elaborar seu ETP, preciso saber:**
- Tipo de contratação (obra, serviço, fornecimento)?
- Complexidade técnica envolvida?
- Prazo estimado?`;
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

**Vamos criar seu TR? Informe:**
- Objeto específico da licitação?
- Modalidade pretendida?
- Critério de julgamento?`;
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

Quanto mais detalhes você fornecer, melhor poderei ajudá-lo!`;
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
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

    setMessages(prev => [...prev, typingMessage]);

    // Simular delay da IA
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: simulateAIResponse(userMessage.content),
        timestamp: new Date(),
      };

      setMessages(prev => prev.filter(m => m.id !== 'typing').concat(aiResponse));
      setIsLoading(false);
    }, 1500);
  };

  const quickActions = [
    {
      icon: FileText,
      text: 'Gerar DFD',
      action: () => setInputValue('Preciso gerar um Documento de Formalização de Demanda (DFD)')
    },
    {
      icon: FileText,
      text: 'Criar ETP',
      action: () => setInputValue('Como elaborar um Estudo Técnico Preliminar (ETP)?')
    },
    {
      icon: BookOpen,
      text: 'Consultar Lei',
      action: () => setInputValue('Quais são as principais mudanças da Lei 14.133/2021?')
    },
    {
      icon: Scale,
      text: 'Modalidades',
      action: () => setInputValue('Explique as modalidades licitatórias da nova lei')
    }
  ];

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border/60 p-4 bg-card">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-primary text-white">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">LicitaIA - Assistente Especializada</h3>
            <p className="text-sm text-muted-foreground">
              Lei 14.133/2021 • Documentos DFD, ETP, TR
            </p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.type === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {message.type === 'assistant' && (
                <Avatar className="h-8 w-8 bg-primary text-white">
                  <AvatarFallback>
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              
              <Card className={`max-w-[80%] p-4 ${
                message.type === 'user' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'bg-card'
              } ${message.isTyping ? 'animate-pulse' : ''}`}>
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {message.content}
                </div>
                <div className={`text-xs mt-2 opacity-70 ${
                  message.type === 'user' ? 'text-primary-foreground' : 'text-muted-foreground'
                }`}>
                  {message.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </Card>

              {message.type === 'user' && (
                <Avatar className="h-8 w-8 bg-muted">
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

      {/* Quick Actions */}
      {messages.length <= 1 && (
        <div className="p-4 border-t border-border/60 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm text-muted-foreground mb-3 text-center">
              Ações rápidas para começar:
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className="h-auto p-3 flex flex-col items-center gap-2 hover:bg-accent"
                >
                  <action.icon className="h-5 w-5" />
                  <span className="text-xs text-center">{action.text}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="border-t border-border/60 p-4 bg-card">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Digite sua pergunta sobre licitações, Lei 14.133/2021 ou geração de documentos..."
              className="flex-1 h-11"
              disabled={isLoading}
            />
            <Button 
              type="submit" 
              size="sm" 
              className="h-11 px-4"
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
