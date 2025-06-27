
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User, Download } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isTyping?: boolean;
  documentId?: string;
  documentType?: string;
}

interface MessageBubbleProps {
  message: Message;
  onDownloadDocument: (documentId: string, title: string) => void;
}

const MessageBubble = ({ message, onDownloadDocument }: MessageBubbleProps) => {
  return (
    <div
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
              onClick={() => onDownloadDocument(message.documentId!, message.content)}
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
  );
};

export default MessageBubble;
